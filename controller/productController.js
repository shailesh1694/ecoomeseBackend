const ProductModel = require("../model/productModel")
const ReviewsModel = require("../model/reviewsModel")
const asyncErrorhandle = require("../middleware/asyncErrorhandle")
const { CustomeError } = require("../utils/customeError")
const ApiFilter = require("../utils/apiFilter")



//createProduct --Admin
const createProduct = asyncErrorhandle(async (req, res, next) => {
    req.body.user = req.user.id
    const product = new ProductModel(req.body)
    await product.save()

    res.status(201).json({
        success: true,
        msg: "Product Add Successfull",
        data: product
    })
})

//getallProduct
const getallProduct = asyncErrorhandle(async (req, res, next) => {
    console.log(req.params, "params")
    const productCoutne = await ProductModel.countDocuments()
    const resultPerpage = req.params.perPage
    const filterDate = new ApiFilter(ProductModel.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerpage)
    const data = await filterDate.query;

    res.status(200).json({
        success: true,
        msg: "fetched product successfull",
        data,
        productCoutne
    })
})

const getProductById = asyncErrorhandle(async (req, res, next) => {
    // let avg_rating = 0
    const product = await ProductModel.findById(req.params.id).select("-user -_id -stock");

    // const findProductReview = await ReviewsModel.find({ product_id: req.params.id }).select("-_id -product_id -user")

    // if (findProductReview.length > 0) {
    //     findProductReview.forEach((item, inde) => {
    //         avg_rating += Number(item.rating)
    //     })
    //     avg_rating = (avg_rating / findProductReview.length).toFixed(1)
    // }

    res.status(200).json({
        success: true,
        product,
        // review: {
        //     avg_rating: avg_rating,
        //     totalRating: findProductReview.length,
        //     data: findProductReview
        // },
        msg: "Product fetched successful"
    })
})


//updateProduct --admin

const updateProduct = asyncErrorhandle(async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    let product = await ProductModel.findById(id)

    if (!product) {
        return next(new CustomeError("Product Not Found !", 404))
    }
    product = await ProductModel.findByIdAndUpdate(id, data, { new: true, runValidators: true, useFindAndModify: false })
    res.status(200).json({
        success: true,
        data: product,
        msg: "Product Update SuccessFull"
    })
})

const deleteProduct = asyncErrorhandle(async (req, res, next) => {

    const data = await ProductModel.findByIdAndDelete(req.params.id, { new: true })
    if (!data) {
        return next(new CustomeError("Product Not Found", 404))
    }
    res.status(200).json({
        success: true,
        data,
        msg: "Product Delete Successful"
    })
})

module.exports = { createProduct, getallProduct, updateProduct, deleteProduct, getProductById }