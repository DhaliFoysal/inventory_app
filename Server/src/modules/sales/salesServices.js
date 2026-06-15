const prisma = require("../../../db/prisma");

const getSingleCustomerById = (data) => {
  const { id, companyId } = data;

  const customer = prisma.customers.findFirst({
    where: {
      id,
      companyId,
    },
  });
  return customer;
};
const getAllProductsById = (companyId, productIds) => {
  const products = prisma.products.findMany({
    where: {
      id: { in: productIds },
      companyId,
    },
  });
  return products;
};

const getInventoriesById = (companyId, productIds) => {
  const inventories = prisma.inventories.findMany({
    where: {
      productId: { in: productIds },
      companyId,
    },
  });
  return inventories;
};

const getAllPaymentMethod = (data) => {
  const { accountNumber, companyId } = data;

  const paymentMethods = prisma.accounts.findMany({
    where: {
      accountNumber: { in: accountNumber },
      companyId,
    },
  });

  return paymentMethods;
};

module.exports = {
  getSingleCustomerById,
  getAllProductsById,
  getInventoriesById,
  getAllPaymentMethod,
};
