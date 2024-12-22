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
  patchCategoryValidation,
} = require("./categoriesErrorValidator");

const router = require("express").Router();

router.post(
  "/",
  checkLogin,
  checkActive,
  userPermission,
  createCategoryValidation(),
  createCategory
);
router.get("/", checkLogin, checkActive, getAllCategories);
router.get("/:id", checkLogin, checkActive, getSingleCategory);
router.patch(
  "/:id",
  checkLogin,
  checkActive,
  userPermission,
  patchCategoryValidation(),
  patchCategoryById
);
router.delete(
  "/:id",
  checkLogin,
  checkActive,
  userPermission,
  deleteCategoryById
);
module.exports = router;
