import React from 'react'
import Fetch from './../utils/fetch'
import UserContext from './Context'

export default function Notifications(props)
{
    let [notifications, setNotifications] = React.useState([])
    let [user, setUser] = React.useContext(UserContext)

    React.useEffect(()=>
    {
        Fetch("notifications", {method: "GET", headers: {"x-access-token": user.jwt}}).then((response)=>
        {
            console.log("Notify", response)
            setNotifications((prev)=>
            {
                return response.notifications
            })
        })
    }, [])

    let notificationsMap = notifications.map((temp)=>
    {
        return (
        <div className='notification'>
            <img src={`https://webere4870.blob.core.windows.net/react-app/${temp.from}`} className="toastIcon" alt="" />
        <div id='toastBlock'>
            <p>{temp.from}</p>
            <p>{temp.message}</p>
        </div>
        </div>)
    })

    return (
    <div id='notifications'>
        {notificationsMap}
    </div>)
}