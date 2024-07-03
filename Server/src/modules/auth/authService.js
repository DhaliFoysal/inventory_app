const db = require("../../../db/db");
const bcrypt = require("bcrypt");

const checkUser = async (userName, password) => {
  const queryText = `SELECT *
                     FROM user 
                     WHERE (phone = '${userName}' OR email = '${userName}')`;
  try {
    const [rows] = await db.query(queryText);

    let isValid;
    if (rows.length > 0) {
      isValid = await bcrypt.compare(password, rows[0].password);
      delete rows[0].password;
      delete rows[0].createdAt;
      delete rows[0].updatedAt;
    }

    if (isValid) {
      return {
        userIsValid: true,
        user: rows[0],
      };
    }
    return {
      userIsValid: false,
      user: null,
    };
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createUser = async (value) => {
  const time = new Date().toJSON();
  const queryText = `INSERT INTO user(name, phone, email, password, role, status, updatedAt) 
                     VALUES ('${value.name}','${value.phone}','${value.email}','${value.password}','admin','active','${time}')`;

  const [rows] = await db.query(queryText);
  return rows;
};

const getUser = async (userId) => {
  const queryText = `SELECT * FROM user WHERE id = ${userId}`;

  const [rows, fields] = await db.query(queryText);
  delete rows[0].password;

  return rows[0];
};

const createCompany = async (value) => {
  const time = new Date().toJSON();

  const queryText = `INSERT INTO company (userId, name, address, updatedAt)
                     VALUES ('${value.userId}','${value.name}','${value.address}','${time}')`;

  try {
    const [rows] = await db.query(queryText);
    const companyId = rows.insertId;

    if (companyId) {
      const updateQueryText = `UPDATE user SET companyId = '${companyId}', updatedAt='${time}' WHERE id = '${value.userId}'`;
      const [rows] = await db.query(updateQueryText);
    }

    const newUserQuery = `SELECT id, name, phone, email, role, status, companyId, createdAt, updatedAt 
                          FROM user WHERE id = ${value.userId}`;
    const newUser = await db.query(newUserQuery);

    return newUser[0][0];
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  checkUser,
  createUser,
  getUser,
  createCompany,
};
