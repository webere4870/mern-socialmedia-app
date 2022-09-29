import React from 'react'
import Fetch from './../utils/fetch'
import UserContext from './Context'

export default function MessageList(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let [unreadThreads, setUnreadThreads] = React.useState([])
    let {socket, threadList} = props
    function changeRooms(evt, newEmail)
    {

        Fetch("deleteUnread", {method: "POST", headers: {"x-access-token": user.jwt, "Content-Type": "application/json"}, body: JSON.stringify({delete: newEmail})}).then((response)=>
        {
            console.log(response)
        })
        
        props.setCurrentRoom((prev)=>
        {
            return [newEmail, user?.email].sort()[0] + [newEmail, user.email].sort()[1]
        })
        
        props.toggleChatList((prev)=>!prev)
        props.setCurrentMessageUser((prev)=>newEmail)
    }

    React.useEffect(()=>
    {
        Fetch("unread", {method: "GET", headers: {"x-access-token": user?.jwt}}).then((response)=>
        {
            setUnreadThreads([...response?.unread])
        })
    },[])


    let threads = threadList.map((temp)=>
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
        console.log(isUnread)
        return <div key={temp.email} className='thread' onClick={(evt)=>changeRooms(evt, temp.email)}>
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