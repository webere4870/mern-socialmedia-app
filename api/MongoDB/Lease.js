let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    property: String,
    tenant: String,
    landlord: String,
    price: Number,
    startDate: Date,
    endDate: Date,
    address: String,
    paymentPlan: String,
    paymentDates: Array,
    active: Boolean
})

module.exports = mongoose.model("Lease", schema)