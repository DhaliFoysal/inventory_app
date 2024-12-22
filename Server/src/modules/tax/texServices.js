const prisma = require("../../../db/prisma.js");

const createTax = async (data, companyId) => {
  try {
    const isTax = await prisma.tax.findMany({
      where: {
        AND: [
          { title: data.title },
          {
            OR: [{ companyId: companyId }, { companyId: "global" }],
          },
        ],
      },
    });

    if (isTax.length > 0) {
      return { isTax: true };
    }

    const tax = await prisma.tax.create({
      data: {
        ...data,
        companyId,
      },
    });
    return tax;
  } catch (error) {
    throw new Error(error);
  }
};

const getTaxes = async (companyId) => {
  try {
    const tax = await prisma.tax.findMany({
      where: {
        OR: [{ companyId }, { companyId: "global" }],
      },
    });

    return tax;
  } catch (error) {
    throw new Error(error);
  }
};

const getSingleTax = async (id, companyId, role) => {
  try {
    const orValue = [];

    if (role !== "superAdmin") {
      orValue.push({ companyId });
    }

    const tax = await prisma.tax.findMany({
      where: {
        AND: [
          { id },
          {
            OR: orValue,
          },
        ],
      },
    });

    if (tax.length > 0) {
      return tax[0];
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateSingleTax = async (data, id) => {
  try {
    const updatedTax = await prisma.tax.update({
      where: {
        id: id,
      },
      data: { ...data },
    });

    return updatedTax;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTaxById = async (id) => {
  try {
    const deletedTax = await prisma.tax.delete({
      where: {
        id,
      },
    });
    return deletedTax;
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