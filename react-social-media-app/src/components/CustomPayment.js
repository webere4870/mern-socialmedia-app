import React from 'react'
import './../Payment.css'
import Fetch from "./../utils/fetch"
import UserContext from './Context'
import Stripe from './Stripe'

export default function CustomPayment(props)
{
    let [user, setUser] = React.useContext(UserContext)
    let {name, _id} = props.paymentToProfile
    let [formState, setFormState] = React.useState({amount: 0})
    let [stripePK, setStripePK] = React.useState("")
    let [clientSecret, setClientSecret] = React.useState("")

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
        Fetch("stripe/payment", {method: "POST", headers: {"Content-Type": "application/json", "x-access-token": user?.jwt}, body: JSON.stringify({amount: formState.amount, user: _id})}).then((response)=>
        {
            setClientSecret(response.clientSecret)
            setStripePK(response.key)
        })
    }

    return(
    <div id='customPaymentBlock'>
        {stripePK && clientSecret && <Stripe secret={clientSecret} stripePK={stripePK}/>}
        <img className='profileBig' src={"https://webere4870.blob.core.windows.net/react-app/"+_id} alt="" />
        <label htmlFor="amount"></label>
        <input type="text" name="amount" onChange={changeForm} value={formState.amount}/>
        <button onClick={submitForm}>Submit</button>
    </div>)
}