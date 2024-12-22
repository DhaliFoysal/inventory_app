const router = require("express").Router();

const checkLogin = require("../../../middleware/checkLogin");
const { checkActive } = require("../../../middleware/checkActive");
const userPermission = require("../../../middleware/userPermission");
const {
  postWarehouse,
  getWarehouseById,
  getWarehouse,
  deleteWarehouse,
  patchWarehouseById,
} = require("./warehouseControllers");
const { postWarehouseValidation } = require("./warehouseErrorValidation");

router.post(
  "/",
  checkLogin,
  checkActive,
  userPermission,
  postWarehouseValidation(),
  postWarehouse
);

router.get("/:id", checkLogin, checkActive, getWarehouseById);
router.get("/", checkLogin, checkActive, getWarehouse);
router.delete("/:id", checkLogin, checkActive, userPermission, deleteWarehouse);
router.patch(
  "/:id",
  checkLogin,
  checkActive,
  userPermission,
  postWarehouseValidation(),
  patchWarehouseById
);

module.exports = router;
