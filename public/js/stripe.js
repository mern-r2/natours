/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_51N5Fd9DxjV2LF9m5ENKX0dvl9SZViKqFV03U1l1sZ7TUTuHsUVLkdwW3y3roybKgRen1j0MTPXoLLTirvN7UT9Or00b0nkTupG');

export const bookTour = async tourId => {
  try {
    // Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // Create checkout form and charge credit card
    window.location.assign(session.data.session.url)
    // deprecated or even removed - redirection on back-end
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.url
    // });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
