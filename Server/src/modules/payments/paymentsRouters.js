const {
  postPayment,
  getAllPayment,
  deletePayment,
} = require("./paymentsControllers");

const router = require("express").Router();
const checkLogin = require("../../../middleware/checkLogin");
const { checkActive } = require("../../../middleware/checkActive");
const { postPaymentValidation } = require("./paymentsErrorValidator");

router.post("/payments", checkLogin, checkActive,postPaymentValidation(), postPayment);
router.get("/payments", checkLogin, getAllPayment);
router.delete("/payments/:id", checkLogin, deletePayment);

module.exports = router