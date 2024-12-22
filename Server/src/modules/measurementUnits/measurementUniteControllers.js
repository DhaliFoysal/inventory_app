const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");

const {
  createUnit,
  getUnits,
  getSingleUnit,
  updateUnit,
  deleteUnitById,
} = require("./measurementUniteServices");

const posUnit = async (req, res, next) => {
  const result = validationResult(req);
  const { type, symbol } = req.body;
  const { companyId } = req;
  try {
    // Error Validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const unit = await createUnit({ type, symbol, companyId });
    if (unit.isUnit) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Measurement Unit already Exist",
      });
    }

    return res.status(201).json({
      code: 201,
      message: "Success",
      data: unit,
      links: {
        self: {
          method: "POST",
          url: `/measurementunit`,
        },
        update: {
          method: "PATCH",
          url: `/measurementunit/${unit.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/measurementunit/${unit.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUnit = async (req, res, next) => {
  const companyId = req.companyId;
  try {
    const allUnit = await getUnits(companyId);

    const response = {
      code: 200,
      message: "Success",
      data: allUnit,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const getUnitById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const unit = await getSingleUnit({ id, companyId: req.companyId });

    if (unit === null) {
      return res.status(200).json({
        code: 200,
        message: "Success",
        data: unit,
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: unit,
      links: {
        self: {
          method: "GET",
          url: `/measurementunit/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/measurementunit/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/measurementunit/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const patchUnit = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.companyId;
  const data = req.body;
  const result = validationResult(req);

  try {
    // Error Validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const isUnit = await getSingleUnit({ id, companyId });

    if (!isUnit) {
      return res.status(404).json({
        code: 404,
        error: "404 Not found",
        message: "Content not Available",
      });
    }

    const updatedUnit = await updateUnit(data, id);

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: updatedUnit,
      links: {
        self: {
          method: "PATCH",
          url: `/measurementunit/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/measurementunit/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/measurementunit/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUnit = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.companyId;
  try {
    const isUnit = await getSingleUnit({ id, companyId });

    if (!isUnit) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Content Not Available",
      });
    }
    await deleteUnitById(id);
    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  posUnit,
  getAllUnit,
  getUnitById,
  patchUnit,
  deleteUnit,
};
