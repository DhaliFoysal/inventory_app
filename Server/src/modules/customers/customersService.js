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

const fetchAllCustomer = async (query, companyId) => {
  try {
    const { sort_type, sort_by, field } = query;
    const filterName = query["filter.name"];
    const filterContactNo = query["filter.contactNo"];
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const offset = page * limit - limit;

    const customerQuery = ` SELECT  ${field || "*"}, 
                            (SELECT COUNT(*) FROM customers WHERE companyId = ${companyId} AND name LIKE '%${
      filterName || ""
    }%' AND phone LIKE '%${filterContactNo || ""}%' ) AS total_customers  
                        FROM customers
                        WHERE companyId = ${companyId} AND name LIKE '%${
      filterName || ""
    }%' AND phone LIKE '%${filterContactNo || ""}%'
                        ORDER BY ${sort_by || "createdAt"} ${
      sort_type || "asc"
    } LIMIT ${limit} OFFSET ${offset} `;
    const customers = await db.query(customerQuery);

    return customers[0];
  } catch (error) {
    throw new Error(error);
  }
};

const fetchAllCustomerById = async (id, companyId) => {
  try {
    const querySQL = `SELECT * FROM customers WHERE id = ${id} AND companyId = ${companyId}`;
    const customers = await db.query(querySQL);
    return customers[0];
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createPost,
  fetchAllCustomer,
  fetchAllCustomerById,
};
