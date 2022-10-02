import React from 'react'
import Nav from './Nav'
import StripeStatus from './StripeStatus'
import Fetch from './../utils/fetch'
import UserContext from './Context'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51LknlNJArGv2kiWToEA4TwdmVZhLZqoSAqF6Fr2Zr4dKSCkl7VbY6LnyABjgGepGCr7zrqrKgwQuvcJ46NIkLrZp00v9tDvP2e');


export default function Success(props)
{

    let [user, setUser] = React.useContext(UserContext)


    return (
    <div className='App'>
        <Nav/>
        <Elements stripe={stripePromise}>
            <StripeStatus/>
        </Elements>
    </div>)
}