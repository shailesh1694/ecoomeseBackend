const express = require("express")
const router = express.Router()
const isAuthenticatedUser = require("../middleware/authenticateUser")
const { putNeworder, getsingleOrder, myOrder, updateOrderStatus, getAllorderByadmin } = require("../controller/orderController")
const { addTocardProduct, getUserCard, updateCardProductQuntity, deletProductFromCard } = require("../controller/cardController")
const authorizeRole = require("../middleware/authorizeRole")

//card route
router.post("/add_to_card", isAuthenticatedUser, authorizeRole("user"), addTocardProduct);
router.get("/get_card", isAuthenticatedUser, authorizeRole("user"), getUserCard);
router.put("/product_card_Quntity_update", isAuthenticatedUser, authorizeRole("user"), updateCardProductQuntity);
router.delete("/delet_card_product", isAuthenticatedUser, authorizeRole("user"), deletProductFromCard);


module.exports = router