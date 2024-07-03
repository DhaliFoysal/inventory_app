const { body } = require("express-validator");
const db = require("../../../db/db");

// Validate and sanitize inputs

const signInValidator = () => {
  return [
    body("userName")
      .notEmpty()
      .withMessage("UserName is required")
      .isLength({ min: 11 })
      .withMessage("Username must be at least 11 characters long"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 characters long"),
  ];
};

const signUpValidator = () => {
  try {
    return [
      body("name")
        .notEmpty()
        .withMessage("name is required")
        .isLength({ min: 3 })
        .withMessage("name must be at least 3 characters long"),
      body("phone")
        .notEmpty()
        .withMessage("phone is required")
        .isLength({ min: 11 })
        .withMessage("phone must be at least 11 characters long")
        .custom(async (value) => {
          const queryText = `SELECT phone FROM user WHERE phone = '${value}'`;
          const [rows, fields] = await db.query(queryText);
          if (rows.length > 0) {
            throw new Error("Phone number already Exist");
          }
          return true;
        }),
      body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8 })
        .withMessage("password must be at least 8 characters long"),
      body("email").custom((value) => {
        if (value.length <= 0) {
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
    ];
  } catch (error) {
  }
};
const companyValidator = () => {
  try {
    return [
      body("name")
        .notEmpty()
        .withMessage("name is required")
        .isLength({ min: 3 })
        .withMessage("name must be at least 3 characters long"),
      body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ min: 3 })
        .withMessage("Address must be at least 3 characters long")
        .custom(async (value) => {
          const queryText = `SELECT phone FROM user WHERE phone = '${value}'`;
          const [rows, fields] = await db.query(queryText);
          if (rows.length > 0) {
            throw new Error("Phone number already Exist");
          }
          return true;
        }),
    ];
  } catch (error) {
  }
};

module.exports = {
  signInValidator,
  signUpValidator,
  companyValidator,
};
