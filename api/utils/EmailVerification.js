let jwt = require('jsonwebtoken')
let nodemailer = require('nodemailer')
require('dotenv').config()

let temporarySecret = 'ourSecretKey'

function sendEmail(email)
{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    
    const token = jwt.sign({
        data: 'Token Data'  
    }, temporarySecret, { expiresIn: '10m' }  
    );   
    
    
    const mailConfigurations = {
      
        // It should be a string of sender/server email
        from: process.env.GMAIL_USERNAME,
      
        to: email,
      
        // Subject of Email
        subject: 'Email Verification',
        // This would be the text of email body
        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               http://localhost:3000/verify?email=${email}&token=${token} 
               Thanks`
    };
    
    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });
}

function verifyEmailToken(token)
{
    try
    {
        let valid = jwt.verify(token, temporarySecret)
        if(valid)
        {
            console.log(valid)
            return {success: true, token: valid}
        }
        else
        {
            return {success: false}
        }
    }
    catch(e)
    {
        return {success: false}
    }
    
}

module.exports = {sendEmail, verifyEmailToken}