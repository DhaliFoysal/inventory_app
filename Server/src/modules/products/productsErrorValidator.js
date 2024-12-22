// const { body } = require("express-validator");
const { body } = require("express-validator");
const prisma = require("../../../db/prisma");
const postProductValidation = () => {
  let isWarranty = false;
  try {
    return [
      body("name")
        .notEmpty()
        .withMessage("Product name is Required")
        .isLength({ min: 5 })
        .withMessage("name Should Contain At least 5 Characters"),
      body("barcode")
        .notEmpty()
        .withMessage("Barcode is Require")
        .isLength({ min: 8, max: 20 })
        .withMessage("Barcode must be min-8 & max-20 characters"),
      body("categoryId").isArray().withMessage("categoryId must be Array"),
      body("buyingPrice")
        .notEmpty()
        .withMessage("buyingPrice is Required")
        .isFloat()
        .withMessage("buyingPrice must be float Number"),
      body("sellingPrice")
        .notEmpty()
        .withMessage("sellingPrice is Required")
        .isFloat()
        .withMessage("sellingPrice must be float Number"),
      body("stockInHandList")
        .isArray()
        .withMessage("stockInHandList must be Array")
        .custom((value) => {
          value.map((item) => {
            if (typeof item.itemSerials !== "object") {
              throw new Error("itemSerials must be an Array");
            }

            if (!item.wareHouseId) {
              throw new Error("wareHouseId Is required");
            }

            if (!item.wareHouseName) {
              throw new Error("wareHouseName Is required");
            } else if (item.wareHouseName.length < 3) {
              throw new Error(
                "wareHouseName Should Contain At least 3 Characters"
              );
            }

            if (typeof item.quantity !== "number") {
              throw new Error("quantity must be Integer");
            }
          });
          return true;
        }),
      body("measurementUnitId")
        .notEmpty()
        .withMessage("measurementUnitId is required"),
      body("isActive")
        .notEmpty()
        .withMessage("isActive is required")
        .custom((value) => {
          if (typeof value !== "boolean") {
            throw new Error("isActive must be boolean value");
          }
          return true;
        }),
      body("warranty").custom((value) => {
        if (value) {
          isWarranty = true;
        } else {
          isWarranty = false;
        }
        if (value && typeof value !== "number") {
          throw new Error("warranty must be integer value");
        }
        return true;
      }),
      body("warrantyType").custom((value) => {
        if (!isWarranty) {
          return true;
        }

        if (isWarranty && !value) {
          throw new Error("warrantyType is Required");
        }

        if (
          value &&
          (value === "years" || value === "months" || value === "days")
        ) {
          return true;
        } else {
          throw new Error(
            'invalid warrantyType. it should ( "years" or "months" or "days"  ) '
          );
        }
      }),
      body("wholesalePrice").custom((value) => {
        if (value && typeof value !== "number") {
          throw new Error("wholesalePrice must be integer value");
        }
        return true;
      }),
    ];
  } catch (error) {
    next(error);
  }
};

const updateProductValidation = () => {
  let isWarranty = false;
  try {
    return [
      body("name")
        .notEmpty()
        .withMessage("Product name is Required")
        .isLength({ min: 5 })
        .withMessage("name Should Contain At least 5 Characters"),
      body("barcode")
        .notEmpty()
        .withMessage("Barcode is Require")
        .isLength({ min: 8, max: 20 })
        .withMessage("Barcode must be min-8 & max-20 characters"),
      body("buyingPrice")
        .notEmpty()
        .withMessage("buyingPrice is Required")
        .isFloat()
        .withMessage("buyingPrice must be float Number"),
      body("sellingPrice")
        .notEmpty()
        .withMessage("sellingPrice is Required")
        .isFloat()
        .withMessage("sellingPrice must be float Number"),
      body("isWarranty")
        .notEmpty()
        .withMessage("isWarranty is Required !")
        .custom((value, { req }) => {
          if (typeof value !== "boolean") {
            throw new Error("isWarranty must be boolean value");
          }
          return true;
        }),
      body("warrantyType").custom((value, { req }) => {
        if (req.body.isWarranty === false) {
          return true;
        }

        if (req.body.isWarranty === true) {
          if (!value || value === "") {
            throw new Error("WarrantyType is Required");
          }
          if (value === "years" || value === "months" || value === "days") {
            return true;
          } else {
            throw new Error(
              'invalid warrantyType. it should ( "years" or "months" or "days"  ) '
            );
          }
        }
        return true;
      }),
      body("warranty").custom((value, { req }) => {
        if (req.body.isWarranty === false) {
          return true;
        }
        if (req.body.isWarranty === true) {
          if (!value || value === "") {
            throw new Error("warranty is Required");
          }

          if (typeof value === "number") {
            return true;
          } else {
            throw new Error("Warranty must be Number");
          }
        }
        return true;
      }),
      body("isActive")
        .notEmpty()
        .withMessage("isActive is required")
        .custom((value) => {
          if (typeof value !== "boolean") {
            throw new Error("isActive must be boolean value");
          }
          return true;
        }),
      body("measurementUnitId")
        .notEmpty()
        .withMessage("measurementUnitId is required"),
      body("measurementUnit")
        .notEmpty()
        .withMessage("measurementUnit is required"),

      body("wholesalePrice").custom((value) => {
        if (value && typeof value !== "number") {
          throw new Error("wholesalePrice must be integer value");
        }
        return true;
      }),
      body("itemsSerials").custom(async (value, { req }) => {
        if (!value) {
          return true;
        }

        if (typeof value !== "object") {
          throw new Error("itemsSerials must be an array of objects");
        }

        const promise = await value.map(async (element) => {
          const stock = await prisma.inventories.findMany({
            where: {
              productId: req.params.id,
              companyId: req.companyId,
              warehouseId: element.warehouseId,
            },
            select: {
              quantity: true,
            },
          });

          if (stock[0]?.quantity < element.serialNumbers.length) {
            return false;
          }
          return true;
        });

        const stocks = await Promise.all(promise);
        if (stocks.includes(false)) {
          throw new Error("Serial Numbers are more than the stock quantity");
        }

        const promises = await value.map(async (item) => {
          const isSerialItemsExist = await prisma.serial_numbers.findMany({
            where: {
              companyId: req.companyId,
              serialNumber: {
                in: item.serialNumbers,
              },
              NOT: {
                warehouseId: item.warehouseId,
              },
            },
          });

          return isSerialItemsExist.map((item) => item.serialNumber);
        });

        const existSerialNumbers = (await Promise.all(promises)).flat();

        if (existSerialNumbers.length > 0) {
          throw new Error(
            `Serial Numbers already exist [${existSerialNumbers}]`
          );
        }
        return true;
      }),
    ];
  } catch (error) {
    next(error);
  }
};

const sellingPriceValidation = () => {
  return [
    body("sellingPrice")
      .notEmpty()
      .withMessage("sellingPrice is Required")
      .isFloat()
      .withMessage("sellingPrice must be float Number"),
  ];
};

module.exports = {
  postProductValidation,
  updateProductValidation,
  sellingPriceValidation,
};
