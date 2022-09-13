let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    address: String,
    city: String,
    state: String,
    ZIP: Number,
    pictures: Array,
    price: Number, 
    owner: String,
    lat: Number,
    lng: Number
})

module.exports = mongoose.model("ListingSchema", schema)