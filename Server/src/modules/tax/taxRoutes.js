const {
  postTax,
  getAllTax,
  getTaxById,
  patchTax,
  deleteTax,
} = require("./taxControllers");
const checkLogin = require("../../../middleware/checkLogin");
const { checkActive } = require("../../../middleware/checkActive");
const { postValidation,updateValidation } = require("./taxErrorValidation");

const router = require("express").Router();

router.post("/", checkLogin, checkActive, postValidation(), postTax);
router.get("/", checkLogin, checkActive, getAllTax);
router.get("/:id", checkLogin, checkActive, getTaxById);
router.patch("/:id", checkLogin, checkActive,updateValidation(), patchTax);
router.delete("/:id", checkLogin, checkActive, deleteTax);

module.exports = router;
