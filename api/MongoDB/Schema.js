let mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    _id: String,
    hash: String,
    salt: String,
    name: String,
    picture: String,
    provider: String,
    active: Boolean,
    notifications: Array,
    bio: String,
    city: String,
    state: String,
    reviews: Array,
    overall: Number,
    saved: Array,
    unread: Array,
    active: Boolean,
    stripe: String,
    subscribers: Array,
    subscriptions: Array
})

module.exports = mongoose.model("UserSchema", UserSchema)