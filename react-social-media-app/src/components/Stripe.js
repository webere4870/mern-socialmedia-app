import React from 'react';
import ReactDOM from 'react-dom';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51LknlNJArGv2kiWToEA4TwdmVZhLZqoSAqF6Fr2Zr4dKSCkl7VbY6LnyABjgGepGCr7zrqrKgwQuvcJ46NIkLrZp00v9tDvP2e');

export default function Stripe(props) {
  const options = {
    // passing the client secret obtained in step 2
    clientSecret: props.secret,
    // Fully customizable with appearance API.
    appearance: {/*...*/},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

