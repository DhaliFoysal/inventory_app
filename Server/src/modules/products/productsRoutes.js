const {
  postProduct,
  getAllProduct,
  getProductById,
  patchProduct,
  deleteProduct,
  getProductBarcode,
  getIsBarcode,
  getAllByNameForDropdown,
} = require("./productsControllers");
const checkLogin = require("../../../middleware/checkLogin");
const { postProductValidation } = require("./productsErrorValidator");

const router = require("express").Router();

router.post("/", checkLogin, postProductValidation(), postProduct);
router.get("/", checkLogin, getAllProduct);
router.get("/id", checkLogin, getProductById);
router.patch("/id", checkLogin, patchProduct);
router.delete("/id", checkLogin, deleteProduct);
router.post("/generateBarcode", checkLogin, getProductBarcode);
router.get("/isBarcodeExist", checkLogin, getIsBarcode);
router.get("/getAllByNameForDropdown", checkLogin, getAllByNameForDropdown);

module.exports = router;
