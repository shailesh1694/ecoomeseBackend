const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: [50, "Name character max in 50 "]
    },
    email: {
        type: String,
        unique: true,
        validate: [validator.isEmail, "Enter Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Enter Your Password"],
        select: false
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 8)
    next()
})

userSchema.methods.generateJwt = function (time) {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, { expiresIn: time })
}
userSchema.methods.expireToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, { expiresIn: 1 })
}

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

userSchema.methods.getresetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto.createHash("sha512").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + (1 * 15 * 60 * 1000)

    return resetToken
}
module.exports = mongoose.model("UserModel", userSchema)