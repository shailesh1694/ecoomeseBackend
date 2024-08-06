const userModel = require("../model/userModel")
const asyncErrorhandle = require("../middleware/asyncErrorhandle")
const { CustomeError } = require("../utils/customeError")
const sendJwt = require("../utils/jwtToken")
const crypto = require("crypto")


const registerUser = asyncErrorhandle(async (req, res, next) => {
    const { email, password, name, role } = req.body
    if (!email || !password || !name) {
        return next(new CustomeError("Please Check RequestBody !", 422))
    }
    const user = await userModel.create(req.body)
    const token = user.generateJwt()

    // sendJwt(user, 201, res)
    res.status(201).json({
        success: true,
        token
    })
})

const loginUser = asyncErrorhandle(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new CustomeError("Enter Email or Password", 400))
    }
    const findUser = await userModel.findOne({ email: email }).select("+password")

    if (!findUser) {
        return next(new CustomeError("Invalid Email or Password", 401))
    }
    const isPasswordMatched = await findUser.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new CustomeError("Invalid Email or Password", 401))
    }
    const token = await findUser.generateJwt(24 * 60 * 60 * 1000)

    res.cookie("token", token, { httpOnly: true }).status(200).json({
        success: true,
        token
    })
})

const logOutuser = asyncErrorhandle(async (req, res, next) => {
    // res.cookie("token", null, {
    //     expires: new Date(Date.now()),
    //     httpOnly: true
    // })
    // console.log(req.user, "user")
    // const token = await req.user.expireToken()

    // console.log(token, "token")
    res.status(200).json({
        success: true,
        msg: "LogOut successfull"
    })
})

const forgotPassword = asyncErrorhandle(async (req, res, next) => {
    const findUser = await userModel.findOne({ email: req.body.email })

    if (!findUser) {
        return next(new CustomeError("User Not Found !", 404))
    }
    const resetToken = await findUser.getresetPasswordToken()
    await findUser.save({ validateBeforeSave: false })

    // const resetUrl = `${req.protocol}://${req.get("host")}/forgot_password?usertoken=${resetToken}`  link for host server in server
    const resetUrl = `/forgot_password?usertoken=${resetToken}`
    const message = `we have received password reset request and link is ${resetUrl}`
    console.log(resetUrl, "resetUrl")

    // below function for try and cath not work mailtrap service  so catch block made here and pass callback
    const Catch = () => {
        return async () => {
            this.resetPasswordToken = undefined;
            this.resetPasswordExpire = undefined
            await findUser.save({ validateBeforeSave: false })
            return next(new CustomeError("server Error try after some times", 500))
        }
    }

    // await sendEmail({
    //     email: findUser.email,
    //     subject: "password Change Request Received !",
    //     message: message
    // }, Catch)

    res.status(201).json({
        success: true,
        msg: "password Reset Link Send register Email ",
        url: resetUrl
    })
})

const resetPassword = asyncErrorhandle(async (req, res, next) => {
    console.log(req.body, "body")
    // const token = crypto.createHash("sha512").update(req.params.token).digest("hex")
    const token = crypto.createHash("sha512").update(req.body.token).digest("hex")
    const findUser = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } })
    if (!findUser) {
        return next(new CustomeError("Reset Password Tokent Invalid or Token Expire Please Regenerate Link", 400))
    }
    if (req.body.new_password !== req.body.c_newpassword) {
        return next(new CustomeError("Both password Not same", 400))
    }
    findUser.password = req.body.new_password;
    findUser.resetPasswordToken = undefined;
    findUser.resetPasswordExpire = undefined;
    await findUser.save();
    // sendJwt(findUser, 200, res)
    res.status(200).json({
        success: true,
        msg: "Password Reset Successfull!"
    })
})

const getUser = asyncErrorhandle(async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id }, "-_id")

    res.status(200).json({
        success: true,
        user,
        msg: "User Details fetched"
    })
})

const updatePassword = asyncErrorhandle(async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user.id }).select("+password")
    if (req.body.new_password !== req.body.c_newpassword) {
        return next(new CustomeError("password does not match", 400))
    }
    const comparenewpasswordwithOldpassword = await user.comparePassword(req.body.new_password)
    if (comparenewpasswordwithOldpassword) {
        return next(new CustomeError("Enter Same as Previous password !", 404))
    }
    const verifyPassword = await user.comparePassword(req.body.old_password)
    if (!verifyPassword) {
        return next(new CustomeError("old password incorrect", 400))
    }

    user.password = req.body.new_password
    await user.save()

    res.status(200).json({
        success: true,
        msg: "Password Update Successfull"
    })
})

const getAlluser = asyncErrorhandle(async (req, res, next) => {
    const user = await userModel.find()
    res.status(200).json({
        success: true,
        user
    })
})

const updateUser = asyncErrorhandle(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    if (!user) {
        return next(new CustomeError("User Not found", 404))
    }
    res.status(200).json({
        success: true,
        user,
        msg: "User Role updated"
    })

})

const getAuthToken = asyncErrorhandle(async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(404).json({ success: false, msg: "user not found!" })
    }
    res.status(200).json({ success: true, token })
})



module.exports = { registerUser, loginUser, logOutuser, forgotPassword, resetPassword, getUser, updatePassword, getAlluser, updateUser, getAuthToken }