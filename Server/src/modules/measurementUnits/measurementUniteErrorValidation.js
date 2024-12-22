const { body } = require("express-validator");

const postValidation = () => {
  return [
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .isLength({ min: 2, max: 15 })
      .withMessage("Type minimum 2 and maximum 15 characters."),
    body("symbol")
      .notEmpty()
      .withMessage("Symbol is required")
      .isLength({ min: 2, max: 15 })
      .withMessage("Symbol minimum 2 and maximum 15 characters."),
  ];
};

module.exports = {
  postValidation,
};
