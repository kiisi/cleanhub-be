const UserModel = require('../models/UserModel')
const bycrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../configs");
const gravatar = require("gravatar")

module.exports.signup = async (req, res) =>{
    
    /* 
    first_name, last_name, email, phone_number, password, confirm_password

    To be received from backend, Should be written exactly
    */
    const {first_name, last_name, email, phone_number, password, confirm_password} = req.body
    

    if(!first_name || !last_name || !phone_number || !email || !password || !confirm_password){
        return res.status(400).json({error: "One or more field is empty!"})
    }

    if(password !== confirm_password){
        return res.status(400).json({error: "Password does not match!"})
    }

    UserModel.findOne({email:email})
    .then((user) =>{
        
        if(user){
            return res.status(400).json({error: "User already exists!"}) 
        }


        bycrypt.hash(password, 10)
        .then(hashedPassword =>{

            const dbUser = new UserModel({firstName: first_name, lastName: last_name, email: email, phoneNumber: phone_number, password: hashedPassword})

            dbUser.save()
            .then((u)=>{
                console.log("user:", u)
                res.status(201).json({success: "User registration successful!"})
            })
            .catch(error=>console.log(error))
        })
    })
    .catch(error=> console.log(error));

}

module.exports.login = async (req, res) =>{

    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({error: "One or more field is empty!"})
    }

    UserModel.findOne({email})
    .then((dbUser)=>{
        if(!dbUser){
            return res.status(400).json({error: "User doesn't exists"})
        }
        bycrypt.compare(password, dbUser.password)
        .then((match)=>{
            if(match){
                const jwtToken = jwt.sign({_id: dbUser._id, email: dbUser.email}, JWT_SECRET);
                console.log(dbUser)
                return res.json({token: jwtToken})

            }else{
                return res.status(400).json({error: "Invalid credentials"})
            }
        }).catch(error=>console.log(error))

    }).catch(error=> console.log(error))

}