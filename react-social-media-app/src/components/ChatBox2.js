import React from 'react'
import './../Chat.css'
import io from 'socket.io-client'
import UserContext from './Context';
import SocketContext from './SocketContext'
import ChatList from './ChatList'
import Fetch from './../utils/fetch'
import Message from './Message'
import MessageList from './MessageList';
import "./../Chat2.css"
import $ from 'jquery'


export default function ChatBox2(props)
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

    return (<div>
        <h3>Click on Arrow button to see next screen</h3>

<div class="fabs">
<div class="chat is-visible">
  <div class="chat_header">
    <div class="chat_option">
    <div class="header_img">
      <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
      </div>
      <span id="chat_head">Jane Doe</span> <br/> <span class="agent">Agent</span> <span class="online">(Online)</span>
     <span id="chat_fullscreen_loader" class="chat_fullscreen_loader"><i class="fullscreen zmdi zmdi-window-maximize"></i></span>

    </div>

  </div>
  <div class="chat_body chat_login">
      <a id="chat_first_screen" class="fab"><i class="zmdi zmdi-arrow-right"></i></a>
      <p>We make it simple and seamless for businesses and people to talk to each other. Ask us anything</p>
  </div>
  <div id="chat_converse" class="chat_conversion chat_converse">
          <a id="chat_second_screen" class="fab"><i class="zmdi zmdi-arrow-right"></i></a>
    <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
          </div>Hey there! Any question?</span>
    <span class="chat_msg_item chat_msg_item_user">
          Hello!</span>
          <span class="status">20m ago</span>
    <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
          </div>Hey! Would you like to talk sales, support, or anyone?</span>
    <span class="chat_msg_item chat_msg_item_user">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
           <span class="status2">Just now. Not seen yet</span>
  </div>
  <div id="chat_body" class="chat_body">
      <div class="chat_category">
        <a id="chat_third_screen" class="fab"><i class="zmdi zmdi-arrow-right"></i></a>
      <p>What would you like to talk about?</p>
      <ul>
        <li>Tech</li>
        <li class="active">Sales</li>
        <li >Pricing</li>
        <li>other</li>
      </ul>
      </div>

  </div>
  <div id="chat_form" class="chat_converse chat_form">
  <a id="chat_fourth_screen" class="fab"><i class="zmdi zmdi-arrow-right"></i></a>
    <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
          </div>Hey there! Any question?</span>
    <span class="chat_msg_item chat_msg_item_user">
          Hello!</span>
          <span class="status">20m ago</span>
    <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
          </div>Agent typically replies in a few hours. Don't miss their reply.
          <div>
            <br/>
            <form class="get-notified">
                <label for="chat_log_email">Get notified by email</label>
                <input id="chat_log_email" placeholder="Enter your email"/>
                <i class="zmdi zmdi-chevron-right"></i>
            </form>
          </div></span>

      <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
          </div>Send message to agent.
          <div>
            <form class="message_form">
                <input placeholder="Your email"/>
                <input placeholder="Technical issue"/>
                <textarea rows="4" placeholder="Your message"></textarea>
                <button>Send</button> 
            </form>

      </div></span>   
  </div>
    <div id="chat_fullscreen" class="chat_conversion chat_converse">
    <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
          </div>Hey there! Any question?</span>
    <span class="chat_msg_item chat_msg_item_user">
          Hello!</span>
          <div class="status">20m ago</div>
    <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
          </div>Hey! Would you like to talk sales, support, or anyone?</span>
    <span class="chat_msg_item chat_msg_item_user">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
    <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
           </div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span>
    <span class="chat_msg_item chat_msg_item_user">
          Where can I get some?</span>
    <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
             <img src="http://res.cloudinary.com/dqvwa7vpe/image/upload/v1496415051/avatar_ma6vug.jpg"/>
           </div>The standard chuck...</span>
    <span class="chat_msg_item chat_msg_item_user">
          There are many variations of passages of Lorem Ipsum available</span>
          <div class="status2">Just now, Not seen yet</div>
    <span class="chat_msg_item ">
        <ul class="tags">
          <li>Hats</li>
          <li>T-Shirts</li>
          <li>Pants</li>
        </ul>
    </span>
  </div>
  <div class="fab_field">
    <a id="fab_camera" class="fab"><i class="zmdi zmdi-camera"></i></a>
    <a id="fab_send" class="fab"><i class="zmdi zmdi-mail-send"></i></a>
    <textarea id="chatSend" name="chat_message" placeholder="Send a message" class="chat_field chat_message"></textarea>
  </div>
</div>
  <a id="prime" class="fab"><i class="prime zmdi zmdi-comment-outline"></i></a>
</div>
    </div>)

}