let mongoose = require('mongoose')
let ChatSchema = require('./../MongoDB/ChatSchema')

module.exports = (app, io)=>
{
    let roomsCounter = {}
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
            if(socket?.prevRoom)
            {
                console.log("leaving", socket.prevRoom)
                socket.leave(socket.prevRoom)
                roomsCounter[socket.prevRoom] = roomsCounter[socket.prevRoom] - 1
            }
            console.log(emailRoom + " has joined " + emailRoom)
            socket.join(emailRoom)
            socket.prevRoom = emailRoom
            if(roomsCounter.emailRoom)
            {
                roomsCounter[emailRoom] = roomsCounter[emailRoom] + 1
            }
            else
            {
                roomsCounter[emailRoom] = 1
            }
        })
        socket.on("roomMessage", async (messageObject)=>
        {
            
            let newItem = await ChatSchema.create(messageObject)
            messageObject.id = newItem._id
            await newItem.save()
            io.to(messageObject.room).emit("roomMessage", messageObject)
        })
        socket.on("leaveRoom", (messageObject)=>
        {
            
            socket.leave(messageObject.room)
        })
        socket.on("disconnect", ()=>
        {
            console.log(socket + ' has disconnected')
        })
    })
}