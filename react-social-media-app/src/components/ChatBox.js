import React from 'react'
import './../Chat.css'
import io from 'socket.io-client'
import UserContext from './Context';
import SocketContext from './SocketContext'
import Fetch from './../utils/fetch'
import Message from './Message'
import MessageList from './MessageList';
import {useAuth0} from '@auth0/auth0-react'
import AuthFetch from '../utils/authFetch';

export default function ChatBox(props)
{
    let profile = props?.profile
    let [currentMessageUser, setCurrentMessageUser] = React.useState(profile? profile: null)
    const {user, getAccessTokenSilently} = useAuth0()
    const [inputState, setInputState] = React.useState({message: ""});
    let [socket, setSocket] = React.useContext(SocketContext)
    const [currentRoom, setCurrentRoom] = React.useState(profile ? [user.email, profile._id].sort()[0] + [user.email, profile._id].sort()[1] : user.email)
    let [toggleChatList, setToggleChatList] = React.useState(currentRoom != user.email)
    let [messageList, setMessageList] = React.useState([])
    let [bufferList, setBufferList] = React.useState([])
    let [threadList, setThreadList] = React.useState([])
    let [previousRoom, setPreviousRoom] = React.useState("")
    let [searchState, setSearchState] = React.useState("")
    let messageArray = messageList?.map((temp)=>
    {
      return <Message key={temp.id} message={temp} setCurrentRoom={setCurrentRoom}/>
    })

    console.log(currentRoom)

    function changeInput(evt)
    {
      let newValue = evt.currentTarget.value
      setInputState((prev)=>
      {
        return {...prev, "message": newValue}
      })
    }

    console.log(currentRoom)

    function newSearchState(evt)
    {
      let newVal = evt.currentTarget.value
      console.log(newVal)
      if(newVal!="")
      {
        setThreadList((prev)=>
        {
          let newArr = prev?.filter((temp)=>temp?._id?.includes(newVal))
          console.log(newArr)
          return newArr
        })
      }
      if(newVal=="")
      {
        console.log("here")
        setThreadList((prev)=>
        {
          return [...bufferList]
        })
        
      }
      setSearchState(newVal)
    }

    console.log("Buffer", bufferList, "Main", threadList)
    React.useEffect(()=>
    {
        AuthFetch("messageThreads", {method: "GET", headers:{"x-access-token": user.jwt}}, getAccessTokenSilently).then((response)=>
        {
            setThreadList((prev)=>
            {
                return response.threads
            })
            setBufferList((prev)=>
            {
                return response.threads
            })
        })
    }, [currentRoom])

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
      
      AuthFetch("messages/"+currentRoom, {method: "GET", headers: {"x-access-token": user.jwt}}, getAccessTokenSilently).then((response)=>
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

    return(
    <div id='fullChat'>
      <div id='inbox'>
      {toggleChatList && <svg onClick={()=>setToggleChatList((prev)=>!prev)} xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="black" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
    </svg>}
        <h3>Inbox</h3>
      </div>
      {!toggleChatList && <div className="rowFlex">
        <div className="search">
      <input type="text" name="search" className="round" value={searchState} onChange={newSearchState} />
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-search corner" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg>
    </div>
      </div>}
      {!toggleChatList && <MessageList setCurrentRoom={setCurrentRoom} socket={socket} toggleChatList={setToggleChatList} setCurrentMessageUser={setCurrentMessageUser} threadList={threadList} currentRoom={currentRoom} previousRoom={previousRoom}/>}
      {toggleChatList && 
      <div id="messageBlock">
        {messageArray}
      </div>}
      {toggleChatList && 
      <div id='messageTextArea'>
        <div id="innerMessageText">
          <input type="text" id="trueText" value={inputState.message} onChange={changeInput}/>
          <div id='topG' onClick={submitForm}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
          </svg>
          </div>
        </div>
      </div>}
    </div>)
}
