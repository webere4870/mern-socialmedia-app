let express = require('express')
const ValidateJWT = require('../utils/ValidateJWT')
let router = express.Router()
let UserSchema = require('./../MongoDB/Schema')
const multer  = require('multer')
const fs = require('fs')


const upload = multer({ dest: 'uploads/' })
const {BlobServiceClient} = require('@azure/storage-blob')
require("dotenv").config()
var blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
var container = blobService.getContainerClient("react-app")

let path = require('path')


router.get("/profile", ValidateJWT, async (req, res)=>
{
    let jwt = req.jwt || req.JWT
    let user = await UserSchema.findOne({_id: jwt.email}, {_id:1, followers: 1, following: 1, posts: 1, bio: 1, name: 1, picture: 1})
    res.json({success: true, user: user})
})

router.post("/profilePicture", ValidateJWT, upload.single('avatar'), async (req, res)=>
{
    //const stream = fs.createWriteStream(path.join(__dirname, "\\..\\uploads\\"+req.file.filename));
    const buf = fs.readFileSync(path.join(__dirname, "\\..\\uploads\\"+req.file.filename));
    buf.toString('utf8'); 
    let client = container.getBlockBlobClient(req.JWT.email)
    const options = { blobHTTPHeaders: { blobContentType: req.file.mimetype } };
    await client.uploadData(buf, options)
    //console.log(path.join(__dirname, "\\..\\uploads\\"+req.file.filename))
    //await container.uploadBlockBlob(path.join(__dirname, "\\..\\uploads"+req.file.filename))
    res.json({success: true})
})

module.exports = router