import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api, { setAuthToken } from '../api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function BookingForm({ flight }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleBook = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Create booking (pending payment)
      const token = localStorage.getItem('token');
      setAuthToken(token);
      const bookingRes = await api.post('/bookings', { flight, itinerary: {}, paymentStatus: 'pending' });
      const bookingId = bookingRes.data._id;
      // 2. Create payment intent
      const amount = Math.round(Number(flight.price.total) * 100); // Stripe expects cents
      const paymentRes = await api.post('/payment/create-intent', { amount, currency: flight.price.currency });
      const clientSecret = paymentRes.data.clientSecret;
      // 3. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name, email },
        },
      });
      if (paymentResult.error) throw new Error(paymentResult.error.message);
      // 4. Update booking payment status
      await api.patch(`/bookings/${bookingId}/payment`, { paymentStatus: 'paid' });
      navigate('/bookings');
    } catch (err) {
      setError(err.message || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6">Book Flight</Typography>
      <Typography variant="body2" mb={2}>{`From ${flight.itineraries[0].segments[0].departure.iataCode} to ${flight.itineraries[0].segments.slice(-1)[0].arrival.iataCode}`}</Typography>
      <Typography variant="body2" mb={2}>{`Price: ${flight.price.total} ${flight.price.currency}`}</Typography>
      <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleBook} disabled={loading}>Pay & Book</Button>
    </Paper>
  );
}

function BookFlight() {
  const location = useLocation();
  const flight = location.state?.flight;
  if (!flight) return <Typography>No flight selected.</Typography>;
  return (
    <Elements stripe={stripePromise}>
      <BookingForm flight={flight} />
    </Elements>
  );
}

export default BookFlight; 