import React from 'react'
import Fetch from './../utils/fetch'
import AuthFetch from '../utils/authFetch'
import UserContext from './Context'
import { useAuth0 } from '@auth0/auth0-react'

export default function MessageList(props)
{
    const {user, getAccessTokenSilently} = useAuth0()
    let [unreadThreads, setUnreadThreads] = React.useState([])
    let {socket, threadList} = props
    function changeRooms(evt, newEmail)
    {

        AuthFetch("deleteUnread", {method: "POST", headers: {"x-access-token": user.jwt, "Content-Type": "application/json"}, body: JSON.stringify({delete: newEmail})}, getAccessTokenSilently).then((response)=>
        {
            console.log(response)
        })
        
        props.setCurrentRoom((prev)=>
        {
            console.log(newEmail)
            console.log([newEmail, user?.email].sort()[0] + [newEmail, user.email].sort()[1])
            return [newEmail, user?.email].sort()[0] + [newEmail, user.email].sort()[1]
        })
        
        props.toggleChatList((prev)=>!prev)
        props.setCurrentMessageUser((prev)=>newEmail)
    }

    React.useEffect(()=>
    {
        AuthFetch("unread", {method: "GET", headers: {"x-access-token": user?.jwt}}, getAccessTokenSilently).then((response)=>
        {
            console.log(response)
            setUnreadThreads([...response?.unread])
        })
    },[])


    let threads = threadList?.map((temp)=>
    {
        let newStr = ""
        for(let counter =0; counter < 10; counter++)
        {
            if(counter == temp.message.length)
            {
                break
            }
            newStr += temp.message[counter]
        }
        let isUnread = unreadThreads?.find((temper)=>temper == temp?.email)
        console.log(temp)
        return <div key={temp._id} className='thread' onClick={(evt)=>changeRooms(evt, temp.to == user.email ? temp.from : temp.to)}>
            {isUnread && <div className='threadBubble'></div>}
            <img src={`https://webere4870.blob.core.windows.net/react-app/${temp.email}`} alt="" />
            <div className='innerThread'>
            <p>{temp.from}</p>
            <p style={{color: "lightgrey"}}>{newStr}</p>
            </div>
        </div>
    })

    return (
    <div id="threadBlocks">
        {threads}
    </div>)
}