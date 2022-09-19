let mongoose = require('mongoose')
let ChatSchema = require('./../MongoDB/ChatSchema')

module.exports = (app, io)=>
{
    io.on("connection", (socket)=>
    {
        socket.emit("connection")
        socket.on("message", (msg)=>
        {
            console.log(msg)
        })
        socket.on("chatbox", (msg)=>
        {
            console.log(msg)
        })
        socket.on("joinRoom", (emailRoom)=>
        {
            console.log(emailRoom + " has joined " + emailRoom)
            socket.join(emailRoom)
        })
        socket.on("roomMessage", async (messageObject)=>
        {
            console.log(messageObject)
            let newItem = await ChatSchema.create(messageObject)
            messageObject.id = newItem._id
            await newItem.save()
            io.to(messageObject.room).emit("roomMessage", messageObject)
        })
        socket.on("disconnect", ()=>
        {
            console.log(socket + ' has disconnected')
        })
    })
}