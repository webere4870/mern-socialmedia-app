let express = require('express')
const ValidateJWT = require('../utils/ValidateJWT')
let router = express.Router()
let UserSchema = require('./../MongoDB/Schema')

router.get("/profile", ValidateJWT, async (req, res)=>
{
    let jwt = req.jwt || req.JWT
    let user = await UserSchema.findOne({_id: jwt.email}, {_id:1, followers: 1, following: 1, posts: 1, bio: 1, name: 1, picture: 1})
    res.json({success: true, user: user})
})

module.exports = router