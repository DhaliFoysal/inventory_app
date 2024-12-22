const prisma = require("../../../db/prisma");

const createWarehouse = async ({ data, companyId, role }) => {
  try {
    const isWarehouseExist = await prisma.warehouse.findFirst({
      where: {
        name: data.name,
        OR: [{ companyId }, { companyId: "global" }],
      },
    });

    if (isWarehouseExist) {
      return { isWarehouseExist: true };
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        ...data,
        companyId: role === "superAdmin" ? "global" : companyId,
      },
    });

    return warehouse;
  } catch (error) {
    throw new Error(error);
  }
};

const getManyWarehouseById = async ({ ids, companyId, role }) => {
  try {
    const warehouse = await prisma.warehouse.findMany({
      where: {
        OR: [
          {
            companyId,
          },
          {
            companyId: "global",
          },
        ],
        id: {
          in: ids,
        },
      },
    });
    return warehouse;
  } catch (error) {
    throw new Error(error);
  }
};

const getWarehouseByProductId = async ({ id, companyId, role }) => {
  try {
    const warehouse = await prisma.warehouse.findMany({
      where: role === "superAdmin" ? { id } : { id, companyId },
    });

    return warehouse;
  } catch (error) {
    throw new Error(error);
  }
};

const getSingleWarehouseById = async ({ id, companyId, role }) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: role === "superAdmin" ? { id } : { id, companyId },
  });

  return warehouse;
};

const getAllWarehouse = async ({ companyId, role }) => {
  try {
    const warehouse = await prisma.warehouse.findMany({
      where: {
        OR: [
          {
            companyId,
          },
          {
            companyId: "global",
          },
        ],
      },
    });

    return warehouse;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteWarehouseById = async ({ id, companyId, role }) => {
  try {
    await prisma.warehouse.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const updateWarehouseById = async ({ id, data, companyId }) => {
  try {
    const isWarehouseExist = await prisma.warehouse.findMany({
      where: {
        name: data.name, // check if warehouse name is already exist
        OR: [{ companyId }, { companyId: "global" }],
        NOT: { id }, // exclude the current warehouse id
      },
    });

    if (isWarehouseExist.length > 0) {
      return { warehouseExist: true };
    }

    const updatedWarehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return updatedWarehouse;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getManyWarehouseById,
  createWarehouse,
  getWarehouseByProductId,
  getSingleWarehouseById,
  getAllWarehouse,
  deleteWarehouseById,
  updateWarehouseById,
};
