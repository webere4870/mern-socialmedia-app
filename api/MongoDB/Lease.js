let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    property: String,
    tenant: String,
    landlord: String,
    price: Number,
    startDate: Date,
    endDate: Date,
    active: Boolean
})

module.exports = mongoose.model("Lease", schema)