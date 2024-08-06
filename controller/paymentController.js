const asyncErrorhandle = require("../middleware/asyncErrorhandle");
const Razorpay = require("razorpay");
const CustomeError = require("../utils/customeError");
const crypto = require("crypto");
const PaymentModel = require("../model/paymentModel")
const jwt = require("jsonwebtoken");
const OrderModel = require("../model/ordersModel");

const paymentValidate = asyncErrorhandle(async (req, res, next) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
    const { token } = req.params

    console.log(token, "token")
    const decode = jwt.verify(token, process.env.SECRET_KEY)

    console.log(decode, "decode")
    const PaymentData = await PaymentModel.findOne({ userInfo: decode.id, order_id: razorpay_order_id })

    console.log(PaymentData, "paymetnData")

    const body = PaymentData.order_id + "|" + razorpay_payment_id
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPYA_SECRET)
        .update(body.toString())
        .digest('hex');

    if (generated_signature == razorpay_signature) {
        PaymentData.payment_id = razorpay_payment_id
        PaymentData.paymentStatus = "success"
        await PaymentData.save()

        console.log("payment Success")
        res.redirect(`http://localhost:3000/payment_validate?referance=${razorpay_payment_id}&order_reference=${razorpay_order_id}&status="success"`)
    } else {
        console.log("failed Payment")
        res.redirect(`http://localhost:3000/payment_validate?referance=${razorpay_payment_id}&order_reference=${razorpay_order_id}&status="pending"`)
    }
})

const orderConfirm = asyncErrorhandle(async (req, res, next) => {
    const { payment_id, order_id } = req.body;
    if (!payment_id || !order_id) {
        return next(new CustomeError("invalid Request body!"));
    }

    const findPaymentStatus = await PaymentModel.findOne({ payment_id, order_id })

    const findOrderByOrderId = await OrderModel.findOne({ userInfo: req.user._id, order_id: order_id })
    if (!findPaymentStatus.payment_id) {
        return next(new CustomeError("Your Payment Status is pending check after someTimes!"));
    }
    if (findOrderByOrderId.paymenstStatus === "success") {
        return next(new CustomeError("Your Order Already confirm", 403))
    }

    const orderUpdate = await OrderModel.updateOne(
        { userInfo: req.user._id, order_id: order_id },
        {
            $push: { orderStatus: { status: "orderConfirm", statusUpdatedAt: new Date().toISOString() } },
            $set: { paymenstStatus: "success" }
        }, { new: true }
    )

    if (!orderUpdate.acknowledged) {
        return next(new CustomeError("Your Payment Status is pending check after someTimes!"));
    }
    res.status(200).json({ success: true, msg: "Your Order Confirm with Us" })
})
module.exports = { paymentValidate, orderConfirm }