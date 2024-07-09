const { body } = require("express-validator");
const postValidation = () => {
  return [
    body("percent").isInt().withMessage("Percent Must be Numbers"),
    body("title").notEmpty().withMessage("title Must some value"),
  ];
};
const updateValidation = () => {
  return [
    body("percent").isInt().withMessage("Percent Must be Numbers"),
    body("title").notEmpty().withMessage("title Must some value"),
  ];
};

module.exports = {
  postValidation,
  updateValidation
};
