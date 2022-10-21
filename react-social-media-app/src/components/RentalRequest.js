import React from 'react'
import Fetch from './../utils/fetch'
import AuthFetch from '../utils/authFetch'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function RentalRequest(props)
{

    let {price, owner, } = props?.listing
    let [propOwner, setPropOwner] = React.useState()
    let {getAccessTokenSilently} = useAuth0()
    let [requestForm, setRequest] = React.useState({startDate: "", endDate: "", price: '0'})

    function buildRequest(evt)
    {
        AuthFetch("")
    }

    React.useEffect(()=>
    {
        Fetch("getUser/"+owner, {method: "GET"}).then((response)=>
        {
            setPropOwner(response.profile)
        })
    }, [])

    return (
    <div id='bookingForm'>
        <div className='rowFlex' style={{width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
            <h4>${price} / month</h4>
            <Link to={"#idk"} style={{marginLeft: "auto"}}><p className='link' style={{marginLeft: "auto"}}>10 reviews</p></Link>
        </div>
        <div className='rowFlex' style={{gap: "10px"}}>
            <img src={`https://webere4870.blob.core.windows.net/react-app/${owner}`} className="profileIcon" alt="" />
            {propOwner && <p>{propOwner?.name}</p>}
        </div>
        <label htmlFor="askingPrice">Request Price</label>
        <input type="text" id='askingPrice'/>
        <label htmlFor="askingPrice">Start Date</label>
        <input type="date" id='startDate'/>
        <label htmlFor="askingPrice">End Date</label>
        <input type="date" id='endDate' onChange={(evt)=>console.log(evt.currentTarget.value)}/>
        <button className="blockButton" onClick={{buildRequest}}>Request Lease</button>
    </div>)
}