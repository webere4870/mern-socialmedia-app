let express = require('express')
const ValidateJWT = require('../utils/ValidateJWT')
let router = express.Router()
let UserSchema = require('./../MongoDB/Schema')
const multer  = require('multer')
const fs = require('fs')
const {randomUUID} = require('crypto')
const UUID = require('uuid')
const ListingSchema = require('./../MongoDB/ListingSchema')
let ChatSchema = require('./../MongoDB/ChatSchema')


const upload = multer({ dest: 'uploads/' })
const {BlobServiceClient} = require('@azure/storage-blob')
require("dotenv").config()
var blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
var container = blobService.getContainerClient("react-app")
let path = require('path')



router.get("/profile", ValidateJWT, async (req, res)=>
{
    let jwt = req.jwt || req.JWT
    let user = await UserSchema.findOne({_id: jwt.email}, {_id:1, followers: 1, following: 1, posts: 1, bio: 1, city:1, state:1, name: 1, picture: 1})
    res.json({success: true, user: user})
})

router.get("/getUser/:id", async (req, res)=>
{
    let id = req.params.id

    let profile = await UserSchema.findOne({_id: id})

    res.json({success: true, profile: profile})
})

router.post("/profile", ValidateJWT, async (req,res)=>
{
    let {bio, city, state} = req.body
    let item = await UserSchema.updateOne({_id: req.JWT.email}, {bio: bio[0], city: city[0], state: state[0]})
    let newProfile = await UserSchema.findOne({_id: req.JWT.email})
    res.json({success: true, profile: newProfile})
})

router.post("/rating", ValidateJWT, async(req,res)=>
{
    let {stars, comment, user} = req.body
    comment = comment.comment
    
    let newUser = await UserSchema.updateOne({_id: user}, { $push: { reviews: {username: req.JWT.email, stars: stars, comment: comment} } })
    let tempUser = await UserSchema.findOne({_id: user})
    let starCount = 0
    let indexCount = 0
    for(let temp of tempUser.reviews)
    {
        starCount += temp.stars
        indexCount++
    }
    let newRating = Math.round(starCount / indexCount)
    let update = await UserSchema.updateOne({_id: user}, {overall: newRating})
    let finalUser = await UserSchema.findOne({_id: user})
    res.json({success: true, user: finalUser})
})

router.post("/profilePicture", ValidateJWT, upload.single('avatar'), async (req, res)=>
{
    //const stream = fs.createWriteStream(path.join(__dirname, "\\..\\uploads\\"+req.file.filename));
    const buf = fs.readFileSync(path.join(__dirname, "\\..\\uploads\\"+req.file.filename));
    buf.toString('utf8'); 
    let client = container.getBlockBlobClient(req.JWT.email)
    
    const options = { blobHTTPHeaders: { blobContentType: req.file.mimetype } };
    await client.uploadData(buf, options)
    fs.unlinkSync(path.join(__dirname, "\\..\\uploads\\"+req.file.filename))
    res.json({success: true})
})

router.post("/listing", ValidateJWT, upload.any('avatar'), async (req, res)=>
{
    //const stream = fs.createWriteStream(path.join(__dirname, "\\..\\uploads\\"+req.file.filename));
    let {address, city, state, zip, price, lat, lng} = req.body
    let pictureArray = []
    for(let file of req.files)
    {
        const buf = fs.readFileSync(path.join(__dirname, "\\..\\uploads\\"+file.filename));
        buf.toString('utf8'); 
        let newID = UUID.v4()
        pictureArray[pictureArray.length] = newID
        let client = container.getBlockBlobClient(newID)
        const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };
        await client.uploadData(buf, options)
        fs.unlinkSync(path.join(__dirname, "\\..\\uploads\\"+file.filename))
    }
    let upsert = new ListingSchema({address: address, city: city, state: state, ZIP: Number(zip), pictures: pictureArray, price: price, owner: req.JWT.email, lat: lat, lng: lng})
    await upsert.save()
    res.json({success: true})
})

router.get("/messages/:room", ValidateJWT, async (req, res)=>
{
    let email = req.JWT.email
    let {room} = req.params
    let messages = await ChatSchema.find({room: room})
    res.json({success: true, messages: messages})
})


router.get("/messageThreads", ValidateJWT, async (req, res)=>
{
    let roomList = await ChatSchema.find({$or: [{to: req.JWT.email}, {from: req.JWT.email}]}).distinct("room")

    let threadList = []
    for(let temp of roomList)
    {
        let msg = await ChatSchema.find({room: temp}).sort({_id: -1}).limit(1)
        let messageBlock = {to: msg[0].to, from: msg[0].from, room: msg[0].room, date: msg[0].date, message: msg[0].message}
        if(messageBlock.to == req.JWT.email)
        {
            messageBlock.email = messageBlock.from
        }
        else
        {
            messageBlock.email = messageBlock.to
        }
        threadList.push(messageBlock)
    }
    res.json({success: true, threads: threadList})
})


router.post("/listings", async (req, res)=>
{
    let {city, state, price} = req.body
    let listings
    if(price)
    {
        listings = await ListingSchema.find({city: city, state: state})
    }
    else
    {
        listings = await ListingSchema.find({$and: [{state: state}]})
    }
    res.json({success: true, listings: listings})
})


module.exports = router