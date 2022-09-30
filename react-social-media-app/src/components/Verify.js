import React from 'react'
import Nav from './Nav'
import {Link} from 'react-router-dom'
import Fetch from './../utils/fetch'
import QueryString from 'query-string'

export default function Verify()
{

    let [isVerified, setIsVerified] = React.useState("pending")
    let {email, token} = QueryString.parse(window.location.search)

    console.log(email, token)

    React.useEffect(()=>
    {
        Fetch("verifyAccount", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({token: token, email: email})}).then((response)=>
        {
            if(response.success)
            {
                setIsVerified("accepted")
            }
            else
            {
                setIsVerified("rejected")
            }
        })
    }, [])
    return (
    <div id='registeredPage'>
        <Nav/>
        <div id='registeredBox'>
            {isVerified == "pending" && <p>Loading....</p>}
            {isVerified == "rejected" && <div className="colFlex"><p>Unable to verify. Either time expired or an unexpected error occurred. Please reregister your account.</p><Link to={"/register"}><button className='coolBtn'>Register</button></Link></div>}
            {isVerified == "accepted" && <div className="colFlex"><p>Your account has been registered successfully!</p><Link to={"/login"}><button className='coolBtn'>Login</button></Link></div>}
        </div>
    </div>)
}