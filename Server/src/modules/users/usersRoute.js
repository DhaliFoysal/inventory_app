const { checkActive } = require("../../../middleware/checkActive");
const checkLogin = require("../../../middleware/checkLogin");
const { checkPermission } = require("../../../middleware/checkPermission");
const userPermission = require("../../../middleware/userPermission");
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

router.get("/users", checkLogin,userPermission, getAllUserValidation(), getAllUser);
router.post("/users", checkLogin, createUserValidator(), postUser);
router.get("/users/:id", checkLogin,userPermission, getUserById);
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
