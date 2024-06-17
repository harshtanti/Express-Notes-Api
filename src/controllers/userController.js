const userModel= require("../models/user")

const bcrypt = require("bcrypt")            // For encryption and decryption

const  jwt= require("jsonwebtoken")         // for token generation..
const dotenv= require("dotenv").config()
let SECRET_KEY= process.env.SECRET_KEY             // secret key for "token-generation"

// NOTE: We use "await" whenever we are using a function for accessing database to stop the code there and 
// wait for the result to come.. because these database related functions might take long time to execute

const signup = async(req, res)=> {
    try{
        
        const {email, password, username} = req.body
        const pos=email.indexOf("@")
        const len=email.length
        const reqBodyEmail=email.substring(pos+1, len);
        if(reqBodyEmail!="gmail.com"){
            return res.status(400).json({message: "Login through gmail"})
        }

        const existingUser = await userModel.findOne({email})       // This inbuilt function will look in
                                            // DB if there's someone with the "email" equal to the value of 
                                            // email in "req.body"
        
        if(existingUser)        // If we get a value in "existingUser" variable .. it means a user already exists
        {                       // with this email
            return res.status(400).json({message: "User already exists"})
        }

        const hashPassword= await bcrypt.hash(password, 10)     // We generate a "hash-password" because... we
                                            // will be storing this data on database.. we don't want to
                                            // store our actual "password" on database.. because 
                                            // kal ko agar hack ho gaya database toh L lag jayenge
                                            // so this encrypted password is stored on DB

        const result = await userModel.create({
            email: email,
            password:hashPassword,
            username:username
        })

        const token = jwt.sign({email: result.email, id: result._id}, SECRET_KEY)   // Generating token!
                                                    // This token will store "email" and "_id"
                                                    // of the user in encrypted form.. These data can
                                                    // be retrieved later (they are retrieved in "auth")


        res.status(201).json({user: result, token:token})
    }
    catch(error)
    {
        console.log(error)
        res.status(500).json({message:"Something went wrong!"})
    }
}


const signin= async(req, res)=>{

    try{
        const {password, username, email} = req.body

        const existingUser= await userModel.findOne({email})

        if(!existingUser)
        {
            return res.status(404).json({message:"User does not exist"})
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password)     // this compare function of "bcrypt" compares
                                                                                // if password given by our user matches with the
                                                                                // password on DB

        if(matchPassword == false){
            return res.status(400).json({message:"Invalid credentials!"})
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, SECRET_KEY)
        res.status(200).json({user:existingUser, token:token})
    }

    catch(error)
    {
        console.log(error)
        res.status(500).json({message:"Something went wrong!"})
    }
}

module.exports= ({signup, signin})

