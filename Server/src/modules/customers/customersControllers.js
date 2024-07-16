const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const { createPost } = require("./customersService");

const postCustomer = async (req, res, next) => {
  const result = validationResult(req);
  const { userId, companyId } = req;
  const value = req.body;
  try {
    // Error Validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bade Request !", data: error });
    }

    const post = await createPost(value, companyId, userId);
    if (post.code === 409) {
      return res.status(409).json({
        code: post.code,
        error: "Conflict",
        message: "Customer already Exist",
      });
    }
    res.status(201).json({
      code: 201,
      message: "Success",
      data: post.data,
      links: {
        self: {
          method: "POST",
          url: `/customers`,
        },
        update: {
          method: "PATCH",
          url: `/customers/${post.data.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/customers/${post.data.id}`,
        },
      },
    });
  } catch (error) {
    Z;
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const patchCustomerById = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const deleteCustomerById = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postCustomer,
  getAllCustomers,
  getCustomerById,
  patchCustomerById,
  deleteCustomerById,
};
