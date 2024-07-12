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
  try {
    // Error Validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    // check Permission
    if (req.role !== "superAdmin") {
      return res.status(401).json({
        code: 401,
        error: "Access Denied",
        message: "You do not have permission",
      });
    }

    const unit = await createUnit(req.body, req.userId);
    if (unit.code === 409) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "measurementUint Already Exist",
      });
    }

    return res.status(201).json({
      code: 201,
      message: "Success",
      data: unit.data,
      links: {
        self: {
          method: "POST",
          url: `/measurementunit`,
        },
        update: {
          method: "PATCH",
          url: `/measurementunit/${unit.data.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/measurementunit/${unit.data.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUnit = async (req, res, next) => {
  try {
    const allUnit = await getUnits();
    const response = {
      code: 200,
      message: "Success",
      data: allUnit.data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const getUnitById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const unit = await getSingleUnit(id);
    if (unit.code === 404) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Content Not Found",
      });
    }
    return res.status(200).json({
      code: unit.code,
      message: "Success",
      data: unit.data,
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
  const result = validationResult(req);

  try {
    // Error Validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    // check Permission
    if (req.role !== "superAdmin") {
      return res.status(401).json({
        code: 401,
        error: "Access Denied",
        message: "You do not have permission",
      });
    }

    const updatedUnit = await updateUnit(req.body, id);
    if (updatedUnit.code === 404) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Contain Not Available",
      });
    } else if (updatedUnit.code === 409) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "MeasurementUnit Already Exist",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: updatedUnit.data,
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
  try {
    // check Permission
    if (req.role !== "superAdmin") {
      return res.status(401).json({
        code: 401,
        error: "Access Denied",
        message: "You do not have permission",
      });
    }

    const deletedUnit = await deleteUnitById(id);
    if (deletedUnit.code === 404) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found ",
        message: "Contain NOt Available",
      });
    }

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
