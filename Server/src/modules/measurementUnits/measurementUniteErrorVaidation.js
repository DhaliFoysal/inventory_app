const { body } = require("express-validator");

const postValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is Required")
      .isLength({ min: 5, max: 10 })
      .withMessage("Name minimum 5 and maximum 10 characters. "),
    body("symbol")
      .notEmpty()
      .withMessage("Symbol is Required")
      .isLength({ min: 2, max: 10 })
      .withMessage("Symbol minimum 2 and maximum 10 characters. "),
  ];
};

module.exports = {
  postValidation,
};
