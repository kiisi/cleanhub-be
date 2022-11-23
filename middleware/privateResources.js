const jwt = require("jsonwebtoken")
const {JWT_SECRETS} = require("../configs")
const UserModel = require("../models/UserModel")

module.exports = (req, res, next) =>{

    const {authorization} = req.headers
    if(!authorization){
        return res.status(400).json({error: "Unauthorized User"})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (error, payload) =>{
        if(error){
            return res.status(400).json({error: "Unauthorized User"})
        }

        const {_id} = payload
        UserModel.findOne({_id})
        .then(dbUser=>{
            req.dbUser = dbUser
            next()
        })
    })
}