import React from 'react'
import {Link} from 'react-router-dom'


export default function Nav()
{
    return (
    <nav>
        <p><Link to={"/home"}>Home</Link></p>
        <p><Link to={"/login"}>Login</Link></p>
        <p><Link to={"/profile"}>Profile</Link></p>
    </nav>)
}