const prisma = require("../../../db/prisma");

const getCompanyById = async (companyId) => {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });
  return company;
};

module.exports = {
  getCompanyById,
};
