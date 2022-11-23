const express = require('express')
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const app = express()
const PORT = process.env.PORT || 5000
const {MONGODB_URI} = require('./configs')

mongoose.connect(MONGODB_URI).then(()=> console.log("connected")).catch(error=>console.log(error))

const authRoutes = require("./routes/authRoutes")


app.use(express.json())
app.use(cors())
app.use(authRoutes)
dotenv.config();

app.get('/', (req, res)=>{
    res.send('Welcome!')
})

app.listen(PORT, ()=>{
    console.log(`Server started on PORT: ${PORT}`)
})