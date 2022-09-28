import React from 'react'
import './../Chat.css'
import io from 'socket.io-client'
import UserContext from './Context';
import SocketContext from './SocketContext'
import ChatList from './ChatList'
import Fetch from './../utils/fetch'
import Message from './Message'
import MessageList from './MessageList';


export default function ChatBox(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let [currentMessageUser, setCurrentMessageUser] = React.useState(props.profile._id)
    const [inputState, setInputState] = React.useState({message: ""});
    let [socket, setSocket] = React.useContext(SocketContext)
    const [currentRoom, setCurrentRoom] = React.useState([props?.profile?._id, user?.email].sort()[0] + [props?.profile?._id, user.email].sort()[1])
    console.log(inputState)
    let [toggleChatList, setToggleChatList] = React.useState(false)
    let [messageList, setMessageList] = React.useState([])
    let [previousRoom, setPreviousRoom] = React.useState("")
    console.log(props.profile)
    let messageArray = messageList.map((temp)=>
    {
      return <Message key={temp.id} message={temp} setCurrentRoom={setCurrentRoom}/>
    })

    console.log("CMU",currentMessageUser)
    React.useEffect(()=>
    {
        socket = io("http://localhost:5000", {
            withCredentials: true,
            extraHeaders: {
            "my-custom-header": "abcd"
            }
        })
        socket.on("connection", ()=>
        {
            console.log("Connected!")
        })
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
            socket.removeAllListeners("roomMessage")
          };
    }, [])
    React.useEffect(()=>
    {
      if(previousRoom)
      {
        socket.emit("leaveRoom", previousRoom, currentRoom)
      }
      else
      {
        socket.emit("joinRoom", currentRoom)
      }
      
      console.log("howdy", user)
      Fetch("messages/"+currentRoom, {method: "GET", headers: {"x-access-token": user.jwt}}).then((response)=>
      {
        console.log("Messages: ", response)
        setMessageList(response.messages)
      })
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong');
        socket.removeAllListeners("roomMessage")
      };
    }, [currentRoom])

    React.useEffect(()=>
    {
      socket.on("roomMessage", (messageObject)=>
      {
        setMessageList((prev)=>
        {
          return [...prev, messageObject]
        })
      })
      return () => {
        socket.off('connect');
        socket.off("roomMessage")
        socket.off('disconnect');
        socket.off('pong');
        socket.emit("leaveRoom", {room: currentRoom})
        socket.removeAllListeners("roomMessage")
      };
  }, [currentRoom])

    function submitForm(evt)
    {
      console.log("CR", currentRoom)
        let obj = {to: currentMessageUser, from: user.email, message: inputState.message, date: new Date().toLocaleString(), room: currentRoom}
        socket.emit("roomMessage", obj)
    }   
    function changeForm(evt)
    {
        let dummy = evt?.currentTarget?.value
        setInputState((prev)=>
        {
            return {...prev, "message": dummy}
        })
    }

    return(<div id='fullChat'>
      <h3>Inbox</h3>
      <div className="rowFlex">
        <div className="search">
      <input type="text" name="search" className="round" />
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-search corner" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg>
    </div>
      </div>
      {!toggleChatList && <MessageList setCurrentRoom={setCurrentRoom} socket={socket} toggleChatList={setToggleChatList} setCurrentMessageUser={setCurrentMessageUser} currentRoom={currentRoom} previousRoom={previousRoom}/>}
      {toggleChatList && messageArray}
     

    </div>)
}
