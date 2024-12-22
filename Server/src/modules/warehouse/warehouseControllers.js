const errorFormatter = require("../../utils/errorFormatter");
const { validationResult } = require("express-validator");
const {
  createWarehouse,
  getSingleWarehouseById,
  getAllWarehouse,
  deleteWarehouseById,
  updateWarehouseById,
} = require("./warehouseService");
const prisma = require("../../../db/prisma");

const postWarehouse = async (req, res, next) => {
  const data = req.body;
  const { companyId, role } = req;

  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = errorFormatter(result.errors);

      return res.status(400).json({
        code: 400,
        error: "Bad Request",
        data: errors,
      });
    }

    const warehouse = await createWarehouse({ data, companyId, role });
    if (warehouse.isWarehouseExist) {
      return res.status(409).send({
        code: 409,
        error: "Conflict",
        message: "Warehouse already exist",
      });
    }
    return res.status(201).send({
      code: 201,
      message: "Success",
      data: warehouse,
      links: {
        self: {
          method: "POST",
          url: `/warehouse/${warehouse.id}`,
        },
        update: {
          method: "PATCH",
          url: `/warehouse/${warehouse.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/warehouse/${warehouse.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getWarehouseById = async (req, res, next) => {
  const { id } = req.params;
  const { companyId, role } = req;

  try {
    const warehouse = await getSingleWarehouseById({ id, companyId, role });
    if (!warehouse) {
      return res.status(404).send({
        code: 404,
        error: "Not Found",
        message: "Content not Available",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Success",
      data: warehouse,
      links: {
        self: {
          method: "GET",
          url: `/warehouse/${warehouse.id}`,
        },
        update: {
          method: "PATCH",
          url: `/warehouse/${warehouse.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/warehouse/${warehouse.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getWarehouse = async (req, res, next) => {
  const { companyId, role } = req;
  try {
    const warehouse = await getAllWarehouse({ companyId, role });

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: warehouse,
      links: {
        self: {
          method: "GET",
          url: `/warehouse`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteWarehouse = async (req, res, next) => {
  const { id } = req.params;
  const { companyId, role } = req;
  try {
    const isWarehouseExist = await getSingleWarehouseById({
      id,
      companyId,
      role,
    });
    if (!isWarehouseExist) {
      return res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Content not Available",
      });
    }

    // TODO  check if warehouse is in use  before Created Inventory Completed
    const isWarehouseUse = await prisma.inventories.findMany({
      where: {
        wareHouseId: id,
        companyId: companyId,
      },
    });
    if (isWarehouseUse.length > 0) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "The warehouse is in use",
      });
    }

    await deleteWarehouseById({ id, companyId, role });

    return res.status(209).json();
  } catch (error) {
    next(error);
  }
};

const patchWarehouseById = async (req, res, next) => {
  const { id } = req.params;
  const { companyId, role } = req;
  const data = req.body;

  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = errorFormatter(result.errors);
      return res.status(400).json({
        code: 400,
        error: "Bad Request",
        data: errors,
      });
    }

    const isWarehouseExist = await getSingleWarehouseById({
      id,
      companyId,
      role,
    });
    if (!isWarehouseExist) {
      return res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Content not Available",
      });
    }

    const updatedWarehouse = await updateWarehouseById({ id, data, companyId });
    if (updatedWarehouse.warehouseExist === true) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Warehouse already exist",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: updatedWarehouse,
      links: {
        self: {
          method: "GET",
          url: `/warehouse/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/warehouse/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/warehouse/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postWarehouse,
  getWarehouseById,
  getWarehouse,
  deleteWarehouse,
  patchWarehouseById,
};
