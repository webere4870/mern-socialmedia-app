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
    })
}