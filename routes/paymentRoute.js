const express = require("express");
const router = express.Router();
const { paymentValidate, orderConfirm } = require("../controller/paymentController")
const isAuthenticatedUser = require("../middleware/authenticateUser")


router.post("/payment-validate/:token", paymentValidate)
router.post("/orderVarification", isAuthenticatedUser, orderConfirm)

module.exports = router;