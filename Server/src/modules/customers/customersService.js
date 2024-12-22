const prisma = require("../../../db/prisma");

const createCustomer = async (customerData, companyId) => {
  try {
    const isCustomer = await prisma.customers.findMany({
      where: {
        OR: [{ phone: customerData.phone }, { email: customerData.email }],
      },
    });

    if (isCustomer.length > 0){
      return { isCustomer: true };
    }

    const customer = await prisma.customers.create({
      data: { ...customerData, companyId },
    });
    return customer;
  } catch (error) {
    throw new Error(error);
  }
};

// const fetchAllCustomer = async (query, companyId) => {
//   try {
//     const { sort_type, sort_by, field } = query;
//     const filterName = query["filter.name"];
//     const filterContactNo = query["filter.contactNo"];
//     const page = parseInt(query.page);
//     const limit = parseInt(query.limit);
//     const offset = page * limit - limit;

//     const customerQuery = ` SELECT  ${field || "*"},
//                             (SELECT COUNT(*) FROM customers WHERE companyId = ${companyId} AND name LIKE '%${
//       filterName || ""
//     }%' AND phone LIKE '%${filterContactNo || ""}%' ) AS total_customers
//                         FROM customers
//                         WHERE companyId = ${companyId} AND name LIKE '%${
//       filterName || ""
//     }%' AND phone LIKE '%${filterContactNo || ""}%'
//                         ORDER BY ${sort_by || "createdAt"} ${
//       sort_type || "asc"
//     } LIMIT ${limit} OFFSET ${offset} `;
//     const customers = await db.query(customerQuery);

//     console.log(customers);

//     return customers[0];
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const customersForDropdown = async (search, companyId) => {
//   try {
//     const searchQuery = `SELECT * FROM customers WHERE name LIKE '%${search}%' OR phone LIKE '%${search}%' AND (companyId = ${companyId})`;
//     const customers = await db.query(searchQuery);

//     return customers[0];
//   } catch (error) {
//     throw new Error(error);
//   }

// };

// const fetchAllCustomerById = async (id, companyId) => {
//   try {
//     const querySQL = `SELECT * FROM customers WHERE id = ${id} AND companyId = ${companyId}`;
//     const customers = await db.query(querySQL);
//     return customers[0];
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const customerUpdate = async (customerId, companyId, data) => {
//   try {
//     const time = new Date().toISOString();
//     const customerQuery = `SELECT * FROM customers WHERE id = ${customerId} AND companyId = ${companyId}`;
//     const updateQuery = `UPDATE customers SET name= '${data.name}', email= '${data.email}', phone= '${data.phone}',
//                  address= '${data.address}', isTrader= ${data.isTrader}, updatedAt='${time}' WHERE id = ${customerId}`;

//     const isCustomer = await db.query(customerQuery);

//     if (isCustomer[0].length <= 0) {
//       return false;
//     }

//     await db.query(updateQuery);
//     const updatedCustomer = await db.query(
//       `SELECT * FROM customers WHERE id = ${customerId}`
//     );

//     return updatedCustomer[0];
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const customerDelete = async (customerId, companyId) => {
//   const customerQuery = `SELECT id, companyId, name FROM customers WHERE id = ${customerId} AND companyId = ${companyId}`;
//   const deleteQuery = `DELETE FROM customers WHERE id = ${customerId} AND companyId = ${companyId}`;
//   try {
//     const isCustomer = await db.query(customerQuery);
//     if (isCustomer[0].length <= 0) {
//       return false;
//     }

//     const result = await db.query(deleteQuery);
//     return true;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

module.exports = {
  createCustomer,
  // fetchAllCustomer,
  // customersForDropdown,
  // fetchAllCustomerById,
  // customerUpdate,
  // customerDelete,
};
