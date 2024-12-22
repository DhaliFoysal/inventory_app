const userPermission = require("../../../middleware/userPermission");

const {
  postProduct,
  getAllProduct,
  getProductById,
  patchProduct,
  deleteProduct,
  getProductBarcode,
  getIsBarcode,
  getAllByNameForDropdown,
  patchProductPrice,
  getAllForDropdown,
} = require("./productsControllers");
const checkLogin = require("../../../middleware/checkLogin");
const { checkActive } = require("../../../middleware/checkActive");
const {
  postProductValidation,
  updateProductValidation,
  sellingPriceValidation,
} = require("./productsErrorValidator");
const router = require("express").Router();

router.post(
  "/",
  checkLogin,
  checkActive,
  userPermission,
  postProductValidation(),
  postProduct
);
router.get("/", checkLogin, checkActive, getAllProduct);
router.get("/:id", checkLogin, checkActive, getProductById);
router.patch(
  "/:id",
  checkLogin,
  checkActive,
  userPermission,
  updateProductValidation(),
  patchProduct
);
router.patch(
  "/updatePrice/:id",
  checkLogin,
  checkActive,
  userPermission,
  sellingPriceValidation(),
  patchProductPrice
);

router.delete("/:id", checkLogin, checkActive, userPermission, deleteProduct);
router.get("/get_all/dropdown", checkLogin, checkActive, getAllForDropdown);

module.exports = router;
