const express=require("express")
const userRouter = require("./src/routes/userRoutes")
const notesRouter = require("./src/routes/notesRoutes")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose") 
const dotenv= require("dotenv")          
dotenv.config()  

app.use(express.json())
app.use(cors())

app.use("/user",userRouter)
app.use("/notes",notesRouter)
app.get("/", (req, res)=>{                              
    res.send("Hello, this msg is sent by server!!")
})

const PORT = process.env.PORT || 5000      
const HOST= process.env.HOST || '0.0.0.0'

const password = encodeURIComponent(process.env.PASSWORD);

const mongoUrl = process.env.MONGO_DB_URL;

mongoose.connect(process.env.MONGO_DB_URL)
.then(() => {
  app.listen(PORT, HOST, () => {
    console.log("Server is running on port and host " + PORT + " " + HOST);
  }) 
})
.catch((err) => {
  console.log(err);
})
