const {
  posUnit,
  getAllUnit,
  getUnitById,
  patchUnit,
  deleteUnit
} = require("./measurementUniteControllers");
const checkLogin = require("../../../middleware/checkLogin");
const { checkActive } = require("../../../middleware/checkActive");
const { postValidation } = require("./measurementUniteErrorVaidation");

const router = require("express").Router();

router.post("/", checkLogin, checkActive, postValidation(), posUnit);
router.get("/", checkLogin, checkActive, getAllUnit);
router.get("/:id", checkLogin, checkActive, getUnitById);
router.patch("/:id", checkLogin, checkActive,postValidation(), patchUnit);
router.delete("/:id", checkLogin, checkActive, deleteUnit);

module.exports = router;
