const db = require("../../../db/db");

const createUnit = async (value, userId) => {
  try {
    const checkQuery = `SELECT * FROM measurementUnit WHERE name='${value.name}'`;
    const unit = await db.query(checkQuery);

    if (unit[0].length > 0) {
      return { code: 409, data: "" };
    }

    const postQuery = `INSERT INTO measurementUnit (name, symbol, userId)
                        VALUES ('${value.name}','${value.symbol}','${userId}')`;

    const createUnit = await db.query(postQuery);
    const insertId = createUnit[0]?.insertId;
    const createdUnit = await db.query(
      `SELECT * FROM measurementUnit WHERE id='${insertId}'`
    );

    return { code: "", data: createdUnit[0][0] };
  } catch (error) {
    throw new Error(error);
  }
};

const getUnits = async () => {
  try {
    const unitQuery = `SELECT * FROM measurementUnit WHERE 1`;
    const units = await db.query(unitQuery);

    return { code: 200, data: units[0] };
  } catch (error) {
    throw new Error(error);
  }
};

const getSingleUnit = async (id) => {
  try {
    const unitQuery = `SELECT * FROM measurementUnit WHERE id=${id}`;
    const units = await db.query(unitQuery);
    if (units[0].length <= 0) {
      return { code: 404, data: "" };
    }

    return { code: 200, data: units[0][0] };
  } catch (error) {
    throw new Error(error);
  }
};

const updateUnit = async (value, id) => {
  const time = new Date().toISOString();
  try {
    const checkQuery = `SELECT * FROM measurementUnit WHERE id='${id}'`;
    const unit = await db.query(checkQuery);
    if (unit[0].length <= 0) {
      return { code: 404, data: "" };
    }

    const checkByNameQuery = `SELECT * FROM measurementUnit 
                                WHERE name='${value.name}' AND id<>'${id}'`;

    const unitByName = await db.query(checkByNameQuery);
    if (unitByName[0].length > 0) {
      return { code: 409, data: "" };
    }

    const updateQuery = `UPDATE measurementunit 
                            SET name='${value.name}',symbol='${value.symbol}', updatedAt='${time}' 
                            WHERE id=${id}`;

    await db.query(updateQuery);

    const updatedUnit = await db.query(checkQuery);

    return { code: 200, data: updatedUnit[0][0] };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUnitById = async (id) => {
  try {
    const checkQuery = `SELECT * FROM measurementUnit WHERE id='${id}'`;
    const unit = await db.query(checkQuery);

    if (unit[0].length <= 0) {
      return { code: 404, data: "" };
    }

    const deleteQuery = `DELETE FROM measurementunit WHERE id='${id}'`;

    await db.query(deleteQuery);

    return { code: 204, data: "" };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createUnit,
  getUnits,
  getSingleUnit,
  updateUnit,
  deleteUnitById,
};
