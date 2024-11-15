const {
  createCategory,
  getAllCategories,
  getSingleCategory,
  patchCategoryById,
  deleteCategoryById,
} = require("./categoriesControllers");
const checkLogin = require("../../../middleware/checkLogin");
const userPermission = require("../../../middleware/userPermission");
const { checkActive } = require("../../../middleware/checkActive");
const {
  createCategoryValidation,
  getAllCategory,
  patchCategoryValidation,
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
router.get("/:id", checkLogin, checkActive, getSingleCategory);
router.patch(
  "/:id",
  checkLogin,
  checkActive,
  userPermission,
  patchCategoryValidation(),
  patchCategoryById
);
router.delete("/:id", checkLogin, checkActive, userPermission, deleteCategoryById);
module.exports = router;
