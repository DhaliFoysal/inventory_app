const { body, query, param } = require("express-validator");
const createCategoryValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Category name is Required")
      .isLength({ min: 5, max: 50 })
      .withMessage("Category Name must be min 5 & max 50 Characters")
      .isString()
      .withMessage("Category Name must must be String"),
    body("description").custom((value) => {
      if (value && typeof value !== "string") {
        throw new Error("description Name must must be String");
      }
      if (value && value.length > 50) {
        throw new Error("description Name must be min 5 & max 50 Characters");
      }
      return true;
    }),
  ];
};

const getAllCategory = () => {
  return [
    query("page").custom((value) => {
      if (value) {
        value = parseInt(value);
      } else {
        return true;
      }

      if (!value) {
        throw new Error("Page must be Numbers");
      }
      return true;
    }),
    query("limit").custom((value) => {
      if (value) {
        value = parseInt(value);
      } else {
        return true;
      }

      if (!value) {
        throw new Error("Limit must be Numbers");
      }
      return true;
    }),
    query("sort_type").custom((value) => {
      if (!value) {
        return true;
      }

      if (value && value !== "asc" && value !== "desc") {
        throw new Error("sort_type must be asc or desc");
      }
      return true;
    }),
    query("sort_by").custom((value) => {
      if (!value) {
        return true;
      }

      if (value && value !== "name" && value !== "description") {
        throw new Error("sort_by must be name or description");
      }
      return true;
    }),
  ];
};

const patchCategoryValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Category name is Required")
      .isLength({ min: 5, max: 50 })
      .withMessage("Category Name must be min 5 & max 50 Characters")
      .isString()
      .withMessage("Category Name must must be String"),
    body("description").custom((value) => {
      if (value && typeof value !== "string") {
        throw new Error("description Name must must be String");
      }
      if (value && value.length > 50) {
        throw new Error("description Name must be min 5 & max 50 Characters");
      }
      return true;
    }),
  ];
};

module.exports = {
  createCategoryValidation,
  getAllCategory,
  patchCategoryValidation,
};
