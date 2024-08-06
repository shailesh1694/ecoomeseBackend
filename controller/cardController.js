const asyncErrorhandle = require("../middleware/asyncErrorhandle");
const CustomeError = require("../utils/customeError");
const ProductModel = require("../model/productModel");
const CardModel = require("../model/cardModel");

const addTocardProduct = asyncErrorhandle(async (req, res, next) => {
    const { product_id, productQty } = req.body;

    if (!product_id || !productQty) {
        return next(new CustomeError("Please Check Request Body", 422));
    }

    const findProduct = await ProductModel.findById(product_id);

    if (!findProduct) {
        return next(new CustomeError("Product Not Found !", 404));
    }

    let findOrder = await CardModel.findOne({ user: req.user._id })

    const card = {
        product_id: product_id,
        productQty: productQty,
        productPrice:findProduct.price
    }
    if (findOrder) {
        if (findOrder.product.some((item) => item.product_id.toString() === product_id)) {
            await CardModel.updateOne({ user: req.user._id, "product.product_id": product_id.toString() }, { $inc: { "product.$.productQty": 1 } }, { new: true })
        } else {
            await CardModel.updateOne({ user: req.user._id }, { $push: { product: card } })
        }
    } else {
        const CreateCard = new CardModel({
            user: req.user.id,
            product: card
        });

        await CreateCard.save();
    }

    res.status(200).json({
        success: true,
        msg: "Add To Card SuccessFull!"
    })

})

const getUserCard = asyncErrorhandle(async (req, res, next) => {
    const findOrder = await CardModel.find({ user: req.user._id }).populate("product.product_id")
    let totalQuntity = 0;
    let totalPrice = 0
    if (findOrder[0]?.product?.length > 0) {
        findOrder[0]?.product?.forEach((item, index) => {
            totalPrice += ((item.productQty) * (item.productPrice));
            totalQuntity += item.productQty;
        })
    }

    res.status(200).json({
        success: true,
        data: findOrder,
        totalPrice,
        totalQuntity,
        msg: "Get Card SuccessFull!"
    })
})

const updateCardProductQuntity = asyncErrorhandle(async (req, res, next) => {
    const { productQty, product_id } = req.body;

    if (product_id === "" || productQty <= 0) {
        return next(new CustomeError("Please Provide Valid Quntity or Product id ", 403))
    }

    await CardModel.updateOne({ user: req.user._id, "product.product_id": product_id.toString() }, { $set: { "product.$.productQty": productQty } }, { new: true })

    res.status(200).json({
        success: true,
        msg: "Quntity Update Successfull"
    })

})

const deletProductFromCard = asyncErrorhandle(async (req, res, next) => {
    const product_id = req.body.product_id

    const findOrder = await CardModel.findOne({ user: req.user._id })
    console.log(findOrder,"order")

    if (!findOrder.product.some((item) => item.product_id.toString() === product_id)) {
        return next(new CustomeError("Product Not Found in Card!", 404))
    }
    if (findOrder.product.length === 1) {
        await CardModel.deleteOne({ user: req.user._id })
    } else {
        await CardModel.updateOne({ user: req.user._id }, { $pull: { product: { product_id: product_id } } }, { new: true })
    }


    res.status(200).json({
        success: true,
        msg: "Product Remove From Card Successfull !"
    })
})

module.exports = { addTocardProduct, getUserCard, updateCardProductQuntity, deletProductFromCard };