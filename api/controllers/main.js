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
    console.log("Profile succeed")
    let jwt = req.auth || req.auth
    let user = await UserSchema.findOne({_id: jwt.email}, {_id:1, followers: 1, following: 1, posts: 1, bio: 1, city:1, state:1, name: 1, picture: 1, overall: 1, reviews: 1, saved: 1, stripe: 1, subscribers: 1, subscriptions: 1})
    console.log(user, "ehre")
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
      console.log(session)
      res.json({success: true, url: session.url})
})

router.post("/webhook", async (req, res) => {
    let data;
    let eventType;
    console.log('haer')
    // Check if webhook signing is configured.
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];
  
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }

    console.log(data, eventType)
  
    switch (eventType) {
        case 'checkout.session.completed':
          // Payment is successful and the subscription is created.
          // You should provision the subscription and save the customer ID to your database.
          break;
        case 'invoice.paid':
          // Continue to provision the subscription as payments continue to be made.
          // Store the status in your database and check when a user accesses your service.
          // This approach helps you avoid hitting rate limits.
          break;
        case 'invoice.payment_failed':
          // The payment failed or the customer does not have a valid payment method.
          // The subscription becomes past_due. Notify your customer and send them to the
          // customer portal to update their payment information.
          break;
        default:
        // Unhandled event type
      }
  
    res.sendStatus(200);
  });

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
    console.log(city, state, price)
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
    console.log(listings, "Listings")
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
    console.log(response.saved)
    res.json({success: true, saved: response.saved})
})


router.post("/bookmarks", ValidateJWT, async (req, res)=>
{
    let {bookmark, _id} = req.body 
    console.log(req.body)
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
    console.log(req.auth.email)
    let response = await UserSchema.updateOne({_id: req.auth.email}, {$set: {stripe: id}})
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
    console.log("here")
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

router.post("/profileList", async (req, res)=>
{
    let userList = await UserSchema.find({_id: {$in: req.body.list}})
    console.log(userList)
    res.json({success: true, userList: userList})
})

module.exports = router