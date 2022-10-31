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
    
    let newEvents = []
    let nextMonthDate = new Date(currentDate?.toLocaleDateString())
    console.log(currentDate.getMonth())
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
    nextMonthDate.setDate(1)
    events?.map((event, index)=>
    {
        for(let temp of event?.paymentDates)
        {
            if(new Date(temp).getMonth() < nextMonthDate?.getMonth()-1)
            {
                newEvents.push({...event, eventDate: new Date(temp)})
            }
        }
    })

    let sortedEvents = newEvents.sort(
        (event1, event2) => (event1?.eventDate < event2?.eventDate) ? 1 : (event1?.eventDate > event2?.eventDate)  ? -1 : 0);

    let eventMap = sortedEvents?.map((temp)=>
    {
        return (
        <div>

        </div>)
    })

    return (
    <div id="eventsList">
        <div className="colFlex">
            <h1 id="blockNumber">{currentDate?.getDate()}</h1>
            <h1>{currentDate?.getMonth()}</h1>
        </div>
    </div>)
}