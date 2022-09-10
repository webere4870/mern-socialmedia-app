const UserSchema = require('./../MongoDB/Schema')
let bcrypt = require('bcrypt')
let FetchProfile = require('./../utils/FetchProfile')
const {BlobServiceClient} = require('@azure/storage-blob')
var blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING);
var container = blobService.getContainerClient("react-app")

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
                        let newRecord = await UserSchema.create({_id: username, hash: hash, salt: salt, name: name, picture: picture, provider: "E-Web-Software", active: false, notifications: []})
                        await newRecord.save()
                        let client = container.getBlockBlobClient(username)
                        await client.beginCopyFromURL("https://pixabay.com/images/id-1846734/")
                        resolve({accepted: true})
                    });
                })
            }
            else if(!result)
            {
                let newRecord = await UserSchema.create({_id: username, hash: "", salt: "", picture: picture, provider: provider, name: name, active: false, notifications: false})
                newRecord.save()
                let client = container.getBlockBlobClient(username)
                console.log("picture", picture)
                await client.beginCopyFromURL(picture)
                resolve({accepted: true})
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