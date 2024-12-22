const { body, userId, query, param } = require("express-validator");

const getAllErrorValidation = () => {
  return [
    query("page").isInt().withMessage("Page must be a number"),
    query("limit").isInt().withMessage("Limit must be a number"),
    query("sort_type").custom((value) => {
      if (value && value !== "asc" && value !== "desc") {
        throw new Error("sort_type must be (ASC OR DESC)");
      }
      return true;
    }),
    query("sort_by").custom((value) => {
      if (
        value &&
        value !== "name" &&
        value !== "phone" &&
        value !== "lastTradingDate" &&
        value !== "balance"
      ) {
        throw new Error(
          "sort_by must be (name OR phone OR  lastTradingDate OR balance)"
        );
      }
      return true;
    }),
  ];
};

const getCustomerForDropdownValidation = () => {
  return [
    query("search")
      .notEmpty()
      .withMessage("search value is required, in query params"),
  ];
};

const getCustomerByIdValidation = () => {
  // return [param("id").isInt().withMessage("id must be numbers")];
  return [];
};

const postErrorValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is Required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Name minimum 3 and maximum 20 characters."),
    body("email").custom((value) => {
      if (!value || value.length <= 0) {
        return true;
      }
      if (
        value.length > 0 &&
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
      ) {
        return true;
      } else {
        throw new Error("Invalid Email");
      }
    }),
    body("phone").custom((value) => {
      if (!value || value.length <= 0) {
        throw new Error("phone is Required");
      }

      if (
        value.length > 0 &&
        /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/.test(value)
      ) {
        return true;
      } else {
        throw new Error("Invalid Phone Number");
      }
    }),
    body("address")
      .notEmpty()
      .withMessage("address is Required")
      .isLength({ min: 5, max: 30 })
      .withMessage("address minimum 5 and maximum 30 characters."),
    body("isTrader")
      .isBoolean()
      .withMessage("isTrader must be boolean value (false or true)"),
    body("balance").custom((balance) => {
      if (balance && typeof balance !== "number") {
        throw new Error("Balance Must be Numbers");
      }
      return true;
    }),
  ];
};

const patchErrorValidation = () => {
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

        const customerQuery = `SELECT phone, email FROM customers 
              WHERE companyId='${companyId}' AND (phone='${phone}' OR email='${email}') AND id != ${req.params.id}`;
        const customers = await db.query(customerQuery);
        customer = customers[0][0];
        console.log(customers);
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

module.exports = {
  postErrorValidation,
  getCustomerByIdValidation,
  getCustomerForDropdownValidation,
  getAllErrorValidation,
  patchErrorValidation,
};
