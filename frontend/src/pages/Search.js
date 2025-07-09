import React, { useState } from 'react';
import { TextField, Button, Typography, Box, MenuItem, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Search({ chatbotEntities, onSearchResults }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [travelClass, setTravelClass] = useState('ECONOMY');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [airline, setAirline] = useState('');
  const [maxLayovers, setMaxLayovers] = useState('');
  const [maxDuration, setMaxDuration] = useState('');

  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/flights/search', {
        params: { origin, destination, departureDate, returnDate, adults, children, travelClass, airline, maxLayovers, maxDuration },
      });
      setResults(res.data.data || []);
      if (onSearchResults) onSearchResults(res.data.data || []);
    } catch (err) {
      setError('Search failed');
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (chatbotEntities) {
      if (chatbotEntities.origin) setOrigin(chatbotEntities.origin);
      if (chatbotEntities.destination) setDestination(chatbotEntities.destination);
      if (chatbotEntities.date) setDepartureDate(chatbotEntities.date);
      if (chatbotEntities.adults) setAdults(chatbotEntities.adults);
      if (chatbotEntities.children) setChildren(chatbotEntities.children);
      if (chatbotEntities.travelclass) setTravelClass(chatbotEntities.travelclass);
      if (chatbotEntities.airline) setAirline(chatbotEntities.airline);
      if (chatbotEntities.maxlayovers) setMaxLayovers(chatbotEntities.maxlayovers);
      if (chatbotEntities.maxduration) setMaxDuration(chatbotEntities.maxduration);
      // If we have enough info, trigger search
      if (chatbotEntities.origin && chatbotEntities.destination && chatbotEntities.date) {
        handleSearch();
      }
    }
  }, [chatbotEntities]);

  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h5" mb={2}>Search Flights</Typography>
      <TextField label="Origin" value={origin} onChange={e => setOrigin(e.target.value)} margin="normal" fullWidth />
      <TextField label="Destination" value={destination} onChange={e => setDestination(e.target.value)} margin="normal" fullWidth />
      <TextField label="Departure Date" type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} margin="normal" fullWidth InputLabelProps={{ shrink: true }} />
      <TextField label="Return Date" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} margin="normal" fullWidth InputLabelProps={{ shrink: true }} />
      <TextField label="Adults" type="number" value={adults} onChange={e => setAdults(e.target.value)} margin="normal" fullWidth />
      <TextField label="Children" type="number" value={children} onChange={e => setChildren(e.target.value)} margin="normal" fullWidth />
      <TextField select label="Travel Class" value={travelClass} onChange={e => setTravelClass(e.target.value)} margin="normal" fullWidth>
        <MenuItem value="ECONOMY">Economy</MenuItem>
        <MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
        <MenuItem value="BUSINESS">Business</MenuItem>
        <MenuItem value="FIRST">First</MenuItem>
      </TextField>
      <TextField label="Airline (IATA code)" value={airline} onChange={e => setAirline(e.target.value)} margin="normal" fullWidth />
      <TextField label="Max Layovers" type="number" value={maxLayovers} onChange={e => setMaxLayovers(e.target.value)} margin="normal" fullWidth />
      <TextField label="Max Duration (min)" type="number" value={maxDuration} onChange={e => setMaxDuration(e.target.value)} margin="normal" fullWidth />
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSearch} disabled={loading}>Search</Button>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {results.map((flight, idx) => (
          <ListItem key={idx} divider secondaryAction={
            <Button variant="contained" onClick={() => navigate('/book', { state: { flight } })}>Book</Button>
          }>
            <ListItemText
              primary={`From ${flight.itineraries[0].segments[0].departure.iataCode} to ${flight.itineraries[0].segments.slice(-1)[0].arrival.iataCode}`}
              secondary={`Price: ${flight.price.total} ${flight.price.currency}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Search; 