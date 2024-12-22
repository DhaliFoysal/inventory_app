const prisma = require("../../../db/prisma");

const findCompanyByUserIdAndCompanyId = async (userId, companyId) => {
  const company = await prisma.company.findMany({
    where: {
      AND: [{ id: companyId }, { userId: userId }],
    },
  });

  return company.length > 0 ? company[0] : null;
  
};

module.exports = {
    findCompanyByUserIdAndCompanyId,
};