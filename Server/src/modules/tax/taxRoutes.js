const superAdminPermission = require("../../../middleware/superAdminPermission");
const userPermission = require("../../../middleware/userPermission");
const {
  postTax,
  getAllTax,
  getTaxById,
  patchTax,
  deleteTax,
} = require("./taxControllers");
const checkLogin = require("../../../middleware/checkLogin");
const { checkActive } = require("../../../middleware/checkActive");
const { postValidation, updateValidation } = require("./taxErrorValidation");

const router = require("express").Router();

router.post(
  "/",
  checkLogin,
  checkActive,
  userPermission,
  postValidation(),
  postTax
);
router.get("/", checkLogin, checkActive, getAllTax);
router.get("/:id", checkLogin, checkActive, userPermission, getTaxById);
router.patch(
  "/:id",
  checkLogin,
  checkActive,
  userPermission,
  updateValidation(),
  patchTax
);
router.delete("/:id", checkLogin, checkActive, userPermission, deleteTax);

module.exports = router;
