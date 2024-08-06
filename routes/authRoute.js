const express = require("express")
const router = express.Router()
const { registerUser, loginUser, logOutuser, forgotPassword, resetPassword, getUser, getAuthToken, updatePassword, getAlluser, updateUser } = require("../controller/authController")
const isAuthenticatedUser = require("../middleware/authenticateUser")
const authorizeRole = require("../middleware/authorizeRole")

router.post("/register-user", registerUser)

router.post("/login", loginUser)
router.get("/getAuth", getAuthToken)
router.get("/logOut", isAuthenticatedUser, logOutuser)
router.post("/fogotPassword", forgotPassword)
router.patch("/resetPassword", resetPassword)
router.get("/profile", isAuthenticatedUser, getUser)
router.post("/update_password", isAuthenticatedUser, updatePassword)
router.get("/admin/alluser", isAuthenticatedUser, authorizeRole('admin'), getAlluser)
router.patch("/admin/update_user_role/:id", isAuthenticatedUser, authorizeRole('admin'), updateUser)


module.exports = router