import React from 'react'
import UserContext from './Context'

export default function Message(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let message = props.message
    return(
    <div>
        
    </div>)
}