const CustomeError = require("../utils/customeError")

module.exports = (callback) => {

    return (req, res, next) => {
        callback(req, res, next).catch(error => {
            if (error.message === "CustomeError is not a constructor") {
                return next(new CustomeError("Token Expires1", 403))
            }
            return next(error)
        }
        )
    }
}