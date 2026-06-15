const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  getSingleCustomerById,
  getAllProductsById,
  getInventoriesById,
  getAllPaymentMethod,
} = require("./salesServices");
// const {

// } = require("./salesValidations");
// const { getSingleTax } = require("../tax/texServices");
// const {
//   getManyWarehouseById,
//   getWarehouseByProductId,
// } = require("../warehouse/warehouseService");
// const {
//   getSingleUnit,
// } = require("../measurementUnits/measurementUniteServices");
// const {
//   getManySerialNumberById,
// } = require("../serialNumbers/serialNumbersServices");

const postSale = async (req, res, next) => {
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
    // Check Customer Available or Not
    const isCustomer = await getSingleCustomerById({
      id: data.customerId,
      companyId,
    });
    if (!isCustomer) {
      return res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Customer Not Available !",
      });
    }

    // Check Products Available or Not
    const productIds = data.products?.map((item) => item.productId);

    const isProduct = await getAllProductsById(companyId, productIds);
    const serVerProductIds = isProduct?.map((item) => item.id);

    const notFoundProducts = data.products?.filter((product) => {
      return !serVerProductIds.includes(product.productId);
    });

    if (notFoundProducts.length > 0) {
      return res.status(404).json({
        code: 404,
        error: "Product Not Found",
        data: notFoundProducts,
      });
    }
    // Check inventories quantity Available or Not
    const inventories = await getInventoriesById(companyId, productIds);
    const errorInventories = [];
    data.products?.map((product) => {
      const inventory = inventories.find(
        (item) => item.productId === product.productId,
      );
      if (!inventory || inventory.quantity < product.quantity) {
        errorInventories.push({
          productId: product.productId,
          requestedQuantity: product.quantity,
          availableQuantity: inventory ? inventory.quantity : 0,
        });
      }
    });

    if (errorInventories.length > 0) {
      return res.status(400).json({
        code: 400,
        error: "Bad Request",
        message: "Insufficient inventory quantity.",
        data: errorInventories,
      });
    }
    

    //check payment method available or not
    const paymentMethodAcc = data.payments?.map((item) => item.account);
    const errorPaymentMethod = [];

    let isPaymentMethod = null;
    if (paymentMethodAcc) {
      isPaymentMethod = await getAllPaymentMethod({
        accountNumber: paymentMethodAcc,
        companyId,
      });
    }
    if (paymentMethodAcc && isPaymentMethod) {
      data.payments?.forEach((payment) => {
        if (
          !isPaymentMethod.some(
            (method) => method.accountNumber === payment.account,
          )
        ) {
          errorPaymentMethod.push(payment);
        }
      });
    }

    if (errorPaymentMethod.length > 0) {
      return res.status(400).json({
        code: 400,
        error: "Bad Request",
        message: "Some selected payment methods are not available.",
        data: errorPaymentMethod,
      });
    }
    if (paymentMethodAcc && isPaymentMethod.length <= 0) {
      return res.status(404).json({
        code: 400,
        error: "Bad Request",
        message: "Selected payment method is not available.",
      });
    }

    // All validation passed and data is ready to create sale, you can proceed with creating the sale record in the database here.

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: isPaymentMethod,
    });
  } catch (error) {
    next(error);
  }
};

// const getAllProduct = async (req, res, next) => {
//   const { companyId, role } = req;
//   const {
//     sort_type,
//     sort_by,
//     field,
//     "filter.name": filterName,
//     "filter.barcode": filterBarcode,
//     "filter.category": filterCategory,
//     "filter.priceFrom": filterPriceFrom,
//     "filter.priceTo": filterPriceTo,
//   } = req.query;

//   try {
//     let page, limit;
//     page = parseInt(req.query.page || 1);
//     limit = parseInt(req.query.limit || 10);

//     const query = {
//       page,
//       limit,
//       sort_type: sort_type || "asc",
//       sort_by: sort_by || "createdAt",
//       field,
//       filterName,
//       filterBarcode,
//       filterCategory,
//       filterPriceFrom: parseInt(filterPriceFrom),
//       filterPriceTo: parseInt(filterPriceTo),
//     };

//     const offset = (page - 1) * limit;
//     const result = await fetchAllProducts({
//       query,
//       companyId,
//       role,
//       offset,
//     });

//     const products = result.map((product) => {
//       return {
//         totalStocks: product.Inventories.reduce(
//           (acc, item) => acc + item.quantity,
//           0,
//         ),
//         ...product,
//       };
//     });

