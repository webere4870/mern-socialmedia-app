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
import io from 'socket.io-client'

function App() {
  let [user, setUser] = React.useState()
  let [socket, setSocket] = React.useState()

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

  return (
    <SocketContext.Provider value={[socket, setSocket]}>
      <LoadScript
       googleMapsApiKey='AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE'>
      <UserContext.Provider value={[user, setUser]}>
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
  );
}

export default App;
