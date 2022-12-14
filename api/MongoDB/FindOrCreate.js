const UserSchema = require('./../MongoDB/Schema')
let bcrypt = require('bcrypt')
let FetchProfile = require('./../utils/FetchProfile')
const {BlobServiceClient} = require('@azure/storage-blob')
require("dotenv").config()
var blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
var container = blobService.getContainerClient("react-app")
let path = require('path')
let fs = require('fs')

async function FindOrCreate(username, password, provider, name, picture)
{
    return new Promise((resolve, reject)=>
    {
        UserSchema.findOne({_id: username}, async (err, result)=>
        {
            if(!result && !provider)
            {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, async function(err, hash) {
                        let newRecord = await UserSchema.create({_id: username, hash: hash, salt: salt, name: name, picture: picture, provider: "E-Web-Software", active: false, notifications: [], city: "", state: "", bio: "", reviews: [], overall: 0, saved: [], unread: [], active: false, stripe: "", subscriptions: [], availableReviews: [], myRequests: [], tenantRequests: [] })
                        await newRecord.save()
                        let client = container.getBlockBlobClient(username)
                        // await client.beginCopyFromURL("https://pixabay.com/images/id-1846734/")
                        let background = container.getBlockBlobClient("bg"+username)
                        fs.rename("default.png", username, async (response)=>
                        {
                            await client.uploadFile(username, {blobHTTPHeaders: {blobContentType: "image/png"}})
                            fs.rename(username, "default.png", (response)=>
                            {
                                fs.rename("defaultbg.jpg", "bg"+username, async (response)=>
                                {
                                    await background.uploadFile("bg"+username, {blobHTTPHeaders: {blobContentType: "image/jpeg"}})
                                    fs.rename("bg"+username, "defaultbg.jpg", (response)=>
                                    {
                                        console.log(response)
                                        resolve({accepted: true})
                                    })
                                })
                            })
                        })
                    });
                })
            }
            else if(!result)
            {
                let newRecord = await UserSchema.create({_id: username, hash: "", salt: "", picture: picture, provider: provider, name: name, active: false, notifications: false, city: "", state: "", bio: "", reviews: [], overall: 0, saved: [], unread: [], active: true, stripe: "", subscribers: [], subscriptions: [], availableReviews: [], myRequests: [], tenantRequests: []})
                newRecord.save()
                let client = container.getBlockBlobClient(username)
                let background = container.getBlockBlobClient("bg"+username)
                fs.rename("default.png", username, async (response)=>
                {
                    await client.uploadFile(username, {blobHTTPHeaders: {blobContentType: "image/png"}})
                    fs.rename(username, "default.png", (response)=>
                    {
                        fs.rename("defaultbg.jpg", "bg"+username, async (response)=>
                        {
                            await background.uploadFile("bg"+username, {blobHTTPHeaders: {blobContentType: "image/jpeg"}})
                            fs.rename("bg"+username, "defaultbg.jpg", (response)=>
                            {
                                resolve({accepted: true})
                            })
                        })
                    })
                })
                
                
            }
            else if(!provider)
            {
                resolve({accepted: false})
            }
            else
            {
                if(provider == result.provider)
                {
                    resolve({accepted: true})
                }
                else
                {
                    resolve({accepted: false})
                }
            }
        })
    })
}

module.exports = FindOrCreate