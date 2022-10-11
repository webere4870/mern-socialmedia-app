import React from 'react'
import UserContext from './Context'
import { useAuth0 } from '@auth0/auth0-react'

export default function Message(props)
{
    let message = props.message
    const {user} = useAuth0()

    if(message.from == user.email)
    {
        return(
        <div className='homeMessage'>
            <p className='homeMessager'>{message.message}</p>
            <img className='messageIcon' src={`${user.picture}`} alt="" />
        </div>)
    }
    else
    {
        return(
        <div className='awayMessage'>
            <img className='messageIcon' src={`https://webere4870.blob.core.windows.net/react-app/${message.from}`} alt="" />
            <p className='awayMessager'>{message.message}</p>
        </div>)
    }
    
}