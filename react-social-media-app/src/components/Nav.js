import React from 'react'
import {Link} from 'react-router-dom'


export default function Nav()
{
    return (
    <nav>
        <p><Link to={"/home"}>Home</Link></p>
        <p><Link to={"/search"}>Search</Link></p>
        <p><Link to={"/profile"}>Profile</Link></p>
    </nav>)
}