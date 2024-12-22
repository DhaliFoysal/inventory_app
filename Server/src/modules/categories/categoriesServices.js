const prisma = require("../../../db/prisma");

const postCategory = async (data) => {
  try {
    const isCategory = await prisma.productsCategory.findMany({
      where: {
        AND: [{ name: data.name }, { companyId: data.companyId }],
      },
    });
    if (isCategory.length > 0) {
      return { isCategory: true };
    }

    const category = await prisma.productsCategory.create({
      data: { ...data },
    });
    return category;
  } catch (error) {
    throw new Error(error);
  }
};

const getCategories = async (companyId) => {
  try {
    const categories = await prisma.productsCategory.findMany({
      where: {
        companyId,
      },
    });

    return categories;
  } catch (error) {
    throw new Error(error);
  }
};

const getCategoriesById = async (data) => {
  try {
    const category = await prisma.productsCategory.findMany({
      where: {
        AND: [{ id: data.id }, { companyId: data.companyId }],
      },
    });

    if (category.length > 0) {
      return category[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateCategoriesById = async (data) => {
  const { categoryData, companyId, id } = data;
  try {
    const result = await prisma.productsCategory.updateMany({
      where: {
        AND: [{ id }, { companyId }],
      },
      data: { ...categoryData },
    });
    if (result.count < 1) {
      return { fail: true };
    }
    const updatedCategory = await prisma.productsCategory.findMany({
      where: {
        AND: [{ id }, { companyId }],
      },
    });

    return updatedCategory[0];
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCategory = async (data) => {
  const { id, companyId } = data;
  try {
    const result = await prisma.productsCategory.delete({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  postCategory,
  getCategories,
  getCategoriesById,
  updateCategoriesById,
  deleteCategory,
};
