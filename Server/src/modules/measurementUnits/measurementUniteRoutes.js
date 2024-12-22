const {
  posUnit,
  getAllUnit,
  getUnitById,
  patchUnit,
  deleteUnit,
} = require("./measurementUniteControllers");
const checkLogin = require("../../../middleware/checkLogin");
const userPermission = require("../../../middleware/userPermission");
const { checkActive } = require("../../../middleware/checkActive");
const { postValidation } = require("./measurementUniteErrorValidation");

const router = require("express").Router();

router.post(
  "/",
  checkLogin,
  checkActive,
  userPermission,
  postValidation(),
  posUnit
);
router.get("/", checkLogin, checkActive, getAllUnit);
router.get("/:id", checkLogin, checkActive, getUnitById);
router.patch(
  "/:id",
  checkLogin,
  checkActive,
  userPermission,
  postValidation(),
  patchUnit
);
router.delete("/:id", checkLogin, checkActive, userPermission, deleteUnit);

module.exports = router;
