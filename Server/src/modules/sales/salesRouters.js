const router = require("express").Router();

const checkLogin = require("../../../middleware/checkLogin");
const { checkActive } = require("../../../middleware/checkActive");
const userPermission = require("../../../middleware/userPermission");
const { postSale } = require("./salesControllers");
const { postSalesvalidation } = require("./salesErrorValidation");

router.post(
  "/",
  checkLogin,
  checkActive,
  userPermission,
  postSalesvalidation(),
  postSale,
);

// router.get("/:id", checkLogin, checkActive, getSaleById);
// router.get("/", checkLogin, checkActive, getSales);
// router.delete("/:id", checkLogin, checkActive, userPermission, deleteSale);
// router.patch(
//   "/:id",
//   checkLogin,
//   checkActive,
//   userPermission,
//   // postSaleValidation(),
//   patchSaleById
// );

module.exports = router;
