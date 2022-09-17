let mongoose = require('mongoose')
let ChatSchema = require('./../MongoDB/ChatSchema')

module.exports = (app, io)=>
{
    io.on("connection", (socket)=>
    {
        console.log(socket.id)
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
        socket.on("roomMessge", (messageObject)=>
        {
            socket.to(messageObject.room).emit("roomMessage", messageObject)
        })
        socket.on("disconnect", ()=>
        {
            console.log(socket + ' has disconnected')
        })
    })
}