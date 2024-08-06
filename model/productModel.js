const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product title is required !"]
    },
    brand: {
        type: String,
        required: [true, "Product brand is required !"]
    },
    description: {
        type: String,
        required: [true, "Description is required !"]
    },
    price: {
        type: Number,
        required: [true, "please Enter Product Price !"],
        maxLength: [8, "Provide product price !"]
    },
    totalrating: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            }, url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "please Enter Product Category!"]
    },
    stock: {
        type: Number,
        required: [true, "Enter Product stock"],
        maxLength: [4, "stock must maxlength 4 character"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
        select:false
    }
    , createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)