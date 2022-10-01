import React from 'react'
import './../Payment.css'

export default function CustomPayment(props)
{

    let {name, _id} = props.paymentToProfile
    let [formState, setFormState] = React.useState({amount: 0})

    function changeForm(evt)
    {
        let newVal = evt.currentTarget.value
        let name = evt.currentTarget.name
        setFormState((prev)=>
        {
            return {...prev, [name]: newVal}
        })
    }

    return(
    <div id='customPaymentBlock'>
        <img className='profileBig' src={"https://webere4870.blob.core.windows.net/react-app/"+_id} alt="" />
        <label htmlFor="amount"></label>
        <input type="text" name="amount" onChange={changeForm} value={formState}/>
    </div>)
}