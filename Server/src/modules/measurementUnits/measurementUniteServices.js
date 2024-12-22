const prisma = require("../../../db/prisma");

const createUnit = async (data) => {
  try {
    // check is Unit
    const isUnit = await prisma.measurement_Unit.findMany({
      where: {
        AND: [{ type: data.type }, { companyId: data.companyId }],
      },
    });
    if (isUnit.length > 0) {
      return { isUnit: true };
    }

    const unit = prisma.measurement_Unit.create({
      data: { ...data },
    });

    return unit;
  } catch (error) {
    throw new Error(error);
  }
};

const getUnits = async (companyId) => {
  try {
    const units = await prisma.measurement_Unit.findMany({
      where: {
        companyId,
      },
    });
    return units;
  } catch (error) {
    throw new Error(error);
  }
};

const getSingleUnit = async ({ id, companyId, role }) => {
  try {
    const unit = await prisma.measurement_Unit.findMany({
      where:
        role === "superAdmin"
          ? { id }
          : {
              id,
              OR: [{ companyId }, { companyId: "global" }],
            },
    });

    if (unit.length > 0) {
      return unit[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateUnit = async (data, id) => {
  try {
    const result = await prisma.measurement_Unit.update({
      where: {
        id,
      },
      data: { ...data },
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUnitById = async (id) => {
  try {
    const deletedUnit = await prisma.measurement_Unit.delete({
      where: {
        id,
      },
    });

    return deletedUnit;
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
