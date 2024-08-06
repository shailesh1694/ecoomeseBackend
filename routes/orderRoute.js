const express = require("express")
const router = express.Router()
const isAuthenticatedUser = require("../middleware/authenticateUser")
const { orderPlace, getOrderbyOrderid, myOrder, updateOrderStatus, getAllorderByadmin } = require("../controller/orderController")
const authorizeRole = require("../middleware/authorizeRole")

//order route
router.post("/place_order", isAuthenticatedUser, authorizeRole("user"),orderPlace)
router.get("/order/:id", isAuthenticatedUser, getOrderbyOrderid)
router.get("/myOrders", isAuthenticatedUser, myOrder)

//admin
router.post("/admin/orders/status/:id", isAuthenticatedUser, authorizeRole("admin"), updateOrderStatus)
router.get("/admin/all_order", isAuthenticatedUser, authorizeRole("admin"), getAllorderByadmin)

module.exports = router