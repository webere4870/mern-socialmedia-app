function notification(from, message, time)
{
    console.log(from , message,time)
    return {from: from, message: message, time: time}
}

module.exports = notification