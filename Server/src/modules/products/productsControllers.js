const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  createProduct,
  getManyCategoryByIds,
  fetchAllProducts,
  getSingleProductById,
  updateProductById,
  updateProductPrice,
  deleteProductById,
  getAllProductsForDropdown,
} = require("./productsServices");
const { getSingleTax } = require("../tax/texServices");
const {
  getManyWarehouseById,
  getWarehouseByProductId,
} = require("../warehouse/warehouseService");
const {
  getSingleUnit,
} = require("../measurementUnits/measurementUniteServices");
const {
  getManySerialNumberById,
} = require("../serialNumbers/serialNumbersServices");

const postProduct = async (req, res, next) => {
  const data = req.body;
  const { companyId, role } = req;
  try {
    // Error Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bade Request", data: error });
    }
    const productData = {
      name: data.name,
      barcode: data.barcode,
      buyingPrice: parseFloat(data.buyingPrice),
      sellingPrice: parseFloat(data.sellingPrice),
      isWarranty: data.isWarranty,
      warrantyType: data.warrantyType,
      warranty: data.warranty,
      isActive: data.isActive,
      wholesalePrice: data.wholesalePrice,
      companyId: data.companyId,
      buyingTaxId: data.buyingTaxId,
      sellingTaxId: data.sellingTaxId,
      isSerialItems: data.isSerialItems,
      measurementUnitId: data.measurementUnitId,
      measurementUnit: data.measurementUnit,
      img: data.img,
      createdAt: data.openingDate || new Date().toISOString(),
    };

    const stock = data.stockInHandList;

    const warehouseIdArray = stock?.map((item) => {
      return item.wareHouseId;
    });

    const existCategory = await getManyCategoryByIds(data.categoryId);

    if (existCategory.length !== data.categoryId.length) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Category Not found!",
      });
    }

    const categories = [];
    existCategory.forEach((element) => {
      categories.push({ id: element.id, name: element.name });
    });

    let existBuyingTax = null;
    if (data.buyingTaxId) {
      existBuyingTax = await getSingleTax(data.buyingTaxId, companyId, role);
      if (existBuyingTax.length <= 0) {
        return res.status(404).json({
          code: 404,
          error: "404 Not Found",
          message: "Buying Tax Not found!",
        });
      }
    }

    let existSellingTax = null;
    if (data.sellingTaxId) {
      existSellingTax = await getSingleTax(data.sellingTaxId, companyId, role);
      if (existSellingTax.length <= 0) {
        return res.status(404).json({
          code: 404,
          error: "404 Not Found",
          message: "Selling Tax Not found!",
        });
      }
    }

    const existMeasurementUnitId = await getSingleUnit({
      id: data.measurementUnitId,
      companyId,
    });

    if (existMeasurementUnitId === null) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Measurement Unit Not found!",
      });
    }
    productData.measurementUnit = existMeasurementUnitId.symbol;

    const existWarehouse = await getManyWarehouseById({
      ids: warehouseIdArray,
      companyId,
    });
    if (existWarehouse.length <= 0 || stock.length !== existWarehouse.length) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Warehouse Not found!",
      });
    }

    let serialIds = [];
    stock.forEach((element) => {
      serialIds = [...serialIds, ...element.itemSerials];
    });
    const hasDuplicates = new Set(serialIds).size !== serialIds.length;
    if (hasDuplicates === true) {
      return res.status(400).json({
        code: 400,
        error: " Bad Request",
        message: "Duplicates Serial Numbers",
      });
    }

    const existSerialNumbers = await getManySerialNumberById({
      ids: serialIds,
      companyId,
    });
    if (existSerialNumbers.length > 0) {
      return res.status(409).json({
        code: 409,
        error: " Conflict",
        message: "Serial Numbers already Exist!",
      });
    }

    const newProduct = await createProduct({
      productData,
      stock,
      categories,
      companyId,
    });

    // if product already Exist
    if (newProduct.isProduct) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Product already Exist",
      });
    }

    delete newProduct.buyingTaxId, newProduct.sellingTaxId;

    const response = {
      code: 201,
      message: "Product Created Successful",
      data: {
        ...newProduct,
        category: [...existCategory],
        buyingTax: existBuyingTax
          ? {
              id: existBuyingTax?.id || null,
              title: existBuyingTax?.title || null,
              percent: existBuyingTax?.percent || null,
            }
          : null,
        sellingTax: existSellingTax
          ? {
              id: existSellingTax?.id || null,
              title: existSellingTax?.title || null,
              percent: existSellingTax?.percent || null,
            }
          : null,
        warehouse: [...existWarehouse],
      },
      links: {
        self: {
          method: "POST",
          url: "/products",
        },
        update: {
          method: "PATCH",
          url: `/products/${newProduct.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/products/${newProduct.id}`,
        },
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getAllProduct = async (req, res, next) => {
  const { companyId, role } = req;
  const {
    sort_type,
    sort_by,
    field,
    "filter.name": filterName,
    "filter.barcode": filterBarcode,
    "filter.category": filterCategory,
    "filter.priceFrom": filterPriceFrom,
    "filter.priceTo": filterPriceTo,
  } = req.query;

  try {
    let page, limit;
    page = parseInt(req.query.page || 1);
    limit = parseInt(req.query.limit || 10);

    const query = {
      page,
      limit,
      sort_type: sort_type || "asc",
      sort_by: sort_by || "createdAt",
      field,
      filterName,
      filterBarcode,
      filterCategory,
      filterPriceFrom: parseInt(filterPriceFrom),
      filterPriceTo: parseInt(filterPriceTo),
    };

    const offset = (page - 1) * limit;
    const result = await fetchAllProducts({
      query,
      companyId,
      role,
      offset,
    });

    const products = result.map((product) => {
      return {
        totalStocks: product.Inventories.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
        ...product,
      };
    });

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.companyId;
  const role = req.role;
  try {
    const product = await getSingleProductById({ id, companyId, role });
    res.status(200).json({
      code: 200,
      message: "Success",
      data: product,
      links: {
        self: {
          method: "GET",
          url: `/products/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/products/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/products/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const patchProduct = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.companyId;
  const role = req.role;
  const data = req.body;
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res.status(400).json({
        code: 400,
        error: "Bade Request!",
        data: error,
      });
    }

    const isProduct = await getSingleProductById({ id, companyId, role });
    if (!isProduct) {
      return res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Content Not Available !",
      });
    }

    let isBuyingTax = null;
    if (data.buyingTaxId) {
      isBuyingTax = await getSingleTax(data.buyingTaxId, companyId, role);
      if (isBuyingTax.length <= 0) {
        return res.status(400).json({
          code: 400,
          error: "Bade Request !",
          message: "Buying Tax not Found",
        });
      }
    }

    let isSellingTax = null;
    if (data.sellingTaxId) {
      isSellingTax = await getSingleTax(data.sellingTaxId, companyId, role);
      if (isSellingTax.length <= 0) {
        return res.status(400).json({
          code: 400,
          error: "Bade Request !",
          message: "Selling Tax not Found",
        });
      }
    }

    const isMeasurement = await getSingleUnit({
      id: data.measurementUnitId,
      companyId,
      role,
    });
    if (!isMeasurement) {
      return res.status(400).json({
        code: 400,
        error: "Bade Request !",
        message: "Measurement Unit not Found",
      });
    }
    data.measurementUnit = isMeasurement.measurementUnit;

    const updatedData = await updateProductById({ data, id, companyId });
    if (updatedData.isProduct) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Product already Exist",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success",
      data: {
        ...updatedData,
        buyingTax: isBuyingTax,
        sellingTax: isSellingTax,
      },
      links: {
        self: {
          method: "GET",
          url: `/products/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/products/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/products/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const patchProductPrice = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.companyId;
  const role = req.role;
  const sellingPrice = parseFloat(req.body.sellingPrice);
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res.status(400).json({
        code: 400,
        error: "Bade Request!",
        data: error,
      });
    }

    const isProduct = await getSingleProductById({ id, companyId, role });
    if (!isProduct) {
      return res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Product Not Found",
      });
    }

    const updatedData = await updateProductPrice({ sellingPrice, id });

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: updatedData,
      links: {
        self: {
          method: "GET",
          url: `/products/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/products/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/products/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.companyId;
  const role = req.role;
  try {
    const isProduct = await getSingleProductById({ id, companyId, role });
    if (!isProduct) {
      return res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Content Not Available !",
      });
    }

    await deleteProductById({ id });

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const getAllForDropdown = async (req, res, next) => {
  const { companyId } = req;
  const data = req.query.search;

  try {
    const products = await getAllProductsForDropdown({ data, companyId });
    return res.status(200).json({
      code: 200,
      message: "Success",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postProduct,
  getAllProduct,
  getProductById,
  patchProduct,
  patchProductPrice,
  deleteProduct,
  getAllForDropdown,
};
