const db = require("../../../db/db");

const createUser = async (value) => {
  try {
    const time = new Date().toJSON();
    const queryText = `INSERT INTO user(name, phone, email, password, role, status,companyId, updatedAt) 
                       VALUES ('${value.name}','${value.phone}','${value.email}','${value.password}','admin','active','${value.companyId}','${time}')`;

    const [rows] = await db.query(queryText);
    return rows;
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (query, role, companyId) => {
  try {
    let { page, limit, sort_type, sort_by, search } = query;
    const condition = role === "admin" ? `companyId = ${companyId}` : 1;

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const offset = limit * page - limit;

    const userQuery = ` SELECT id, name, phone, email, role, status, companyId, createdAt, updatedAt, 
                            (SELECT COUNT(*) FROM user WHERE ${condition} AND (name LIKE '%${
      search || ""
    }%' OR phone LIKE '%${search || ""}%' OR email LIKE '%${
      search || ""
    }%' OR status LIKE '%${search || ""}%' )) AS total_user  
                        FROM user
                        WHERE ${condition} AND (name LIKE '%${
      search || ""
    }%' OR phone LIKE '%${search || ""}%' OR email LIKE '%${
      search || ""
    }%' OR status LIKE '%${search || ""}%' )
                        ORDER BY ${sort_by || "createdAt"} ${
      sort_type || "asc"
    } LIMIT ${limit} OFFSET ${offset} `;


    const [rows] = await db.query(userQuery, companyId);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getSingleUser = async (userId, companyId, role) => {
  let condition1 = 1;

  if (role !== "superAdmin") {
    condition1 = `companyId = ${companyId} `;
  }

  try {
    const queryText = `SELECT id, name, phone ,email, role, status, companyId, createdAt, updatedAt
                        FROM user WHERE ${condition1} AND id = ${userId}`;

    const [rows] = await db.query(queryText);
    return rows;
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (data, userId) => {
  try {
    const time = new Date().toJSON();

    const queryText = `UPDATE user SET name='${data.name}', phone='${data.phone}', email='${data.email}', role='${data.role}', status='${data.status}', updatedAt='${time}'
                       WHERE id=${userId}`;

    const updated = await db.query(queryText);

    if (updated[0].affectedRows > 0) {
      const queryText = `SELECT id, name, email, phone, status, role, companyId, createdAt, updatedAt 
                          FROM user 
                          WHERE id=${userId}`;

      const updatedUser = await db.query(queryText);

      return updatedUser[0][0];
    }
  } catch (error) {
    throw new Error(error);
  }
};

const checkUserById = async (userId) => {
  try {
    const userQueryText = `SELECT role, companyId, status FROM user WHERE id=${userId}`;
    const [rows] = await db.query(userQueryText);

    const user = rows[0];
    if (user) {
      return {
        companyId: user.companyId,
        role: user.role,
        status: user.status,
      };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUserById = async (userId) => {
  try {
    const userQueryText = `DELETE FROM user WHERE id=${userId}`;
    const [rows] = await db.query(userQueryText);

    if (rows.affectedRows > 0) {
      return true;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  checkUserById,
  deleteUserById,
};
