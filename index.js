const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(cors())
app.use(helmet)

app.use(express.json())

app.get("/", (req,res) =>{
    res.json({message: "Hello World"})
})

app.listen(process.env.PORT,()=>{
    console.log("Listening on port", process.env.PORT)
})