const db = require("../../../db/db");

const createPost = async (value, companyId, userId) => {
  try {
    const customerQuery = `INSERT INTO customers(name, email, phone, address, isTrader, userId, companyId) 
                            VALUES ('${value.name}','${value.email || ""}','${
      value.phone
    }','${value.address}','${value.isTrader}','${userId}','${companyId}')`;

    const customer = await db.query(customerQuery);
    const customId = customer[0]?.insertId;

    const newCustomerQuery = `SELECT * FROM customers WHERE id='${customId}'`;
    const newCustomer = await db.query(newCustomerQuery);

    return { code: 201, data: newCustomer[0][0] };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createPost,
};
