let express = require('express')
const ValidateJWT = require('../utils/ValidateJWT')
let router = express.Router()
let UserSchema = require('./../MongoDB/Schema')
const multer  = require('multer')
const fs = require('fs')
const {randomUUID} = require('crypto')
const UUID = require('uuid')
const https = require('https')
const ListingSchema = require('./../MongoDB/ListingSchema')
let ChatSchema = require('./../MongoDB/ChatSchema')
let ReviewSchema = require('./../MongoDB/ReviewSchema')
let LeaseSchema = require('./../MongoDB/Lease')
let {ObjectId} = require('mongodb')
const ValidateToken = require('./../utils/ValidateToken')
let fetch = require('node-fetch')
var ManagementClient = require('auth0').ManagementClient;
var auth0 = new ManagementClient({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: "oAlaT7QjkOKtGiWB8ymPfuZlJTXhMhtx",
  clientSecret: "b1IDEMweuOeaJiuQ9F2fotUTX9TP5pZ8-hvqkkwnJBnr5HYyfBsZdeeUOBAgrko_",
  scope: "read:users"
});

const upload = multer({ dest: 'uploads/' })
const {BlobServiceClient} = require('@azure/storage-blob')
require("dotenv").config()
var blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
var container = blobService.getContainerClient("react-app")
let path = require('path')

let stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
let url = require('url')
const Auth0FindOrCreate = require('../utils/Auth0FindOrCreate')

