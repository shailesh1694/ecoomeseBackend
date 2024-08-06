const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    userInfo: {
        type: mongoose.Schema.ObjectId,
        ref: "UserModel",
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    payment_id: {
        type: String
    },
    totalAmouttoPaid: {
        type: Number,
        default: 0,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["pending", "success"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date().toISOString()
    }
}, { timestamps: true })

module.exports = mongoose.model("Payment", paymentSchema)