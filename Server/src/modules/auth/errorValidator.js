const { body } = require("express-validator");
const db = require("../../../db/prisma");
const prisma = require("../../../db/prisma");

// Validate and sanitize inputs

const signInValidator = () => {
  return [
    body("userName").notEmpty().withMessage("UserName is required"),
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
      body("phone").custom((value, { req }) => {
        const createBy = req.body.createBy;
        if (createBy !== "phone") return true;

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

      body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8 })
        .withMessage("password must be at least 8 characters long"),

      body("email").custom((value, { req }) => {
        const createBy = req.body.createBy;

        if (createBy !== "email") {
          return true;
        }

        if (!value || value.length <= 0) {
          throw new Error("Email is Required");
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

      body("createBy")
        .notEmpty()
        .withMessage("CreateBy is required")
        .custom((value) => {
          if (value !== "phone" && value !== "email") {
            throw new Error("Type Should be 'phone or email'");
          }
          return true;
        }),
      body("companyName")
        .notEmpty()
        .withMessage("company name is Required")
        .isLength({ min: 5, max: 50 })
        .withMessage("Company Name minimum 5 and maximum 50 characters"),
      body("companyAddress")
        .notEmpty()
        .withMessage("company Address is Required")
        .isLength({ min: 5, max: 100 })
        .withMessage("Company Address min-5 & max-100 characters"),
    ];
  } catch (error) {}
};

// const companyValidator = () => {
//   try {
//     return [
//       body("name")
//         .notEmpty()
//         .withMessage("name is required")
//         .isLength({ min: 3 })
//         .withMessage("name must be at least 3 characters long"),
//       body("address")
//         .notEmpty()
//         .withMessage("Address is required")
//         .isLength({ min: 3 })
//         .withMessage("Address must be at least 3 characters long")
//         .custom(async (value) => {
//           const queryText = `SELECT phone FROM user WHERE phone = '${value}'`;
//           const [rows, fields] = await db.query(queryText);
//           if (rows.length > 0) {
//             throw new Error("Phone number already Exist");
//           }
//           return true;
//         }),
//     ];
//   } catch (error) {}
// };

module.exports = {
  signInValidator,
  signUpValidator,
};

