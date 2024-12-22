const { signIn, signUp, company } = require("./authController");
const { signInValidator, signUpValidator } = require("./errorValidator");

const router = require("express").Router();

router.post("/signin", signInValidator(), signIn);
router.post("/signup", signUpValidator(), signUp);

module.exports = router;
