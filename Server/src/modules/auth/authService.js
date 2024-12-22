const prisma = require("../../../db/prisma");
const bcrypt = require("bcrypt");

const createUser = async (userData, companyData) => {
  try {
    // check user is Exist
    const isUser = await prisma.user.findUnique({
      where: {
        [userData.createBy]: userData[userData.createBy],
      },
    });

    if (isUser) {
      return { isUser: true };
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...userData,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      });

      const company = await tx.company.create({
        data: {
          ...companyData,
          userId: user.id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          companyId: company.id,
        },
      });

      return { user, company };
    });

    const newUser = result.user;
    newUser.companyId = result.company.id;
    newUser.companyName = result.company.name;

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

const signIn = async (userData) => {
  const user = await prisma.user.findMany({
    where: {
      OR: [{ email: userData.userName }, { phone: userData.userName }],
    },
  });
  if (user.length > 0) {
    return user[0];
  } else {
    return null;
  }
};

module.exports = {
  createUser,
  signIn,
  // createCompany,
};
