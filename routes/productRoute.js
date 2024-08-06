const express = require("express")
const router = express.Router()
const { createProduct, getallProduct, updateProduct, deleteProduct, getProductById } = require("../controller/productController")
const isAuthenticatedUser = require("../middleware/authenticateUser")
const authorizeRole = require("../middleware/authorizeRole")

router.post("/createProduct", isAuthenticatedUser, authorizeRole("admin"), createProduct)
router.get("/allproduct", getallProduct)
router.get("/allproduct/:id", getProductById)
router.put("/updateproduct/:id", isAuthenticatedUser, authorizeRole("admin"), updateProduct)
router.delete("/product/:id", isAuthenticatedUser, authorizeRole("admin"), deleteProduct)

module.exports = router;