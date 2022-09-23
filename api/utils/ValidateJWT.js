let jwt = require('jsonwebtoken')
require('dotenv').config()

function ValidateJWT(req, res, next)
{
    const token = req.headers['x-access-token']
    if(token)
    {
            try{
               let valid = jwt.verify(token, process.env.JWT_KEY)
               if(valid)
               {
                req.JWT = valid
                next()
               } 
               else{
                res.json({success: false})
               }
            }
            catch(err)
            {
                res.clearCookie("jwt")
                res.json({success: false})
            }
    }
    else{
        res.json({success: false})
    }
}

module.exports = ValidateJWT