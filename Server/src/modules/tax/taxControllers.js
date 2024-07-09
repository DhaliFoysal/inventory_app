const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  createTax,
  getTaxes,
  getSingleTax,
  updateSingleTax,
  deleteTaxById,
} = require("./texServices");

const postTax = async (req, res, next) => {
  const result = validationResult(req);

  try {
    // Error validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      console.log(error);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    // Check Permission
    if (req.role !== "superAdmin") {
      return res.status(403).json({
        code: 403,
        error: "Access Denied !",
        message: " You do not have permissions",
      });
    }

    const tax = await createTax(req);
    if (tax.code === 409) {
      return res
        .status(409)
        .json({ code: 409, error: "conflict", message: "title already Exist" });
    }
    return res.status(201).json({
      code: 201,
      message: "Tax Created Successful",
      data: tax.data,
      links: {
        self: {
          method: "POST",
          url: `/tax`,
        },
        update: {
          method: "PATCH",
          url: `/tax/${tax.data.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/tax/${tax.data.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllTax = async (_req, res, next) => {
  try {
    const taxes = await getTaxes();
    res.status(200).json({ code: 200, message: "Success", data: taxes.data });
  } catch (error) {
    next(error);
  }
};

const getTaxById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const tax = await getSingleTax(id);

    if (tax.code === 404) {
      return res.status(200).json({
        code: 404,
        error: "404 Not Found",
        message: "Content Not Available",
      });
    }

    res.status(200).json({ code: 200, message: "Success", data: tax.data });
  } catch (error) {
    next(error);
  }
};

const patchTax = async (req, res, next) => {
  const result = validationResult(req);
  try {
    if (req.role !== "superAdmin") {
      return res.status(403).json({
        code: 403,
        error: "Access Denied !",
        message: " You do not have permissions",
      });
    }
    if (!result.isEmpty()) {
      const error = errorFormatter(result.array());
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }
    const tax = await updateSingleTax(req.body, req.params.id, req.userId);
    if (tax.code === 404) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Content not Available",
      });
    } else if (tax.code === 409) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Content already Exist",
      });
    }

    return res
      .status(200)
      .json({ code: 200, message: "Tax Updated Successful", data: tax.data });
  } catch (error) {
    next(error);
  }
};

const deleteTax = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (req.role !== "superAdmin") {
      return res.status(403).json({
        code: 403,
        error: "Access Denied !",
        message: " You do not have permissions",
      });
    }

    const deletedTax = await deleteTaxById(id);

    if (deletedTax.code === 404) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Content not Available",
      });
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postTax,
  getAllTax,
  getTaxById,
  patchTax,
  deleteTax,
  patchTax,
};
