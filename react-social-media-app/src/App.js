import './App.css';
import React from 'react'
import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register'
import {Routes, Route, Link, BrowserRouter as Router} from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';
import UserContext from './components/Context';


function App() {
  let [user, setUser] = React.useState("")
  return (
      <UserContext.Provider value={{user, setUser}}>
        <CookiesProvider>
          <Router>
            <Routes>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register/>}/>
              <Route path="*" element={<Home />} />
            </Routes>
          </Router>
        </CookiesProvider>
      </UserContext.Provider>
  );
}

export default App;
