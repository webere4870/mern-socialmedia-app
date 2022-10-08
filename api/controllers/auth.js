let passport = require('passport')
let express = require('express')
let router = express.Router()
const jwt = require('jsonwebtoken')
const CreateToken = require('./../utils/CreateToken')
const ValidateJWT = require('./../utils/ValidateJWT')
const FindOrCreate = require('./../MongoDB/FindOrCreate')
const VerifyUser = require('./../MongoDB/VerifyUser')
const {sendEmail, verifyEmailToken} = require('./../utils/EmailVerification')
const UserSchema = require('./../MongoDB/Schema')
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID) 




router.get("/auth/google", passport.authenticate('google', {scope: ['profile', 'email']}))


router.post("/api/v1/auth/google", async (req, res) => {
    const { token }  = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const { name, email, picture } = ticket.getPayload();    
    let response = await FindOrCreate(email, "", "google", name, picture)
    if(response.accepted == true)
    {
        let [jwt, profile] = CreateToken({name:name, email: email, picture: picture})
        res.json({success: true, data: true, jwt: jwt, profile: profile})
    }
    else
    {
        res.json({success: false})
    }
})

router.post("/login", async (req,res)=>
{
    let {email, password} = req.body
    let user = await UserSchema.findOne({_id: email})
    if(user)
    {
        let isValid = await VerifyUser(email, password)
        if(isValid && user.active)
        {
            let [token, profile] = CreateToken({email: email, password: password, picture: null})
            res.json({success: true, jwt: token, profile: profile})
        }
        else
        {
            res.json({success: false, message: "Invalid password"})
        }
        
    }
    else
    {
        res.json({success: false, message: "User does not exist"})
    }
})

router.post("/register", async (req,res)=>
{
    let {name,email, password} = req.body
    let response = await FindOrCreate(email, password, null, name, "")
    if(response.accepted == true)
    {
        sendEmail(email)
        res.json({success: true})
    }
    else
    {
        res.json({success: false})
    }
})

router.get("/test", ValidateJWT, (req, res)=>
{
    console.log(req.JWT)
    res.json({jwt: req.JWT, success: true, bag: "Secured"})
})

router.post("/verifyAccount", async (req, res)=>
{
    let {email, token} = req.body
    let validate = verifyEmailToken(token)
    if(validate.success)
    {
        await UserSchema.updateOne({_id: email}, {active: true})
        res.json({success: true})
    }
    else
    {
        console.log("er")
        await UserSchema.remove({_id: email})
        res.json({success: false})
    }
    
})

module.exports = router