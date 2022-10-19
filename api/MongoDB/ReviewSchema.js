const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    guest: String,
    host: String,
    comment: String,
    hospitality: Number, 
    cleanliness: Number, 
    communication: Number, 
    location: Number,
    property: String,
    about: String,
    by: String
})

module.exports = mongoose.model("Reviews", schema)