router.post("/findOrCreate", ValidateToken, async (req, res)=>
{
    let {email} = req.auth
    let response = await auth0.getAccessToken()
    let data = ''
    let method = https.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users-by-email?email=${email}`, {headers:{ "Authorization": "Bearer "+response}, method: "GET"}, (response, err)=>
    {
        response.on("data", (chunk)=>
        {
            data += chunk
        })
        response.on('end', ()=>
        {
            let obj = JSON.parse(data)
            Auth0FindOrCreate(obj[0])
        })
    })
    res.json({success: true})
})

router.get("/profile", ValidateJWT, async (req, res)=>
{
    let jwt = req.auth || req.auth
    let user = await UserSchema.findOne({_id: jwt.email}, {_id:1, followers: 1, following: 1, posts: 1, bio: 1, city:1, state:1, name: 1, picture: 1, overall: 1, reviews: 1, saved: 1, stripe: 1, subscribers: 1, subscriptions: 1, availableReviews: 1, tenantRequests: 1, myRequests: 1})
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
    let item = await UserSchema.updateOne({_id: req.auth.email}, {bio: bio[0], city: city[0], state: state[0]})
    let newProfile = await UserSchema.findOne({_id: req.auth.email})
    res.json({success: true, profile: newProfile})
})

router.post("/rating", ValidateJWT, async(req,res)=>
{
    let {stars, comment, user} = req.body
    comment = comment.comment
    
    let newUser = await UserSchema.updateOne({_id: user}, { $push: { reviews: {username: req.auth.email, stars: stars, comment: comment} } })
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
    let client = container.getBlockBlobClient(req.auth.email)
    
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
    let client = container.getBlockBlobClient("bg"+req.auth.email)
    
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
    const product = await stripe.products.create({
        name: `${address} ${city}, ${state} ${zip}`,
    });
    const stripePrice = await stripe.prices.create({
        unit_amount: price,
        currency: 'usd',
        recurring: {interval: 'month'},
        product: product.id,
      });
    let upsert = new ListingSchema({address: address, city: city, state: state, ZIP: Number(zip), pictures: pictureArray, price: price, owner: req.auth.email, lat: lat, lng: lng, stripeProductID: product.id, stripePriceID: stripePrice.id})
    await upsert.save()
    res.json({success: true})
})


router.post("/listingSubscription", ValidateJWT, async (req, res)=>
{
    let listing = await ListingSchema.findOne({_id: req.body.id})
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price: listing.stripePriceID,
            // For metered billing, do not pass quantity
            quantity: 1,
          },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url: 'http://localhost:3000/successMessage?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/login',
      });
      res.json({success: true, url: session.url})
})



router.get("/listing/:id", async (req, res)=>
{

    let {id} = req.params
    let listing = await ListingSchema.findOne({_id: ObjectId(String(id))})
    res.json({success: true, listing: listing})
})

router.get("/messages/:room", ValidateJWT, async (req, res)=>
{
    let email = req.auth.email
    let {room} = req.params
    let messages = await ChatSchema.find({room: room})
    res.json({success: true, messages: messages})
})


router.get("/messageThreads", ValidateJWT, async (req, res)=>
{
    let roomList = await ChatSchema.find({$or: [{to: req.auth.email}, {from: req.auth.email}]}).distinct("room")

    let threadList = []
    for(let temp of roomList)
    {
        let msg = await ChatSchema.find({room: temp}).sort({_id: -1}).limit(1)
        let messageBlock = {to: msg[0].to, from: msg[0].from, room: msg[0].room, date: msg[0].date, message: msg[0].message}
        if(messageBlock.to == req.auth.email)
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
    let {notifications} = await UserSchema.findOne({_id: req.auth.email}, {notifications: 1}, {sort: {notifications: -1}})
    let sorted = notifications.reverse()
    res.json({success: true, notifications: sorted})
})

router.post('/notifications', ValidateJWT, async (req, res)=>
{
    res.json({success: true})
})

router.get("/savedList", ValidateJWT, async (req,res)=>
{
    console.log("Saved list success")
    let response = await UserSchema.findOne({_id: req.auth.email})
    res.json({success: true, saved: response.saved})
})


router.post("/bookmarks", ValidateJWT, async (req, res)=>
{
    let {bookmark, _id} = req.body 
    if(bookmark)
    {
        let response = await UserSchema.updateOne({_id: req.auth.email}, {$push:{saved: _id}})
    }
    else
    {
        let response = await UserSchema.updateOne({_id: req.auth.email}, {$pull:{saved: _id}})
    }
    res.json({success: true})
})

router.get('/bookmarks', ValidateJWT, async (req, res)=>
{
    let {saved} = await UserSchema.findOne({_id: req.auth.email})
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
    let response = await UserSchema.updateOne({_id: req.auth.email}, {$set: {stripe: id}})

    res.json({success: true, link: accountLink.url})
})

router.post("/stripe/payment", ValidateJWT, async (req, res)=>
{
    let {amount, user} = req.body 
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
      res.json({clientSecret: paymentIntent.client_secret, key: process.env.STRIPE_PUBLIC_KEY})
})

router.post('/paymentConfirmation', express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

router.get("/searchUsers", async (req, res)=>
{
    let {user} = req.query
    let userList = await UserSchema.find({$or: [{_id: {'$regex': String(user)}}, {name: {'$regex': String(user)}}]})
    res.json({success: true, users: userList})
})

router.get("/unread", ValidateJWT, async (req, res)=>
{
    let user = await UserSchema.findOne({_id: req.auth.email})
    res.json({success: true, unread: user.unread})
})

router.post("/deleteUnread", ValidateJWT, async (req, res)=>
{
    await UserSchema.updateOne({_id: req.auth.email}, {$pull: {unread: req.body.delete}})
    res.json({success: true})
})

router.post("/changeSubscribers", ValidateJWT, async (req, res)=>
{
    let {other, subscribe} = req.body
    let user = req.auth.email

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

router.post("/leaseRequest", ValidateJWT, async (req, res)=>
{
    let leaseRequestObject = req.body
    console.log(leaseRequestObject)
    leaseRequestObject.tenant = req.auth.email
    leaseRequestObject.startDate = new Date(leaseRequestObject.startDate)
    leaseRequestObject.endDate = new Date(leaseRequestObject.endDate)
    leaseRequestObject.price = Number(leaseRequestObject.price)
    leaseRequestObject.active = false
    let lease = await LeaseSchema.create(leaseRequestObject)
    await lease.save()
    await UserSchema.updateOne({_id: req.auth.email}, {$push: {myRequests: leaseRequestObject.landlord}})
    await UserSchema.updateOne({_id: req.body.landlord}, {$push: {tenantRequests: req.auth.email}})
    res.json({success: true})
})

router.get("/tenantRequests", ValidateJWT, async (req, res)=>
{
    let userList = await LeaseSchema.find({landlord: req.auth.email})
    console.log(userList)
    res.json({success: true, leases: userList})
})

router.post("/closeLeaseRequest", ValidateJWT, async (req, res)=>
{
    
})

router.post("/profileList", async (req, res)=>
{
    if(req.body.tab == "reviews")
    {
        let newList = req.body.list.map((temp)=>
        {
            return ObjectId(temp)
        })
        let listingList = await ListingSchema.find({_id: {$in: newList}})
        res.json({success: true, listingList: listingList})
    }
    else
    {
        let listingList = await UserSchema.find({_id: {$in: req.body.list}})
        res.json({success: true, userList: listingList})
    }
})

router.get("/reviewables", ValidateJWT, async (req, res)=>
{
    let {users} = req.body
    let userList = await UserSchema.find({_id: {$in: users}})
    res.json({success: true, users: userList})
})

router.post("/reviewables", ValidateJWT, async (req, res)=>
{
    let {user, insert} = req.body
    if(insert)
    {
        await UserSchema.updateOne({_id: req.auth.email}, {$push: {availableReviews: user}})
    }
    else
    {
        await UserSchema.updateOne({_id: req.auth.email}, {$pull: {availableReviews: user}})
    }
    res.json({success: true, users: userList})
})

router.post("/calculateRatings", async (req, res)=>
{
    let data = await ReviewSchema.aggregate([
        {
            $hospitality: {
              quizAvg: { $avg: "$hospitality"}
            }
        }
    ])
    console.log(data)
})

router.post("review", ValidateJWT, async (req, res)=>
{
    await ReviewSchema.create({})
})

module.exports = router