const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    shipingInfo: {
        address: {
            type: String, required: true
        },
        city: {
            type: String, required: true
        },
        state: {
            type: String, required: true
        },
        country: {
            type: String, required: true
        },
        pincode: {
            type: String, required: true
        },
        MobileNo: {
            type: String, required: true
        },
    },
    ordersItem: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        productQty: {
            type: Number,
            required: true
        },
        productPrice: {
            type: Number,
            required: true
        }
    }],
    order_id: {
        type: String,
        required: true
    },
    userInfo: {
        type: mongoose.Schema.ObjectId,
        ref: "UserModel",
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalQuntity: {
        type: Number,
        default: 0,
        required: true
    },
    orderStatus: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paymenstStatus: {
        type: String,
        default: "pending",
        required: true,
        enum: ["pending", "success"]
    }
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)