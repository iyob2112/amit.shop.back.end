const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 500, // Limit each IP to 500 requests per minute
    standardHeaders: true, // Include rate limit headers in response
    legacyHeaders: false, // Disable legacy `X-RateLimit-*` headers
  
    messsage: (req, res, next) => {
    return res.json({
            message : "Too many requests from this IP, please try again later!",
            success : false,
            error : true
        })
    },
  });
  
  
  const app = express()
  app.use(limiter)
app.use(cors({
    origin: process.env.FRONTEND_URL, // allow to server to accept request from different origi
    credentials: true, // Allow credentials (cookies, authentication headers, etc.)
}))
app.use(express.json({ limit: "50mb" }));  // Adjust the limit as needed
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())

app.use("/api",router)

const PORT = 8080 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
 