import React from 'react'
import './../Chat.css'
import io from 'socket.io-client'
import UserContext from './Context';
import SocketContext from './SocketContext'
import ChatList from './ChatList'


export default function ChatBox(props)
{
    const [isConnected, setIsConnected] = React.useState(false);
    const [inputState, setInputState] = React.useState({message: ""});
    let [socket, setSocket] = React.useContext(SocketContext)
    const [rooms, setRooms] = React.useState([])
    const [currentRoom, setCurrentRoom] = React.useState()
    let [user, setUser] = React.useContext(UserContext)
    let [toggleChatList, setToggleChatList] = React.useState(false)

    React.useEffect(()=>
    {
      socket.emit("chatbox", "ya boi is in town")
    }, [])

    function submitForm(evt)
    {
        let obj = {to: props.profile._id, from: user.email, message: inputState.message}
        socket?.emit("message", obj)
    }   
    function changeForm(evt)
    {
        let dummy = evt?.currentTarget?.value
        setInputState((prev)=>
        {
            return {...prev, "message": dummy}
        })
    }
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
          };
    }, [])

    return(<div id='fullChat'>
          {toggleChatList && <h1>Howdy</h1>}
          {!toggleChatList && <div id='wrapper'><div id="topBar">
            <div className='rowFlex' onMouseOver={{cursor: "pointer"}} onClick={()=>setToggleChatList((prev)=>!prev)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
            <h5>Inbox</h5>
            </div>
            <svg style={{marginLeft: "auto"}} onClick={()=>props.setChatBoxOpen((prev)=>!prev)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
          <div id="chatSection">

          </div>
          <textarea id='input' value={inputState.message} type="text" placeholder="Type a message..." onChange={changeForm} ></textarea>
          <button id='button' type="submit" onClick={submitForm}>Send</button></div>}
    </div>)
}
