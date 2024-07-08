const db = require("../../../db/db");
const postCategory = async (req) => {
  try {
    const { name, description } = req.body;
    const { companyId, userId } = req;

    const createQuery = `INSERT INTO categories (name, description, companyId, userId) 
                        VALUES ('${name}','${description}','${companyId}','${userId}')`;

    const [rows] = await db.query(createQuery);

    let data = {};
    if (rows.insertId) {
      (data.id = rows.insertId),
        (data.name = name),
        (data.companyId = companyId),
        (data.userId = userId);
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

const getCategories = async (req, limit, offset) => {
  const { sort_by, sort_type, search } = req.query;

  try {
    const categoriesQuery = ` SELECT *, 
                                (SELECT COUNT(*) FROM categories WHERE (companyId=${
                                  req.companyId
                                } OR companyId = 0) AND name LIKE '%${
      search || ""
    }%') AS total_categories
                                FROM categories
                                WHERE (companyId=${
                                  req.companyId
                                } OR companyId ='0') AND name LIKE '%${
      search || ""
    }%'
                                ORDER BY ${sort_by || "createdAt"} ${
      sort_type || "asc"
    } LIMIT ${limit} OFFSET ${offset} `;

    const result = await db.query(categoriesQuery);

    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

const getCategoriesById = async (categoryId, companyId, userId) => {
  try {
    const categoryQuery = `SELECT * FROM categories 
                      WHERE companyId=${companyId} AND id= ${categoryId}`;
    const result = await db.query(categoryQuery);
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

const updateCategoriesById = async (value, id, companyId, userId) => {
  try {
    const time = new Date().toISOString();
    const checkQuery = `SELECT * FROM categories WHERE id=${id}`;
    const categoryQuery = `UPDATE categories SET name='${value.name}', description='${value.description}', updatedAt='${time}' WHERE id=${id} AND companyId=${companyId}`;

    const isId = await db.query(checkQuery);

    if (isId[0].length <= 0) {
      return { code: 404 };
    }
    const result = await db.query(categoryQuery);

    if (result[0].affectedRows) {
      const updatedCategory = await db.query(checkQuery);
      return { code: 200, data: updatedCategory[0][0] };
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  postCategory,
  getCategories,
  getCategoriesById,
  updateCategoriesById,
};
