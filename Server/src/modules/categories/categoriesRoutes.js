const { createCategory, getAllCategories } = require("./categoriesControllers");
const checkLogin = require("../../../middleware/checkLogin");
const { checkActive } = require("../../../middleware/checkActive");
const {
  createCategoryValidation,
  getAllCategory,
} = require("./categoriesErrorValidator");

const router = require("express").Router();

router.post(
  "/",
  checkLogin,
  checkActive,
  createCategoryValidation(),
  createCategory
);
router.get("/", checkLogin, checkActive, getAllCategory(), getAllCategories);

module.exports = router;
