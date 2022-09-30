let mongoose = require('mongoose')
let ChatSchema = require('./../MongoDB/ChatSchema')
let UserSchema = require('./../MongoDB/Schema')
let NotificationBuilder = require('./../utils/CreateNotification')


module.exports = (app, io)=>
{
    let roomsCounter = {}
    io.on("connection", (socket)=>
    {
        socket.prevRoom = ""
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
            let atCount =0
            console.log("socker", socket.prevRoom)
            for(let temp of socket.prevRoom)
            {
                console.log(temp)
                if(temp == "@")
                {
                    atCount++
                }
            }
            console.log(atCount)
            if(atCount ==2)
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
            console.log(roomsCounter)
        })
        socket.on("roomMessage", async (messageObject)=>
        {
            
            let newItem = await ChatSchema.create(messageObject)
            messageObject.id = newItem._id
            await newItem.save()
            console.log(roomsCounter)
            if(roomsCounter[messageObject.room] < 2)
            {
                let temp = await UserSchema.updateOne({_id: messageObject.to}, {$push: {notifications: NotificationBuilder(messageObject.from, "sent a message", messageObject.date)}}, {$push: {unread: messageObject.from}, $push: {unread: messageObject.from} })
                await UserSchema.updateOne({_id: messageObject.to}, {$push: {unread: messageObject.from}})
                io.to(messageObject.to).emit("toastMessage", messageObject)
                io.to(messageObject.to).emit("newUnread", "dummy")
                io.to(messageObject.room).emit("roomMessage", messageObject)
            }
            else
            {
                io.to(messageObject.room).emit("roomMessage", messageObject)
            }
            
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