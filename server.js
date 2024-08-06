const express = require("express")
const app = express()
const connectDB = require("./config/db")
const morgan = require("morgan")
const dotEnv = require("dotenv")
const errorhandle = require("./middleware/errorhandle")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const cors = require("cors")

dotEnv.config({ path: "./.env" })

connectDB()

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/v1", require("./routes/productRoute"));
app.use('/api/v1', require("./routes/authRoute"));
app.use("/api/v1", require("./routes/cardRoute"));
app.use("/api/v1", require("./routes/reviewRoute"));
app.use("/api/v1", require("./routes/paymentRoute"));
app.use("/api/v1", require("./routes/orderRoute"));

app.use(errorhandle)
app.listen(process.env.PORT, () => {
    console.log(`Listing At ${process.env.PORT}`)
})