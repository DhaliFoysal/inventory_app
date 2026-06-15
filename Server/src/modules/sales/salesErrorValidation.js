// const { body } = require("express-validator");
const { body } = require("express-validator");
const prisma = require("../../../db/prisma");

const postSalesvalidation = () => {
  try {
    return [
      body("customerId")
        .notEmpty()
        .withMessage("Customer ID is Required field"),
      body("discountAmount")
        .optional({ values: "falsy" }) // If 'amount' is not sent, skip validation.
        .isNumeric()
        .withMessage("Amount must be a number"),
      body("discountPercentage")
        .optional({ values: "falsy" }) // If 'amount' is not sent, skip validation.
        .isNumeric()
        .withMessage("Discount Percentage must be a number"),
      body("taxPercentage")
        .optional({ values: "falsy" }) // If 'amount' is not sent, skip validation.
        .isNumeric()
        .withMessage("Tax Percentage must be a number")
        .toFloat(),
      body("date")
        .optional({ values: "falsy" })
        .isDate()
        .withMessage("Date must be a valid date"),
      body("products")
        .isArray({ min: 1 })
        .withMessage(
          "Products must be an array and contain at least 1 product",
        ),
      body("products.*.productId")
        .notEmpty()
        .withMessage("Product ID is required for each product"),
      body("products.*.warehouseId")
        .notEmpty()
        .withMessage("Warehouse ID is required for each product"),
      body("products.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity is required for each product"),
      body("products.*.serialNumber")
        .isArray({ min: 1 })
        .withMessage("Serial Number must be an array for each product")
        .custom((serialNumbers, { req, path }) => {
          // 1. Find the current product index (e.g., "products[0]")
          const index = path.match(/\d+/)[0];

          // 2. Get the quantity for this specific product
          const quantity = parseInt(req.body.products[index]?.quantity, 10);

          // 3. The exact check you need: Compare length (4) with quantity (5)
          if (serialNumbers.length !== quantity) {
            throw new Error(
              `Quantity is ${quantity}, but you provided ${serialNumbers.length} serial numbers.`,
            );
          }

          return true;
        }),
      body("payments")
        .optional({ checkFalsy: true })
        .isArray({ min: 1 })
        .withMessage(
          "Payments must be an array and contain at least 1 payment",
        ),
      body("payments.*.type")
        .notEmpty()
        .withMessage("Payment type is required for each payment"),
      body("payments.*.account")
        .notEmpty()
        .withMessage("Payment account is required for each payment"),
      body("payments.*.amount")
        .notEmpty()
        .withMessage("Payment amount is required for each payment"),
    ];
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postSalesvalidation,
};

