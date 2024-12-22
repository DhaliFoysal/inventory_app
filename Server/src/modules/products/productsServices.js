const prisma = require("../../../db/prisma");

const fetchAllProducts = async ({ query, companyId, role, offset }) => {
  const {
    limit,
    sort_type,
    sort_by,
    field,
    filterName,
    filterBarcode,
    filterCategory,
    filterPriceFrom,
    filterPriceTo,
  } = query;

  const fieldArray = {};
  if (field) {
    field.split(",").forEach((item) => {
      fieldArray[item] = true;
    });
  }

  let selectOrInclude;
  if (Object.keys(fieldArray).length === 0) {
    selectOrInclude = {
      include: {
        Category_Details: {
          select: {
            id: true,
            name: true,
          },
        },
        Inventories: {
          select: {
            id: true,
            quantity: true,
            wareHouseId: true,
            wareHouseName: true,
          },
        },
      },
    };
  } else {
    selectOrInclude = {
      select: {
        ...fieldArray,
        Category_Details: {
          select: {
            id: true,
            name: true,
          },
        },
        Inventories: {
          select: {
            id: true,
            quantity: true,
            wareHouseId: true,
            wareHouseName: true,
          },
        },
      },
    };
  }

  const products = await prisma.products.findMany({
    where: {
      companyId,
      AND: [
        { name: { contains: filterName } },
        { barcode: { contains: filterBarcode } },
        filterPriceFrom ? { sellingPrice: { gte: filterPriceFrom } } : {},
        filterPriceTo ? { sellingPrice: { lte: filterPriceTo } } : {},
      ],
      Category_Details: {
        some: {
          name: {
            contains: filterCategory,
          },
        },
      },
    },
    skip: offset,
    take: limit,
    orderBy: {
      [sort_by]: sort_type,
    },
    ...selectOrInclude,
  });

  return products;
};

const createProduct = async ({ productData, stock, categories, companyId }) => {
  try {
    const isProduct = await prisma.products.findMany({
      where: {
        companyId,
        name: productData.name,
      },
    });
    if (isProduct.length > 0) {
      return { isProduct: true };
    }

    const result = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.products.create({
        data: { ...productData, companyId },
      });

      const inventories = stock.map((items) => {
        return {
          warehouseName: items.wareHouseName,
          warehouseId: items.wareHouseId,
          quantity: items.quantity,
          companyId,
          productId: newProduct.id,
        };
      });

      const newInventory = await tx.inventories.createMany({
        data: inventories,
      });

      let itemsArray = [];
      stock.forEach(async (item) => {
        item.itemSerials.forEach((serial) => {
          itemsArray.push({
            serialNumber: serial,
            companyId,
            productId: newProduct.id,
            warehouseId: item.wareHouseId,
          });
        });
      });
      await tx.serial_numbers.createMany({
        data: itemsArray,
      });

      const categoriesArray = categories.map((category) => {
        return {
          productId: newProduct.id,
          categoryId: category.id,
          name: category.name,
        };
      });
      const newCategories = await tx.category_Details.createMany({
        data: categoriesArray,
      });

      return newProduct;
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getManyCategoryByIds = async ({ ids }) => {
  const categories = await prisma.productsCategory.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return categories;
};

const getSingleProductById = async ({ id, companyId, role }) => {
  const product = await prisma.products.findUnique({
    where: role === "superAdmin" ? { id: id } : { id, companyId },
    include: {
      Inventories: {
        select: {
          id: true,
          quantity: true,
          warehouse: true,
        },
      },
      Category_Details: true,
    },
  });

  let totalStocks = 0;
  product?.Inventories?.forEach((inventory) => {
    totalStocks += inventory.quantity;
  });

  if (product) {
    return { totalStocks, ...product };
  } else {
    return null;
  }
};
const updateProductById = async ({ data, id, companyId }) => {
  try {
    const itemsSerials = data.itemsSerials || null;
    delete data.itemsSerials;

    const isProduct = await prisma.products.findMany({
      where: {
        name: data.name,
        companyId,
        NOT: { id }, // exclude the current product
      },
    });

    if (isProduct.length > 0) {
      return { isProduct: true };
    }

    let newSerialNumbers = [];
    if (itemsSerials) {
      itemsSerials.forEach((item) => {
        item.serialNumbers.forEach((serial) => {
          newSerialNumbers.push({
            serialNumber: serial,
            companyId,
            productId: id,
            warehouseId: item.warehouseId,
          });
        });
      });
    }

    const { updatedProduct } = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.products.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });

      if (itemsSerials) {
        await itemsSerials.forEach(async (item) => {
          await tx.serial_numbers.deleteMany({
            where: {
              productId: id,
              warehouseId: item.warehouseId,
              NOT: {
                status: "sold",
              },
            },
          });
        });

        await tx.serial_numbers.createMany({
          data: newSerialNumbers,
        });
      }

      return {
        updatedProduct,
      };
    });

    return updatedProduct;
  } catch (error) {
    throw new Error(error);
  }
};

const updateProductPrice = async ({ id, sellingPrice }) => {
  try {
    const updatedProduct = await prisma.products.update({
      where: {
        id,
      },
      data: {
        sellingPrice,
      },
    });
    return updatedProduct;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProductById = async ({ id }) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.serial_numbers.deleteMany({
        where: {
          productId: id,
          status: "unsold",
        },
      });

      await tx.products.delete({
        where: {
          id,
        },
      });
    });
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProductsForDropdown = async ({ data, companyId }) => {
  const products = await prisma.products.findMany({
    where: {
      companyId,
      isActive: true,
      OR: [
        {
          name: {
            contains: data,
          },
        },
        {
          barcode: {
            contains: data,
          },
        },
        {
          Serial_numbers: {
            some: {
              serialNumber: { contains: data },
            },
          },
        },
      ],
    },
  });

  return products;
};

module.exports = {
  createProduct,
  getManyCategoryByIds,
  fetchAllProducts,
  getSingleProductById,
  updateProductById,
  updateProductPrice,
  deleteProductById,
  getAllProductsForDropdown,
};
