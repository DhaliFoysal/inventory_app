const db = require("../../../db/db");

const createTax = async (req) => {
  try {
    let taxId;
    const { percent, title } = req.body;
    const { userId } = req;
    const checkQuery = `SELECT * FROM tax 
                        WHERE title='${title}' OR id='${taxId}'`;

    const isTax = await db.query(checkQuery);
    if (isTax[0].length > 0) {
      return {
        code: 409,
        data: {},
      };
    }

    const createQuery = `INSERT INTO tax ( percent, title, userId) 
                        VALUES (${percent},'${title}','${userId}')`;

    await db.query(createQuery);
    const newTax = await db.query(checkQuery);

    return { code: 201, data: newTax[0][0] };
  } catch (error) {
    throw new Error(error);
  }
};

const getTaxes = async () => {
  try {
    const getQuery = `SELECT id, percent, title FROM tax WHERE 1 `;

    const tax = await db.query(getQuery);

    return { code: 201, data: tax[0] };
  } catch (error) {
    throw new Error(error);
  }
};

const getSingleTax = async (id) => {
  try {
    const getQuery = `SELECT * FROM tax WHERE id=${id} `;

    const tax = await db.query(getQuery);

    if (tax[0].length <= 0) {
      return { code: 404, data: "" };
    }

    return { code: 201, data: tax[0][0] };
  } catch (error) {
    throw new Error(error);
  }
};

const updateSingleTax = async (value, id, userId) => {
  const time = new Date().toISOString();
  try {
    const getQueryById = `SELECT * FROM tax WHERE id=${id}`;
    const getQueryByTitle = `SELECT * FROM tax WHERE title='${value.title}' id<>'${id}'`;

    const updateQuery = `UPDATE tax SET percent='${value.percent}',title='${value.title}', updatedAt='${time}' 
                          WHERE id='${id}' AND userId='${userId}'`;

    const tax = await db.query(getQueryById);
    if (tax[0].length <= 0) {
      return { code: 404, data: "" };
    }

    const taxByTitle = await db.query(getQueryByTitle);
    if (taxByTitle[0].length > 0) {
      return { code: 409, data: "" };
    }
    await db.query(updateQuery);
    const updatedTax = await db.query(getQueryById);

    return { code: 201, data: updatedTax[0][0] };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTaxById = async (id) => {
  try {
    const getQuery = `SELECT * FROM tax WHERE id='${id}'`;
    const deleteQuery = `DELETE FROM tax WHERE id='${id}'`;

    const getTax = await db.query(getQuery);
    if (getTax[0].length <= 0) {
      return { code: 404, data: "" };
    }

    await db.query(deleteQuery);
    return { code: 204, data: "" };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createTax,
  getTaxes,
  getSingleTax,
  updateSingleTax,
  deleteTaxById,
};
