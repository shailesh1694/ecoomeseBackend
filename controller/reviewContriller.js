const ProductModel = require("../model/productModel")
const ReviewsModel = require("../model/reviewsModel")
const asyncErrorhandle = require("../middleware/asyncErrorhandle")
const { CustomeError } = require("../utils/customeError")

const createproductrevies = asyncErrorhandle(async (req, res, next) => {
    const { rating, comment, product_id } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment,
        product_id: product_id
    }
    const product = await ProductModel.findById(product_id)
    if (!product) {
        return next(new CustomeError("Product Not found", 404))
    }
    const isReviwedBefore = await ReviewsModel.findOneAndUpdate({ user: req.user._id }, { $set: { "rating": review.rating, "comment": review.comment } })

    if (!isReviwedBefore) {
        const newReview = new ReviewsModel(review)
        await newReview.save()
    }

    res.status(200).json({
        success: true,
        msg: "revied successfull"
    })
})

const getAllReviews = asyncErrorhandle(async (req, res, next) => {

    const product_id = req.params.id
    let avg_rating = 0;
    const findProductReview = await ReviewsModel.find({ product_id: product_id }).select("-_id -product_id -user")

    if (findProductReview.length > 0) {
        findProductReview.forEach((item, inde) => {
            avg_rating += Number(item.rating)
        })
        avg_rating = (avg_rating / findProductReview.length).toFixed(1)
    }

    res.status(200).json({
        success: true,
        msg: "Get Product Reviews",
        avg_rating: Number(avg_rating),
        totalRating: findProductReview.length,
        data: findProductReview
    })

})

module.exports = { createproductrevies ,getAllReviews}