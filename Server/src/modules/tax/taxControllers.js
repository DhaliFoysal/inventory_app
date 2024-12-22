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
  const { percent, title } = req.body;
  const { companyId } = req;

  try {
    // Error validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      console.log(error);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const tax = await createTax({ percent, title }, companyId);
    if (tax.isTax) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Tax already Exist",
      });
    }

    return res.status(201).json({
      code: 201,
      message: "Tax Created Successful",
      data: tax,
      links: {
        self: {
          method: "POST",
          url: `/tax`,
        },
        update: {
          method: "PATCH",
          url: `/tax/${tax.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/tax/${tax.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllTax = async (req, res, next) => {
  try {
    const taxes = await getTaxes(req.companyId);
    res.status(200).json({ code: 200, message: "Success", data: taxes });
  } catch (error) {
    next(error);
  }
};

const getTaxById = async (req, res, next) => {
  const id = req.params.id;
  const { companyId, role } = req;
  try {
    const tax = await getSingleTax(id, companyId, role);

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: tax,
      links: {
        self: {
          method: "GET",
          url: `/tax/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/tax/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/tax/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const patchTax = async (req, res, next) => {
  const data = req.body;
  const id = req.params.id;
  const { companyId, role } = req;
  const result = validationResult(req);
  try {
    // Error validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.array());
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    // check is Tax match
    const isTax = await getSingleTax(id, companyId, role);
    if (isTax.length <= 0) {
      return res.status(404).json({
        code: 404,
        error: "404 not found!",
        message: "Content not AvailAble!",
      });
    }

    const updatedTax = await updateSingleTax(data, id);

    return res.status(200).json({
      code: 200,
      message: "Tax Updated Successful",
      data: updatedTax,
      links: {
        self: {
          method: "POST",
          url: `/transactions/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/transactions/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/transactions/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTax = async (req, res, next) => {
  const id = req.params.id;
  const { companyId, role } = req;
  try {
    // check is tax
    const isTax = await getSingleTax(id, companyId, role);
    if (isTax.length <= 0) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Content not Available!",
      });
    }

    const deletedTax = await deleteTaxById(id);

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
