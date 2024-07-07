const { checkActive } = require("../../../middleware/checkActive");
const checkLogin = require("../../../middleware/checkLogin");
const { checkPermission } = require("../../../middleware/checkPermission");
const router = require("express").Router();
const {
  postUser,
  getAllUser,
  getUserById,
  patchUser,
  deleteUser,
} = require("./usersController");
const {
  createUserValidator,
  getAllUserValidation,
  updateUserValidator,
  deleteUserValidator,
} = require("./usersErrorValidator");

router.get("/users", checkLogin, getAllUserValidation(), getAllUser);
router.post("/users", checkLogin, createUserValidator(), postUser);
router.get("/users/:id", checkLogin, getUserById);
router.patch(
  "/users/:id",
  updateUserValidator(),
  checkLogin,
  checkActive,
  checkPermission,
  patchUser
);
router.delete(
  "/users/:id",
  checkLogin,
  deleteUserValidator(),
  checkActive,
  checkPermission,
  deleteUser
);

module.exports = { usersRoute: router };
