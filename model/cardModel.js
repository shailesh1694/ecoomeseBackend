const mongoose = require("mongoose");


const cardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
        select: false
    },
    product: [{
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
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

module.exports = mongoose.model("CardModel", cardSchema);