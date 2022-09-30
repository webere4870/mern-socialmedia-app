import React from 'react'
import Nav from './Nav'
import {Link} from 'react-router-dom'

export default function Registered()
{
    return (
    <div id='registeredPage'>
        <Nav/>
        <div id='registeredBox'>
            <p>An email has been sent to your inbox for further verification. Please verify the account within the next 15 minutes to start accessing your content!</p>
            <Link to={"/login"}><button className='coolBtn'>Exit</button></Link>
        </div>
    </div>)
}