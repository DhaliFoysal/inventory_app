const { body, param, query } = require("express-validator");
const db = require("../../../db/db");

const createUserValidator = () => {
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
        const [rows] = await db.query(queryText);
        if (rows.length > 0) {
          throw new Error("Phone number already Exist");
        }
        return true;
      }),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
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
    body("role")
      .notEmpty()
      .withMessage("role is required")
      .custom((value) => {
        if (value === "admin" || value === "user" || value === "superAdmin") {
          return true;
        } else {
          throw new Error("Invalid role");
        }
      }),
    body("status")
      .notEmpty()
      .withMessage("status is required")
      .custom((value) => {
        if (value === "active" || value === "deActive") {
          return true;
        } else {
          throw new Error("Invalid Status");
        }
      }),
  ];
};

const getAllUserValidation = () => {
  return [
    query("page").custom((value) => {
      let intValue;
      if (!value) {
        return true;
      } else {
        intValue = parseInt(value);
      }

      if (!intValue) {
        throw new Error("page must be Numbers");
      }
      return true;
    }),
    query("limit").custom((value) => {
      let intValue;
      if (!value) {
        return true;
      } else {
        intValue = parseInt(value);
      }

      if (!intValue) {
        throw new Error("Limit must be Numbers");
      }
      return true;
    }),
    query("sort_type").custom((value) => {
      if (!value) {
        return true;
      }

      if (value && value !== "asc" && value !== "desc") {
        throw new Error("sort_type must be ( asc or desc )");
      }

      return true;
    }),
    query("sort_by").custom((value) => {
      if (!value) {
        return true;
      }

      if (
        value &&
        value !== "name" &&
        value !== "phone" &&
        value !== "email" &&
        value !== "status"
      ) {
        throw new Error("sort_by must be ( name, phone, email or status )");
      }

      return true;
    }),
  ];
};

const updateUserValidator = () => {
  let id;
  return [
    param("id")
      .isInt({ min: 1 })
      .withMessage("User ID must be a positive integer")
      .custom((value) => {
        id = value;
        return true;
      }),
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
        const queryText = `SELECT id, phone FROM user WHERE phone = '${value}'`;
        const [rows] = await db.query(queryText);
        if (id != rows[0]?.id && rows.length > 0) {
          throw new Error("Phone number already Exist");
        }
        return true;
      }),
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
    body("role")
      .notEmpty()
      .withMessage("role is required")
      .custom((value) => {
        if (value === "admin" || value === "user" || value === "superAdmin") {
          return true;
        } else {
          throw new Error("Invalid role");
        }
      }),
    body("status")
      .notEmpty()
      .withMessage("status is required")
      .custom((value) => {
        if (value === "active" || value === "deActive") {
          return true;
        } else {
          throw new Error("Invalid Status");
        }
      }),
  ];
};

const deleteUserValidator = () => {
  return [
    param("id")
      .isInt({ min: 1 })
      .withMessage("User ID must be a positive integer"),
  ];
};

module.exports = {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getAllUserValidation,
};
