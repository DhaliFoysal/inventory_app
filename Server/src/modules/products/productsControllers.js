const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  createProduct,
  checkProductByName,
  createStock,
} = require("./productsServices");

const postProduct = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bade Request", data: error });
    }

    const isProduct = await checkProductByName(req.body.name, req.companyId);

    if (isProduct.length > 0) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Product already  Exists",
      });
    }

    const { error, data } = await createProduct(
      req.body,
      req.companyId,
      req.userId
    );

    if (error) {
      throw new errorFormatter();
    }


   const {product , stock} = data

    const response = {
      code: 201,
      message: "Product Created Successful",
      data: product,
      links: {
        self: {
          method: "POST",
          url: "/products",
        },
        update: {
          method: "PATCH",
          url: `/products/${product.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/products/${product.id}`,
        },
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getAllProduct = async (req, res, next) => {
  console.log(req.body);
  try {
  } catch (error) {
    console.log(errors);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const patchProduct = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getProductBarcode = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getIsBarcode = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getAllByNameForDropdown = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postProduct,
  getAllProduct,
  getProductById,
  patchProduct,
  deleteProduct,
  getProductBarcode,
  getIsBarcode,
  getAllByNameForDropdown,
};
