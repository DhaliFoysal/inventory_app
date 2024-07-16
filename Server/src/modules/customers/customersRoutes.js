const {
  postCustomer,
  getAllCustomers,
  getCustomerById,
  patchCustomerById,
  deleteCustomerById,
} = require("./customersControllers");
const { checkActive } = require("../../../middleware/checkActive");
const checkLogin = require("../../../middleware/checkLogin");
const { postErrorValidation,patchErrorValidation } = require("./customersErrorValidation");

const router = require("express").Router();

router.post("/", checkLogin, checkActive, postErrorValidation(), postCustomer);
router.get("/", checkLogin, checkActive, getAllCustomers);
router.get("/:id", checkLogin, checkActive, getCustomerById);
router.patch(
  "/:id",
  checkLogin,
  checkActive,
  patchErrorValidation(),
  patchCustomerById
);
router.delete("/:id", checkLogin, checkActive, deleteCustomerById);

module.exports = router;
