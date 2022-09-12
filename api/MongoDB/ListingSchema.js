let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    address: String,
    city: String,
    state: String,
    ZIP: Number,
    pictures: Array
})

module.exports = mongoose.model("ListingSchema", schema)