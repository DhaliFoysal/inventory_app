const prisma = require("../../../db/prisma");

const createUser = async (userData, companyId) => {
  try {
    const isCompany = await prisma.company.findMany({
      where: {
        id: companyId,
      },
    });
    console.log(isCompany);

    if (isCompany.length <= 0) {
      return { isCompany: false };
    }
    const user = await prisma.user.create({
      data: { ...userData, companyId: companyId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        status: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUsers = async (data) => {
  const { role, companyId, offset, queries } = data;
  const { page, limit, sort_type, sort_by, search } = queries;

  try {
    const getUser = async () => {
      if (role === "superAdmin") {
        const users = await prisma.user.findMany({
          skip: offset,
          take: limit,
          where: {
            OR: [
              { name: { contains: search, lte: "insensitive" } },
              { phone: { contains: search, lte: "insensitive" } },
              { email: { contains: search, lte: "insensitive" } },
            ],
          },
          orderBy: {
            [sort_by || "name"]: sort_type || "asc",
          },
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            status: true,
            companyId: true,
            createBy: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        const total_items = await prisma.user.count({
          where: {
            OR: [
              { name: { contains: search, lte: "insensitive" } },
              { phone: { contains: search, lte: "insensitive" } },
              { email: { contains: search, lte: "insensitive" } },
            ],
          },
        });
        return { users, total_items };
      } else {
        const users = await prisma.user.findMany({
          where: {
            companyId: companyId,
            OR: [
              { name: { contains: search, lte: "insensitive" } },
              { phone: { contains: search, lte: "insensitive" } },
              { email: { contains: search, lte: "insensitive" } },
            ],
          },
          skip: offset,
          take: page,
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            status: true,
            companyId: true,
            createBy: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        const total_items = await prisma.user.count({
          where: {
            companyId: companyId,
            OR: [
              { name: { contains: search, lte: "insensitive" } },
              { phone: { contains: search, lte: "insensitive" } },
              { email: { contains: search, lte: "insensitive" } },
            ],
          },
        });
        return { users, total_items };
      }
    };
    return await getUser();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getSingleUser = async (data) => {
  const { userId, companyId, role } = data;

  try {
    const user = await prisma.user.findMany({
      where: role === "superAdmin" ? { id: userId } : { id: userId, companyId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        status: true,
        companyId: true,
        createBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (user.length > 0) {
      return user[0];
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (data, userId) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUserById = async (userId) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deletedUser;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUserById,
};
