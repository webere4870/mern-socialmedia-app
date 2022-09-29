import React from 'react'
import Fetch from './../utils/fetch'
import UserContext from './Context'

export default function MessageList(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let {socket, threadList} = props
    function changeRooms(evt, newEmail)
    {
        
        props.setCurrentRoom((prev)=>
        {
            return [newEmail, user?.email].sort()[0] + [newEmail, user.email].sort()[1]
        })
        
        props.toggleChatList((prev)=>!prev)
        props.setCurrentMessageUser((prev)=>newEmail)
    }

    console.log(threadList)



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
        return <div key={temp.email} className='thread' onClick={(evt)=>changeRooms(evt, temp.email)}>
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