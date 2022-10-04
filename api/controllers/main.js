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
let {ObjectId} = require('mongodb')

const upload = multer({ dest: 'uploads/' })
const {BlobServiceClient} = require('@azure/storage-blob')
require("dotenv").config()
var blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
var container = blobService.getContainerClient("react-app")
let path = require('path')

let stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
let url = require('url')



router.get("/profile", ValidateJWT, async (req, res)=>
{
    let jwt = req.jwt || req.JWT
    let user = await UserSchema.findOne({_id: jwt.email}, {_id:1, followers: 1, following: 1, posts: 1, bio: 1, city:1, state:1, name: 1, picture: 1, overall: 1, reviews: 1, saved: 1, stripe: 1, subscribers: 1, subscriptions: 1})
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


router.post("/backgroundPicture", ValidateJWT, upload.single('avatar'), async (req, res)=>
{
    //const stream = fs.createWriteStream(path.join(__dirname, "\\..\\uploads\\"+req.file.filename));
    const buf = fs.readFileSync(path.join(__dirname, "\\..\\uploads\\"+req.file.filename));
    buf.toString('utf8'); 
    let client = container.getBlockBlobClient("bg"+req.JWT.email)
    
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

router.get("/listing/:id", async (req, res)=>
{

    let {id} = req.params
    let listing = await ListingSchema.findOne({_id: ObjectId(String(id))})
    res.json({success: true, listing: listing})
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

router.get('/userListings/:owner', async (req, res)=>
{
    let listings = await ListingSchema.find({owner: req.params.owner})
    res.json({success: true, listings: listings})
})

router.get('/notifications', ValidateJWT, async (req, res)=>
{
    let {notifications} = await UserSchema.findOne({_id: req.JWT.email}, {notifications: 1}, {sort: {notifications: -1}})
    let sorted = notifications.reverse()
    res.json({success: true, notifications: sorted})
})

router.post('/notifications', ValidateJWT, async (req, res)=>
{
    res.json({success: true})
})

router.get("/savedList", ValidateJWT, async (req,res)=>
{

    let response = await UserSchema.findOne({_id: req.JWT.email})
    res.json({success: true, saved: response.saved})
})


router.post("/bookmarks", ValidateJWT, async (req, res)=>
{
    let {bookmark, _id} = req.body 
    if(bookmark)
    {
        let response = await UserSchema.updateOne({_id: req.JWT.email}, {$push:{saved: _id}})
    }
    else
    {
        let response = await UserSchema.updateOne({_id: req.JWT.email}, {$pull:{saved: _id}})
    }
    res.json({success: true})
})

router.get('/bookmarks', ValidateJWT, async (req, res)=>
{
    let {saved} = await UserSchema.findOne({_id: req.JWT.email})
    let savedMap = saved.map((temp)=>ObjectId(temp))
    let bookmarks = await ListingSchema.find({_id: {$in: savedMap}})
    res.json({success: true, bookmarks: bookmarks})
})

router.get("/stripe/key", ValidateJWT, async (req, res)=>
{
    res.json({success: true, key: process.env.STRIPE_PUBLIC_KEY})
})

router.post("/stripe/account", ValidateJWT, async (req, res)=>
{
    const {id} = await stripe.accounts.create({type: 'express'});
    
    const accountLink = await stripe.accountLinks.create({
        account: id,
        refresh_url: 'http://localhost:3000',
        return_url: 'http://localhost:3000/search',
        type: 'account_onboarding',
    });
    console.log(req.JWT.email)
    let response = await UserSchema.updateOne({_id: req.JWT.email}, {$set: {stripe: id}})
    console.log(response)
    console.log(accountLink)
    res.json({success: true, link: accountLink.url})
})

router.post("/stripe/payment", ValidateJWT, async (req, res)=>
{
    let {amount, user} = req.body 
    console.log(amount, user)
    let userData = await UserSchema.findOne({_id: user})
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount),
        currency: 'usd',
        payment_method_types: ['card'],
        application_fee_amount: 1,
        transfer_data: {
          destination: userData.stripe,
        },
      });
      console.log(paymentIntent)
      res.json({clientSecret: paymentIntent.client_secret, key: process.env.STRIPE_PUBLIC_KEY})
})

router.get("/searchUsers", async (req, res)=>
{
    let {user} = req.query
    console.log(user)
    let userList = await UserSchema.find({$or: [{_id: {'$regex': String(user)}}, {name: {'$regex': String(user)}}]})
    res.json({success: true, users: userList})
})

router.get("/unread", ValidateJWT, async (req, res)=>
{
    let user = await UserSchema.findOne({_id: req.JWT.email})
    res.json({success: true, unread: user.unread})
})

router.post("/deleteUnread", ValidateJWT, async (req, res)=>
{
    await UserSchema.updateOne({_id: req.JWT.email}, {$pull: {unread: req.body.delete}})
    res.json({success: true})
})

router.post("/changeSubscribers", ValidateJWT, async (req, res)=>
{
    console.log("here")
    let {other, subscribe} = req.body
    let user = req.JWT.email

    if(subscribe)
    {
        await UserSchema.updateOne({_id: user}, {$push: {subscriptions: other}})
        await UserSchema.updateOne({_id: other}, {$push: {subscribers: user}})
    }
    else
    {
        await UserSchema.updateOne({_id: user}, {$pull: {subscriptions: other}})
        await UserSchema.updateOne({_id: other}, {$pull: {subscribers: user}})
    }
    res.json({success: true})
})

router.post("/profileList", async (req, res)=>
{
    let userList = await UserSchema.find({_id: {$in: req.body.list}})
    console.log(userList)
    res.json({success: true, userList: userList})
})

module.exports = router