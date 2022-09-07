let passport = require('passport')
let express = require('express')
let router = express.Router()
const jwt = require('jsonwebtoken')
const CreateToken = require('./../utils/CreateToken')
const ValidateJWT = require('./../utils/ValidateJWT')
const FindOrCreate = require('./../MongoDB/FindOrCreate')
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
    console.log(name)
    let [jwt, profile] = CreateToken({name:name, email: email, picture: picture})
    console.log("JWT", jwt)
    res.cookie("jwt", jwt, {
        domain: 'http://localhost',
        httpOnly: true,
        sameSite: 'none',
      })
    res.json({success: true, data: true, jwt: jwt})
})

router.get("/test", ValidateJWT, (req, res)=>
{
    res.json({jwt: req.JWT, success: true, bag: "Secured"})
})

module.exports = router