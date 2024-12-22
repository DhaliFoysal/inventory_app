const { body } = require("express-validator");

const postWarehouseValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters")
      .isLength({ max: 20 })
      .withMessage("Name must be at most 20 characters")
    //   .custom((value) => {
    //     if (value === "Main" || value === "main") {
    //       throw new Error("Name cannot be Main");
    //     }
    //     return true;
    //   }),
    ,
    body("address").custom((value) => {
      if (!value) {
        return true;
      }
      if (value.length < 3) {
        throw new Error("Address must be at least 3 characters");
      }
      if (value.length > 100) {
        throw new Error("Address must be at most 100 characters");
      }
      return true;
    }),
  ];
};

module.exports = { postWarehouseValidation };
