const asyncErrorhandle = require("../middleware/asyncErrorhandle")
const userModel = require("../model/userModel")
const { CustomeError } = require("../utils/customeError")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

const isAuthenticatedUser = asyncErrorhandle(async (req, res, next) => {


    const token = req.cookies.token ||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTkwYTI1NDQzODhlMjAwNWM2ZDk1MiIsImlhdCI6MTcwNzMxODk0MSwiZXhwIjoxNzkzNzE4OTQxfQ.20fqm3LrWJOigldSsjfTtg3zj0YuYlnSM9WcgX77Esk"
    if (!token) {
        return next(new CustomeError("Token Expire Please login Again", 401))
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    console.log(decode, "decode")
    req.user = await userModel.findById(decode.id)
    next()
})

module.exports = isAuthenticatedUser