//     return res.status(200).json({
//       code: 200,
//       message: "Success",
//       data: products,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getProductById = async (req, res, next) => {
//   const id = req.params.id;
//   const companyId = req.companyId;
//   const role = req.role;
//   try {
//     const product = await getSingleProductById({ id, companyId, role });
//     res.status(200).json({
//       code: 200,
//       message: "Success",
//       data: product,
//       links: {
//         self: {
//           method: "GET",
//           url: `/products/${id}`,
//         },
//         update: {
//           method: "PATCH",
//           url: `/products/${id}`,
//         },
//         delete: {
//           method: "DELETE",
//           url: `/products/${id}`,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const patchProduct = async (req, res, next) => {
//   const id = req.params.id;
//   const companyId = req.companyId;
//   const role = req.role;
//   const data = req.body;
//   try {
//     const result = validationResult(req);
//     if (!result.isEmpty()) {
//       const error = errorFormatter(result.errors);
//       return res.status(400).json({
//         code: 400,
//         error: "Bade Request!",
//         data: error,
//       });
//     }

//     const isProduct = await getSingleProductById({ id, companyId, role });
//     if (!isProduct) {
//       return res.status(404).json({
//         code: 404,
//         error: "Not Found",
//         message: "Content Not Available !",
//       });
//     }

//     let isBuyingTax = null;
//     if (data.buyingTaxId) {
//       isBuyingTax = await getSingleTax(data.buyingTaxId, companyId, role);
//       if (isBuyingTax.length <= 0) {
//         return res.status(400).json({
//           code: 400,
//           error: "Bade Request !",
//           message: "Buying Tax not Found",
//         });
//       }
//     }

//     let isSellingTax = null;
//     if (data.sellingTaxId) {
//       isSellingTax = await getSingleTax(data.sellingTaxId, companyId, role);
//       if (isSellingTax.length <= 0) {
//         return res.status(400).json({
//           code: 400,
//           error: "Bade Request !",
//           message: "Selling Tax not Found",
//         });
//       }
//     }

//     const isMeasurement = await getSingleUnit({
//       id: data.measurementUnitId,
//       companyId,
//       role,
//     });
//     if (!isMeasurement) {
//       return res.status(400).json({
//         code: 400,
//         error: "Bade Request !",
//         message: "Measurement Unit not Found",
//       });
//     }
//     data.measurementUnit = isMeasurement.measurementUnit;

//     const updatedData = await updateProductById({ data, id, companyId });
//     if (updatedData.isProduct) {
//       return res.status(409).json({
//         code: 409,
//         error: "Conflict",
//         message: "Product already Exist",
//       });
//     }

//     res.status(200).json({
//       code: 200,
//       message: "Success",
//       data: {
//         ...updatedData,
//         buyingTax: isBuyingTax,
//         sellingTax: isSellingTax,
//       },
//       links: {
//         self: {
//           method: "GET",
//           url: `/products/${id}`,
//         },
//         update: {
//           method: "PATCH",
//           url: `/products/${id}`,
//         },
//         delete: {
//           method: "DELETE",
//           url: `/products/${id}`,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const patchProductPrice = async (req, res, next) => {
//   const id = req.params.id;
//   const companyId = req.companyId;
//   const role = req.role;
//   const sellingPrice = parseFloat(req.body.sellingPrice);
//   try {
//     const result = validationResult(req);
//     if (!result.isEmpty()) {
//       const error = errorFormatter(result.errors);
//       return res.status(400).json({
//         code: 400,
//         error: "Bade Request!",
//         data: error,
//       });
//     }

//     const isProduct = await getSingleProductById({ id, companyId, role });
//     if (!isProduct) {
//       return res.status(404).json({
//         code: 404,
//         error: "Not Found",
//         message: "Product Not Found",
//       });
//     }

//     const updatedData = await updateProductPrice({ sellingPrice, id });

//     return res.status(200).json({
//       code: 200,
//       message: "Success",
//       data: updatedData,
//       links: {
//         self: {
//           method: "GET",
//           url: `/products/${id}`,
//         },
//         update: {
//           method: "PATCH",
//           url: `/products/${id}`,
//         },
//         delete: {
//           method: "DELETE",
//           url: `/products/${id}`,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteProduct = async (req, res, next) => {
//   const id = req.params.id;
//   const companyId = req.companyId;
//   const role = req.role;
//   try {
//     const isProduct = await getSingleProductById({ id, companyId, role });
//     if (!isProduct) {
//       return res.status(404).json({
//         code: 404,
//         error: "Not Found",
//         message: "Content Not Available !",
//       });
//     }

//     await deleteProductById({ id });

//     return res.status(204).json();
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllForDropdown = async (req, res, next) => {
//   const { companyId } = req;
//   const data = req.query.search;

//   try {
//     const products = await getAllProductsForDropdown({ data, companyId });
//     return res.status(200).json({
//       code: 200,
//       message: "Success",
//       data: products,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  postSale,
};
