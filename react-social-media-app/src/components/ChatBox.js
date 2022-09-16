import React from 'react'
import './../Chat.css'
import io from 'socket.io-client'
import UserContext from './Context';


export default function ChatBox(props)
{
    const [isConnected, setIsConnected] = React.useState(false);
    const [inputState, setInputState] = React.useState({message: ""});
    let [user, setUser] = React.useContext(UserContext)
    let socket
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
        <div className="chatContainer">
    <div className="chatbox">
      <div className="top-bar">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
        </svg>
        <div className="avatar"><p>V</p></div>
        <div className="name">Voldemort</div>
        <div className="icons">
          <i className="fas fa-phone"></i>
          <i className="fas fa-video"></i>
        </div>
        <div className="menu">
          <div className="dots"></div>
        </div>
      </div>
      <div className="middle">
        <div className="voldemort">
          <div className="incoming">
            <div className="bubble">Hey, Father's Day is coming up..</div>
            <div className="bubble">What are you getting.. Oh, oops sorry dude.</div>
          </div>
          <div className="outgoing">
            <div className="bubble lower">Nah, it's cool.</div>
            <div className="bubble">Well you should get your Dad a cologne. Here smell it. Oh wait! ...</div>
          </div>
          <div className="typing">
            <div className="bubble">
              <div className="ellipsis one"></div>
              <div className="ellipsis two"></div>
              <div className="ellipsis three"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-bar">
        <div className="chat">
          <input id='input' value={inputState.message} type="text" placeholder="Type a message..." onChange={changeForm} />
          <button id='button' type="submit" onClick={submitForm}>Send</button>
        </div>
      </div>
    </div>

  </div>
    </div>)
}
