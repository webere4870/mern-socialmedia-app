import React from 'react'
import UserContext from './Context'

export default function Message(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let message = props.message
    console.log(user)

    if(message.from == user.email)
    {
        return(
        <div className='homeMessage'>
            <p className='homeMessager'>{message.message}</p>
            <img className='messageIcon' src={`https://webere4870.blob.core.windows.net/react-app/${message.from}`} alt="" />
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