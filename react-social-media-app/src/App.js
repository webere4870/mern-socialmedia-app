import './App.css';
import React from 'react'
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import Profile from './components/Profile'
import Search from './components/Search';
import Listing from './components/Listing'
import User from './components/User';
import {Routes, Route, Link, BrowserRouter as Router} from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';
import {LoadScript} from '@react-google-maps/api'
import UserContext from './components/Context';
import SocketContext from './components/SocketContext';
import ChatBox from './components/ChatBox';
import io from 'socket.io-client'
import Toast from './components/Toast'
import {v4} from 'uuid'

function App() {
  let [user, setUser] = React.useState()
  let [socket, setSocket] = React.useState()
  let [toastList, setToastList] = React.useState([])
  let [chatBoxOpen, setChatBoxOpen] = React.useState(false)

  React.useEffect(()=>
    {
        let newSocket = null
        newSocket = io("http://localhost:5000", {
            withCredentials: true,
            extraHeaders: {
            "my-custom-header": "abcd"
            }
        })
        newSocket.on("connection", ()=>
        {
            console.log("Connected!")
            newSocket.on("toastMessage", (messageObject)=>
            {
              setToastList((prev)=>
              {
                return [...prev, messageObject]
              })
            })
        })
        setSocket((prev)=>
        {
          return newSocket
        })

        return () => {
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.off('pong');
          };
    }, [])

  let toasts = toastList.map((temp)=>
  {
    let keyer = v4()
    return <Toast key={keyer} myKey={keyer} messageObject={temp} setToastList={setToastList}/>
  })

  return (
    <div id='rooter'>
      {toasts &&
      <div id="toastBar">
      {toasts}
    </div>}
    <SocketContext.Provider value={[socket, setSocket]}>
      <LoadScript
       googleMapsApiKey='AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE'>
      <UserContext.Provider value={[user, setUser]}>
        <div id='innerRooter'>
        {user && chatBoxOpen && <ChatBox profile={user} setChatBoxOpen={setChatBoxOpen}/>}
      {user && <div id='messageBubble' onClick={()=>setChatBoxOpen((prev)=>!prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
        <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
            </div>}
        </div>
        <CookiesProvider>
          <Router>
            <Routes>
              <Route index element={<Home />} />
              {user && <Route path="home" element={<Home />}/>}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register/>}/>
              {user && <Route path="profile" element={<Profile/>}/>}
              <Route path="search" element={<Search/>}/>
              <Route path="user/:user" element={<User/>}/>
              <Route path="*" element={<Login />} />
              {user && <Route path="listing" element={<Listing/>}/>}
            </Routes>
          </Router>
        </CookiesProvider>
      </UserContext.Provider>
    </LoadScript>
    </SocketContext.Provider>
    </div>
  );
}

export default App;
