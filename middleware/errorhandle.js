
module.exports = (error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        success: false,
        msg: error.message,
        error: error,
        stack: error.stack
    })
}