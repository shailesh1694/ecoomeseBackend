const app = require("express")
const router = app.Router()
const isAuthenticatedUser = require("../middleware/authenticateUser")
const authorizeRole = require("../middleware/authorizeRole")
const { getAllReviews,createproductrevies} = require("../controller/reviewContriller")

router.post("/product_review", isAuthenticatedUser, authorizeRole("user"), createproductrevies)
router.get("/allReview/:id", getAllReviews)


module.exports = router