import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import api, { setAuthToken } from '../api';
import '../App.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    api.get('/bookings')
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-card">
      <div className="bold-header">My Bookings</div>
      {loading ? <CircularProgress /> : (
        <div>
          {bookings.map((booking, idx) => (
            <div className="result-card" key={idx}>
              <div>
                <div style={{ fontWeight: 600 }}>{`Flight: ${booking.flight?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode} to ${booking.flight?.itineraries?.[0]?.segments?.slice(-1)[0]?.arrival?.iataCode}`}</div>
                <div style={{ color: '#666', fontSize: 15 }}>{`Status: ${booking.paymentStatus}`}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings; 