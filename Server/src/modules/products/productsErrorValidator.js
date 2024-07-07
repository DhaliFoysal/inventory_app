// const { body } = require("express-validator");
const { body } = require("express-validator");
const postProductValidation = () => {
  let isWarranty = false;
  try {
    return [
      body("name")
        .notEmpty()
        .withMessage("Product name is Required")
        .isLength({ min: 5 })
        .withMessage("name Should Contain At least 5 Characters"),
      body("barcode").custom((value) => {
        if (value && typeof value !== "number") {
          throw new Error("Barcode must be integer value");
        }
        if (value.toString().length < 5) {
          throw new Error("Barcode Should Contain At least 5 Characters");
        }
        return true;
      }),
      body("categoryId").isArray().withMessage("categoryId must be Array"),
      body("buyingPrice")
        .notEmpty()
        .withMessage("buyingPrice is Required")
        .isInt()
        .withMessage("buyingPrice must be Integer"),
      body("sellingPrice")
        .notEmpty()
        .withMessage("sellingPrice is Required")
        .isInt()
        .withMessage("sellingPrice must be Integer"),
      body("stockInHandList")
        .isArray()
        .withMessage("stockInHandList must be Array")
        .custom((value) => {
          value.map((item) => {
            if (typeof item.itemSerials !== "object") {
              throw new Error("itemSerials must be an Array");
            }
            if (!item.wireHouseId) {
              throw new Error("wireHouseId Is required");
            }

            if (!item.wireHouseName) {
              throw new Error("wireHouseName Is required");
            } else if (item.wireHouseName.length < 5) {
              throw new Error(
                "wireHouseName Should Contain At least 5 Characters"
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

module.exports = {
  postProductValidation,
};
