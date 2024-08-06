const { CustomeError } = require("../utils/customeError")

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomeError(`resource not accessable to ${req.user.role} `, 403))
        }
        next()
    }

}

module.exports = authorizeRole