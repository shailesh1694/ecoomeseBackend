const mongoose = require("mongoose")

const connectDB = async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/EcommerseAPI")
    .then(()=>{console.log(`Db connected At ${mongoose.connection.host}`)})
    .catch((error)=>{console.log(error,"DB error")})
}

module.exports = connectDB