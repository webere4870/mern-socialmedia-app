let express = require('express')
let app = express()
let authRouter = require('./controllers/auth')
let mainRouter = require('./controllers/main')
let cookieParser = require('cookie-parser')
let cors = require('cors')
let session = require('express-session')
let mongoose = require('mongoose')
require('./MongoDB/Mongo')
require('./MongoDB/Schema')
require('./MongoDB/ListingSchema')
var corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://104.142.122.231",
      ],
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ["GET", "PUT"],
  exposedHeaders: ["set-cookie"],
  withCredentials: true
}
app.set("trust proxy", 1)
app.use(cookieParser())

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://104.142.122.231",
      ],
  exposedHeaders: ["set-cookie"],
      credentials: true
}))




app.use(express.urlencoded({extended: true, limit: "10000kb"}))
app.use(express.json({limit: "10000kb"}))


app.use("/",authRouter)
app.use("/", mainRouter)


app.listen(5000, ()=>
{
    console.log("Listening on 5000")
})