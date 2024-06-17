const dotenv= require("dotenv").config()
let SECRET_KEY= process.env.SECRET_KEY 
const jwt = require("jsonwebtoken")


// analogy: When u go to theatre.. You go at ticket couter to
// buy ticket, there they check ur adhaar/identity etc..
// and then give u ticket... (This ticket is like "token")
// You get the token during sign-in or sign-up..

// after getting token u try to enter theatre and 
// a security guard checks if u have the token or not!
// That security guard is exactly doing what this
// "auth" function does :)
// auth function will check if token is correct or not..

const auth= (req, res, next)=>{

    try{
        let token = req.headers.authorization           // This variable will have    "  Bearer YOUR_TOKEN  "

        if(token)
        {
            token= token.split(" ")[1]              // To get "YOUR_TOKEN" because thats what our token is

            let user = jwt.verify(token, SECRET_KEY)        // Here "user" variable will store all the data which
                                                    // was put during "jwt.sign"
                                    // Now, this "user" variable has "email" and "_id" of the user it belongs to..

            req.userId = user.id        // Now new property inserted in "req" object... this "user.id" is actually
                                        // "_id" of the user :) which uniquely identifies the user
                                        // We will use this property while performing CRUD operations to
                                        // know which user we are talking about
                                        // and whose notes we need to show or delete or update...
        }
        else{
            return res.status(401).json({message:"No token provided!" })
        }

        next()
    }
    catch(error){
        console.log(error)
        res.status(401).json({message:"Unauthorised user"})
    }
}

module.exports= auth
