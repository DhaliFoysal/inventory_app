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

module.exports = { postCategory, getCategories };
