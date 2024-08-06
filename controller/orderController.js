const asyncErrorhandle = require("../middleware/asyncErrorhandle");
const OrderModel = require("../model/ordersModel");
const ProductModel = require("../model/productModel");
const CardModel = require("../model/cardModel")
const PyamentModel = require("../model/paymentModel")
const Razorpay = require("razorpay");
const CustomeError = require("../utils/customeError");


const orderPlace = asyncErrorhandle(async (req, res, next) => {

    const finalOrder = {
        shipingInfo: req.body.shipingInfo,
        userInfo: req.user._id,
        orderStatus: [{ status: "pending", statusUpdatedAt: new Date().toISOString() }],
        ordersItem: [],
        order_id: "",
        totalPrice: 0,
        totalQuntity: 0
    }

    const payMentData = {
        userInfo: req.user._id,
        order_id: "",
        payment_id: "",
        totalAmouttoPaid: 0,
    }

    const findOrder = await CardModel.findOne({ user: req.user._id }).populate("product.product_id")

    let totalQuntity = 0;
    let totalPrice = 0
    if (!findOrder) {
        return next(new CustomeError("No Product Foun in Your Card", 404))
    }
    console.log(findOrder, "findOrder")
    if (findOrder?.product?.length > 0) {
        findOrder?.product?.forEach((item, index) => {
            totalPrice += ((item.productQty) * (item.productPrice));
            totalQuntity += item.productQty;
        })
    }

    finalOrder.ordersItem = [...findOrder.product];
    finalOrder.totalPrice = totalPrice;
    finalOrder.totalQuntity = totalQuntity;



    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_APIKEY,
        key_secret: process.env.RAZORPYA_SECRET
    });

    var options = {
        amount: Number(totalPrice) * 100,  // amount in the smallest currency unit 500rs
        currency: "INR",
    };
    const razorpayOrder = await instance.orders.create(options)
    if (razorpayOrder.status === 'created') {
        finalOrder.order_id = razorpayOrder.id

        const OrderGenerated = new OrderModel(finalOrder);
        await OrderGenerated.save();

        const updateCard = await CardModel.deleteOne({ user: req.user._id })
        payMentData.order_id = razorpayOrder.id
        payMentData.totalAmouttoPaid = razorpayOrder.amount

        const PaymentRecord = new PyamentModel(payMentData)
        await PaymentRecord.save();

        res.status(200).json({
            sucess: true,
            data: {
                order_id: razorpayOrder.id,
                amount: razorpayOrder.amount, currency: razorpayOrder.currency
            }, msg: "Your Order Placed successfull"
        })
    } else {
        res.status(400).json({ success: false, msg: "pleae try after some time" })
    }

})

const getOrderbyOrderid = asyncErrorhandle(async (req, res, next) => {
    const singleOrder = await OrderModel.findOne({ userInfo: req.user._id, order_id: req.params.id })
    if (!singleOrder) {
        return next(new CustomeError("Order Not Found !", 404))
    }
    res.status(200).json({
        sucess: true,
        singleOrder
    })

})

const myOrder = asyncErrorhandle(async (req, res, next) => {

    const userorder = await OrderModel.find({ userInfo: req.user.id })

    res.status(200).json({
        sucess: true,
        userorder
    })

})


//order for admin
const getAllorderByadmin = asyncErrorhandle(async (req, res, next) => {
    const userorder = await OrderModel.find()

    let totalAmount = 0;
    userorder.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        sucess: true,
        userorder,
        totalAmount
    })
})

const updateOrderStatus = asyncErrorhandle(async (req, res, next) => {
    if (!req.body.status) {
        return next(new CustomeError("Enter order Status", 422))
    }
    const order = await OrderModel.findById(req.params.id)

    if (order.OrderModel === "Delivered") {
        return next(new CustomeError("Order All ready Delivered !", 404))
    }
    order.ordersItem.forEach(async (pro) => {
        await updateproduct(pro.product, pro.quntity)
    })

    order.orderStatus = req.body.status
    if (req.body.status === "Delivered") {
        order.deliverAt = Date.now()
    }
    await order.save({ validateBeforeSave: false }, { new: true })
    res.status(200).json({
        sucess: true,
        order
    })
})
async function updateproduct(id, quntity) {
    const product = await ProductModel.findById(id)
    product.stock -= quntity
    await product.save({ validateBeforeSave: false })
}
module.exports = { orderPlace, getOrderbyOrderid, myOrder, getAllorderByadmin, updateOrderStatus, getAllorderByadmin }