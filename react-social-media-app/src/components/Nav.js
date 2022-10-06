import React from 'react'
import {Link} from 'react-router-dom'
import UserContext from './Context'
import Notifications from './Notifications'
import SearchBar from './SearchBar'
import ChatBox from './ChatBox'
import SocketContext from './SocketContext'
import Fetch from './../utils/fetch'
import { useAuth0 } from '@auth0/auth0-react'



export default function Nav()
{
    const { loginWithRedirect, logout, isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();
    var options = { method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"oAlaT7QjkOKtGiWB8ymPfuZlJTXhMhtx","client_secret":"b1IDEMweuOeaJiuQ9F2fotUTX9TP5pZ8-hvqkkwnJBnr5HYyfBsZdeeUOBAgrko_","audience":"http://localhost:5000","grant_type":"client_credentials"}' };



    React.useEffect(()=>
    {
        getAccessTokenSilently().then((token)=>
        {
            console.log(token)
            fetch("https://dev-3vss267m.us.auth0.com/oauth/token", options).then((res)=>
            {
                res.json().then((response)=>
                {
                    console.log(response)
                })
            })
            
        })
    }, [])

    let [toggleNotify, setToggleNotify] = React.useState(false)
    let [chatBoxOpen, setChatBoxOpen] = React.useState(false)
    let [socket, setSocket] = React.useContext(SocketContext)
    let [inboxNotification, setInboxNotification] = React.useState(false)

    React.useEffect(()=>
    {
        Fetch("unread", {method: "GET", headers: {"x-access-token": user?.jwt}}).then((response)=>
        {
            if(response?.unread?.length > 0)
            {
                setInboxNotification(true)
            }
        })
    }, [chatBoxOpen])

    React.useEffect(()=>
    {
        socket.on("newUnread", ()=>
        {
            setInboxNotification(true)
        })
        return ()=>
        {
            socket.off("newUnread")
        }
    }, [])

    console.log(user)
    if(isLoading)
    {
        return <p>Loading</p>
    }

    return (
    <nav>
        <p><Link to={"/home"}>Home</Link></p>
        <p><Link to={"/profile"}>Profile</Link></p>
        <p><Link to={"/listing"}>Listing</Link></p>
        <SearchBar/>
        {user && chatBoxOpen && <ChatBox profile={user} setChatBoxOpen={setChatBoxOpen}/>}
        {user && <div id='btnRow'><span id='inboxSpan'>{inboxNotification && <div id="inboxBubble"></div>}<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" onClick={()=>setChatBoxOpen((prev)=>!prev)} fill="currentColor" id='inboxSVG' class="bi bi-inbox-fill" viewBox="0 0 16 16">
        <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
        </svg></span><svg xmlns="http://www.w3.org/2000/svg" onClick={()=>setToggleNotify((prev)=>!prev)} width="40" height="40" id='alarmBell' fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg><img src={`https://webere4870.blob.core.windows.net/react-app/${user.email}`} className='profileIcon' alt=""/></div>}
        { <div id='btnRow'><button
      className="btn btn-primary btn-block"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button><button
      className="btn btn-primary btn-block"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button><button className='btn'><Link to={"/login"}>Login</Link></button><button onClick={()=>logout({returnTo: window.location.origin})}>Logout</button><button className='btn'><Link to={"/register"}>Sign Up</Link></button></div>
    }

    {isAuthenticated && <p>{user?.email}</p>}
        {toggleNotify && <Notifications/>}
    </nav>)
}