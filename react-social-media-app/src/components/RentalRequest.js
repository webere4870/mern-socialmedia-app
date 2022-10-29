import React from 'react'
import Fetch from './../utils/fetch'
import AuthFetch from '../utils/authFetch'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function RentalRequest(props)
{

    let {price, owner, _id} = props?.listing
    console.log(props?.listing)
    let [propOwner, setPropOwner] = React.useState()
    let {getAccessTokenSilently} = useAuth0()
    let [requestForm, setRequestForm] = React.useState({startDate: "", endDate: "", price: '' + price, landlord: owner, property: _id})

    function buildRequest(evt)
    {
        let newForm = {...requestForm}
        newForm.landlord = owner
        newForm.property = _id
        AuthFetch("leaseRequest", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newForm)}, getAccessTokenSilently).then((response)=>
        {

        })
    }

    function changePrice(evt)
    {
        let newVal = evt.currentTarget.value
        setRequestForm((prev)=>
        {
            return {...prev, price: newVal}
        })
    }

    function toggleDate(evt)
    {
        let name = evt.currentTarget.name
        let val = evt.currentTarget.value
        console.log(name, val)
        setRequestForm((prev)=>
        {
            return {...prev, [name]: val}
        })
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
        <input type="text" id='askingPrice' value={requestForm.price} onChange={changePrice}/>
        <label htmlFor="askingPrice">Start Date</label>
        <input type="date" id='startDate' name='startDate' value={requestForm.startDate} onChange={toggleDate}/>
        <label htmlFor="askingPrice">End Date</label>
        <input type="date" id='endDate' name='endDate' value={requestForm.endDate} onChange={toggleDate}/>
        <button className="blockButton" onClick={buildRequest}>Request Lease</button>
    </div>)
}