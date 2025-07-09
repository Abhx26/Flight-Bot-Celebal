import React, { useState } from 'react';
import { Typography, TextField } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api, { setAuthToken } from '../api';
import '../App.css';

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
      const token = localStorage.getItem('token');
      setAuthToken(token);
      const bookingRes = await api.post('/bookings', { flight, itinerary: {}, paymentStatus: 'pending' });
      const bookingId = bookingRes.data._id;
      const amount = Math.round(Number(flight.price.total) * 100);
      const paymentRes = await api.post('/payment/create-intent', { amount, currency: flight.price.currency });
      const clientSecret = paymentRes.data.clientSecret;
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name, email },
        },
      });
      if (paymentResult.error) throw new Error(paymentResult.error.message);
      await api.patch(`/bookings/${bookingId}/payment`, { paymentStatus: 'paid' });
      navigate('/bookings');
    } catch (err) {
      setError(err.message || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <div className="main-card">
      <div className="bold-header">Book Flight</div>
      <Typography variant="body2" style={{ marginBottom: 12 }}>{`From ${flight.itineraries[0].segments[0].departure.iataCode} to ${flight.itineraries[0].segments.slice(-1)[0].arrival.iataCode}`}</Typography>
      <Typography variant="body2" style={{ marginBottom: 18 }}>{`Price: ${flight.price.total} ${flight.price.currency}`}</Typography>
      <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} className="form-field" />
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} className="form-field" />
      <div className="form-field" style={{ background: '#fff', padding: 12, border: '1px solid #eee' }}>
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      {error && <Typography color="error" style={{ marginBottom: 16 }}>{error}</Typography>}
      <button className="primary-btn" onClick={handleBook} disabled={loading}>Pay & Book</button>
    </div>
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