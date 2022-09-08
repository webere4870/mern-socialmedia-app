import React from 'react'
import Nav from './Nav'
import UserContext from './Context'
import {useNavigate} from 'react-router-dom'

export default function Profile(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let [profile, setProfile] = React.useState({})
    console.log(user)
    let navigate = useNavigate()
    React.useEffect(()=>
    {
        if(!user)
        {   
            navigate("/login")
        }
        (async function()
        {
            let userProfile = await fetch("http://localhost:5000/profile",{headers: {'x-access-token': user.jwt}})
            let json = await userProfile.json()
            console.log(json)
            setProfile((prev)=>
            {
                return json.user
            })
        })()
    }, [])
    return (
        <div>
            <Nav/>
            <h1>Hello, {profile.name}</h1>
        </div>
    )
}