import React from 'react'
import {Link} from 'react-router-dom'
import UserContext from './Context'
import Notifications from './Notifications'


export default function Nav()
{
    let [user, setUser] = React.useContext(UserContext)
    let [toggleNotify, setToggleNotify] = React.useState(false)

    return (
    <nav>
        <p><Link to={"/home"}>Home</Link></p>
        <p><Link to={"/search"}>Search</Link></p>
        <p><Link to={"/profile"}>Profile</Link></p>
        <p><Link to={"/listing"}>Listing</Link></p>
        {user?.jwt && <div id='btnRow'><svg xmlns="http://www.w3.org/2000/svg" onClick={()=>setToggleNotify((prev)=>!prev)} width="40" height="40" id='alarmBell' fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg><img src={`https://webere4870.blob.core.windows.net/react-app/${user.email}`} className='profileIcon' alt=""/></div>}
        {!user?.jwt && <div id='btnRow'><button className='btn'><Link to={"/login"}>Login</Link></button><button className='btn'><Link to={"/register"}>Sign Up</Link></button></div>}
        {toggleNotify && <Notifications/>}
    </nav>)
}