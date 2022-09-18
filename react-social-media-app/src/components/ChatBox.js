import React from 'react'
import './../Chat.css'
import io from 'socket.io-client'
import UserContext from './Context';
import SocketContext from './SocketContext'
import ChatList from './ChatList'
import Fetch from './../utils/fetch'
import Message from './Message'


export default function ChatBox(props)
{
    let [user, setUser] = React.useContext(UserContext)
    const [isConnected, setIsConnected] = React.useState(false);
    const [inputState, setInputState] = React.useState({message: ""});
    let [socket, setSocket] = React.useContext(SocketContext)
    const [rooms, setRooms] = React.useState([])
    const [currentRoom, setCurrentRoom] = React.useState([props.profile._id, user.email].sort()[0] + [props.profile._id, user.email].sort()[1])
    console.log(inputState)
    let [toggleChatList, setToggleChatList] = React.useState(false)
    let [messageList, setMessageList] = React.useState([])

    let messageArray = messageList.map((temp)=>
    {
      return <Message message={temp}/>
    })

    React.useEffect(()=>
    {
      socket.emit("joinRoom", currentRoom)
      console.log("howdy", user)
      Fetch("messages/"+currentRoom, {method: "GET", headers: {"x-access-token": user.jwt}}).then((response)=>
      {
        console.log("Messages: ", response)
        setMessageList(response.messages)
      })
    }, [])

    function submitForm(evt)
    {
        let obj = {to: props.profile._id, from: user.email, message: inputState.message, date: new Date().toLocaleString(), room: currentRoom}
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
          
    <div class="--dark-theme" id="chat">
    <svg id="xBtn" onClick={()=>props.setChatBoxOpen((prev)=>!prev)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
    <div class="chat__conversation-board">
      {messageArray}
    </div>
    <div class="chat__conversation-panel">
        <div class="chat__conversation-panel__container"><button class="chat__conversation-panel__button panel-item btn-icon add-file-button"><svg class="feather feather-plus sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg></button><button class="chat__conversation-panel__button panel-item btn-icon emoji-button"><svg class="feather feather-smile sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg></button><input class="chat__conversation-panel__input panel-item" value={inputState.message} type="text" placeholder="Type a message..." onChange={changeForm}  /><button  onClick={submitForm} class="chat__conversation-panel__button panel-item btn-icon send-message-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1036">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg></button></div>
    </div>
</div>
          {/* {!toggleChatList && <div id='wrapper'><div id="topBar">
            <div className='rowFlex' onMouseOver={{cursor: "pointer"}} onClick={()=>setToggleChatList((prev)=>!prev)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
            <h5>Inbox</h5>
            </div>
          </div>
          <div id="chatSection">

          </div>
          <textarea id='input' value={inputState.message} type="text" placeholder="Type a message..." onChange={changeForm} ></textarea>
          <button id='button' type="submit" onClick={submitForm}>Send</button></div>} */}
    </div>)
}
