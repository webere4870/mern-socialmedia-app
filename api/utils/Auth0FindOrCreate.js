const UserSchema = require('./../MongoDB/Schema')

async function Auth0FindOrCreate({email, picture, name})
{
    let user = await UserSchema.findOne({_id: email})
    if(!user)
    {
        let newUser = await UserSchema.create({_id: email, picture: picture, name: name, notifications: false, city: "", state: "", bio: "", reviews: [], overall: 0, saved: [], unread: [], active: true, stripe: "", subscribers: [], subscriptions: []})
        newUser.save()
    }
}   

module.exports = Auth0FindOrCreate