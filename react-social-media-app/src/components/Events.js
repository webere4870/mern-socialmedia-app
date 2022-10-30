import React from "react";
import DateContext from "./DateContext";
import AuthFetch from "../utils/authFetch";
import { useAuth0 } from "@auth0/auth0-react";

export default function Events(props)
{
    let [events, setEvents] = React.useState()
    let [amITheLandlord, setAmITheLandlord] = React.useState(false)
    let [currentDate, setCurrentDate] = React.useContext(DateContext)
    let {getAccessTokenSilently} = useAuth0()

    React.useEffect(()=>
    {
        AuthFetch("eventList", {method: "POST", headers: {"Content-Type": "application/json", body: JSON.stringify({amITheLandlord: amITheLandlord, date: currentDate} )}},getAccessTokenSilently).then((response)=>
        {
            setEvents(response.events)
        })
    }, [currentDate])
    
    let sortedEvents = events?.map((event)=>
    {
        
    })

    return (
    <div id="eventsList" className="tile">

    </div>)
}