let mongoose = require('mongoose')
let ChatSchema = new mongoose.Schema({
    room: String,
    to: String,
    from: String,
    date: String,
    message: String
})

module.exports = mongoose.model("ReactChat", ChatSchema)