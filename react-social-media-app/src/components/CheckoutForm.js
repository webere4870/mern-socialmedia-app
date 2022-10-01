import React from 'react';
import {PaymentElement} from '@stripe/react-stripe-js';

const CheckoutForm = (props) => {
  return (
    <form id='stripeForm'>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};

export default CheckoutForm;
