import React from 'react'
import Fetch from './../utils/fetch'
import UserContext from './Context'

export default function MessageList(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let [threadList, setThreadList] = React.useState([])

    function changeRooms(evt, newEmail)
    {
        props.setCurrentRoom((prev)=>
        {
            return [newEmail, user?.email].sort()[0] + [newEmail, user.email].sort()[1]
        })
        props.toggleChatList((prev)=>!prev)
        props.setCurrentMessageUser((prev)=>newEmail)
    }

    React.useEffect(()=>
    {
        Fetch("messageThreads", {method: "GET", headers:{"x-access-token": user.jwt}}).then((response)=>
        {
            setThreadList((prev)=>
            {
                return response.threads
            })
        })
    }, [])

    let threads = threadList.map((temp)=>
    {
        return <div key={temp.email} className='thread' onClick={(evt)=>changeRooms(evt, temp.email)}>
            <img src={`https://webere4870.blob.core.windows.net/react-app/${temp.email}`} alt="" />
            <p>{temp.lastMessage}</p>
            <p>{temp.date}</p>
        </div>
    })

    return (
    <div id="threadBlocks">
        {threads}
    </div>)
}