import React from 'react'
import Nav from './Nav'
import UserContext from './Context'
import {useNavigate} from 'react-router-dom'

export default function Home()
{
    let [user, setUser] = React.useContext(UserContext)
    console.log(user)
    let navigate = useNavigate()
    React.useEffect(()=>
    {
        if(!user)
        {   
            navigate("/login")
        }
    }, [])
    return(
    <div className='main'>
        <Nav/>
    </div>)
}