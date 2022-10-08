let mongoose = require('mongoose')
require('dotenv').config()
class Database
{
    constructor()
    {
        this.connect()
    }
    connect()
    {
        mongoose.connect(process.env.MONGO_URI, {dbName: "SocialApp"})
    }
};

module.exports = new Database()