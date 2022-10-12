import React from 'react'
import './../Payment.css'
import Fetch from "./../utils/fetch"
import UserContext from './Context'
import Stripe from './Stripe'
import queryString from 'query-string'
import {Link} from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import AuthFetch from '../utils/authFetch'

export default function CustomPayment(props)
{
    let {user, getAccessTokenSilently} = useAuth0()
    let [formState, setFormState] = React.useState({amount: 0})
    let [stripePK, setStripePK] = React.useState("")
    let [clientSecret, setClientSecret] = React.useState("")
    let [otherUser, setOtherUser] = React.useState()
    let profile = props?.profile

    function changeForm(evt)
    {
        let newVal = evt.currentTarget.value
        let name = evt.currentTarget.name
        setFormState((prev)=>
        {
            return {...prev, [name]: newVal}
        })
    }

    function submitForm(evt)
    {
        AuthFetch("stripe/payment", {method: "POST", headers: {"Content-Type": "application/json", "x-access-token": user?.jwt}, body: JSON.stringify({amount: formState.amount, user: profile?._id})}, getAccessTokenSilently).then((response)=>
        {
            console.log("here")
            setClientSecret(response.clientSecret)
            setStripePK(response.key)
            
        })
    }

    console.log(stripePK, clientSecret)

    return(
    <div id='customPaymentBlock'>
        {stripePK && clientSecret && <Stripe secret={clientSecret} stripePK={stripePK}/>}
        <img className='profileBig' src={"https://webere4870.blob.core.windows.net/react-app/"+profile?._id} alt="" />
        <label htmlFor="amount"></label>
        <input type="text" name="amount" onChange={changeForm} value={formState.amount}/>
        <button onClick={submitForm}>Submit</button>
    </div>)
}