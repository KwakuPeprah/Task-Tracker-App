// Project: Task Tracker-app
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authenticationRouter = require('./routers/authenticationRouter');
const postsRouter = require('./routers/postsRouter');

const app = express();
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database connected successfully....")
}).catch((err) => {
    console.log(err)
})

// Routes
app.use('/api/auth',authenticationRouter)//if a route has /api/auth, it will be directed to authenticationRouter
app.use('/api/posts',postsRouter)//if a route has /api/posts, it will be directed to postsRouter

app.get("/", (req,res) =>{
    res.json({message: "Hello World"})
})

app.listen(process.env.PORT,()=>{
    console.log("Listening on port", process.env.PORT)
})