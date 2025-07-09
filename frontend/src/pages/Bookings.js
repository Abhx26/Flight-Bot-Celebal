import React, { useEffect, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import api, { setAuthToken } from '../api';

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
    <Box maxWidth={600} mx="auto">
      <Typography variant="h5" mb={2}>My Bookings</Typography>
      {loading ? <CircularProgress /> : (
        <List>
          {bookings.map((booking, idx) => (
            <ListItem key={idx} divider>
              <ListItemText
                primary={`Flight: ${booking.flight?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode} to ${booking.flight?.itineraries?.[0]?.segments?.slice(-1)[0]?.arrival?.iataCode}`}
                secondary={`Status: ${booking.paymentStatus}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default Bookings; 