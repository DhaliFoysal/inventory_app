const { body, userId } = require("express-validator");
const db = require("../../../db/db");

const postErrorValidation = (req) => {
  let customer;
  let email;

  return [
    body("email").custom((value) => {
      if (value) {
        email = value;
      }
      return true;
    }),
    body("name")
      .notEmpty()
      .withMessage("Name is Required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Name minimum 3 and maximum 20 characters."),
    body("phone")
      .notEmpty()
      .withMessage("phone is Required")
      .isInt()
      .withMessage("invalid Phone")
      .custom(async (phone, { req }) => {
        const companyId = req.companyId;
        const customerQuery = `SELECT phone, email FROM customers WHERE companyId='${companyId}' AND (phone='${phone}' OR email='${email}')`;
        const customers = await db.query(customerQuery);
        customer = customers[0][0];
        if (phone === customer?.phone) {
          throw new Error("Phone No already Exist");
        }
        return true;
      }),
    body("address")
      .notEmpty()
      .withMessage("address is Required")
      .isLength({ min: 5, max: 30 })
      .withMessage("address minimum 5 and maximum 30 characters."),
    body("isTrader")
      .isBoolean()
      .withMessage("isTrader must be boolean value (false or true)"),
    body("email").custom((email) => {
      if (email && email === customer?.email) {
        throw new Error("Email already Exist");
      }
      return true;
    }),
  ];
};

const patchErrorValidation = () => {
  return [];
};

module.exports = {
  postErrorValidation,
  patchErrorValidation,
};
