const checkLogin = require("../../../middleware/checkLogin");
const checkLoginForCompany = require("../../../middleware/checkLoginForCompany");
const { signIn, signUp, company } = require("./authController");
const {
  signInValidator,
  signUpValidator,
  companyValidator,
} = require("./errorValidator");

const router = require("express").Router();

router.post("/signin", signInValidator(), signIn);
router.post("/signup", signUpValidator(), signUp);
router.post("/company", checkLoginForCompany, companyValidator(), company);

module.exports = router;
