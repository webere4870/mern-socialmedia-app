import './App.css';
import React from 'react'
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import Profile from './components/Profile'
import {Routes, Route, Link, BrowserRouter as Router} from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';
import UserContext from './components/Context';


function App() {
  let [user, setUser] = React.useState()
  return (
      <UserContext.Provider value={[user, setUser]}>
        <CookiesProvider>
          <Router>
            <Routes>
              <Route index element={<Home />} />
              {user && <Route path="home" element={<Home />}/>}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register/>}/>
              {user && <Route path="profile" element={<Profile/>}/>}
              <Route path="*" element={<Login />} />
            </Routes>
          </Router>
        </CookiesProvider>
      </UserContext.Provider>
  );
}

export default App;
