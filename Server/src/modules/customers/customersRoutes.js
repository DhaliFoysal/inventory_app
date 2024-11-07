const {
  postCustomer,
  getAllCustomers,
  getCustomerById,
  patchCustomerById,
  deleteCustomerById,
} = require("./customersControllers");
const { checkActive } = require("../../../middleware/checkActive");
const checkLogin = require("../../../middleware/checkLogin");
const {
  postErrorValidation,
  patchErrorValidation,
  getAllErrorValidation,
  getCustomerByIdValidation,
} = require("./customersErrorValidation");

const router = require("express").Router();

router.post("/", checkLogin, checkActive, postErrorValidation(), postCustomer);
router.get(
  "/",
  checkLogin,
  checkActive,
  getAllErrorValidation(),
  getAllCustomers
);
router.get(
  "/:id",
  checkLogin,
  checkActive,
  getCustomerByIdValidation(),
  getCustomerById
);
router.patch(
  "/:id",
  checkLogin,
  checkActive,
  patchErrorValidation(),
  patchCustomerById
);
router.delete("/:id", checkLogin, checkActive, deleteCustomerById);

module.exports = router;
