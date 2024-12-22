const { body } = require("express-validator");
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
      if (value && (value.length > 50 || value.length < 5)) {
        throw new Error("description Name must be min 5 & max 50 Characters");
      }
      return true;
    }),
  ];
};

const patchCategoryValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is Required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be min 3 & max 50 Characters"),
    body("description").custom((value) => {
      if (value && typeof value !== "string") {
        throw new Error("description Name must must be String");
      }
      if (value && (value.length > 50 || value.length < 5)) {
        throw new Error("description Name must be min 5 & max 50 Characters");
      }
      return true;
    }),
  ];
};

module.exports = {
  createCategoryValidation,
  patchCategoryValidation,
};
