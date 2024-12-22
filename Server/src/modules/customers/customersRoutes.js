const {
  postCustomer,
  getAllCustomers,
  getCustomerById,
  patchCustomerById,
  deleteCustomerById,
  getCustomersForDropdown,
} = require("./customersControllers");
const { checkActive } = require("../../../middleware/checkActive");
const checkLogin = require("../../../middleware/checkLogin");
const userPermission = require("../../../middleware/userPermission");
const {
  postErrorValidation,
  patchErrorValidation,
  getAllErrorValidation,
  getCustomerByIdValidation,
  getCustomerForDropdownValidation,
} = require("./customersErrorValidation");

const router = require("express").Router();

router.post("/", checkLogin, checkActive, postErrorValidation(), postCustomer);

// router.get(
//   "/",
//   checkLogin,
//   checkActive,
//   getAllErrorValidation(),
//   getAllCustomers
// );

// router.get(
//   "/getallcustomersfordropdown",
//   checkLogin,
//   checkActive,
//   getCustomerForDropdownValidation(),
//   getCustomersForDropdown
// );
// router.get(
//   "/:id",
//   checkLogin,
//   checkActive,
//   getCustomerByIdValidation(),
//   getCustomerById
// );
// router.patch(
//   "/:id",
//   checkLogin,
//   checkActive,
//   patchErrorValidation(),
//   patchCustomerById
// );
// router.delete(
//   "/:id",
//   checkLogin,
//   checkActive,
//   userPermission,
//   deleteCustomerById
// );

module.exports = router;
