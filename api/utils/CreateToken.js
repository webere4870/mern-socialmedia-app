let jwt = require('jsonwebtoken')
require('dotenv').config()
function CreateToken(profile)
{
    //let profile = {
        
        // provider: user.provider,
        // picture: user._json.picture}
        // if(profile.provider == "facebook")
        // {
        //     profile.picture = user._json.picture.data.url
         //}
    let token = jwt.sign(profile, process.env.JWT_KEY, {expiresIn: 6000})
    return [token, profile]
}

module.exports = CreateToken