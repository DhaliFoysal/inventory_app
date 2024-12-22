const prisma = require("../../../db/prisma");

const getManySerialNumberById = async ({ ids, companyId }) => {
  const serialNumbers = await prisma.serial_numbers.findMany({
    where: {
      companyId,
      serialNumber: {
        in: ids,
      },
    },
  });
  return serialNumbers;
};

module.exports = {
  getManySerialNumberById,
};
