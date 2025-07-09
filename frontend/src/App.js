import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Bookings from './pages/Bookings';
import Chatbot from './pages/Chatbot';
import BookFlight from './pages/BookFlight';
import api, { setAuthToken } from './api';

function App() {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language);
  const [chatbotEntities, setChatbotEntities] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [chatbotMessages, setChatbotMessages] = useState([]);

  const handleLangChange = (e) => {
    setLang(e.target.value);
    i18n.changeLanguage(e.target.value);
  };

  // Pass this to Search to capture results
  const handleSearchResults = (results) => setSearchResults(results);

  // Booking from chat
  const handleBookFromChat = async (which) => {
    if (!searchResults.length) return;
    const flight = searchResults[0]; // For now, book the first flight
    try {
      const token = localStorage.getItem('token');
      setAuthToken(token);
      const bookingRes = await api.post('/bookings', { flight, itinerary: {}, paymentStatus: 'paid' });
      setChatbotMessages(msgs => [...msgs, { from: 'bot', text: `Booking confirmed! Your itinerary: From ${flight.itineraries[0].segments[0].departure.iataCode} to ${flight.itineraries[0].segments.slice(-1)[0].arrival.iataCode}, Price: ${flight.price.total} ${flight.price.currency}` }]);
    } catch (err) {
      setChatbotMessages(msgs => [...msgs, { from: 'bot', text: 'Booking failed. Please try again.' }]);
    }
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">{t('search_flights')}</Button>
          <Button color="inherit" component={Link} to="/bookings">Bookings</Button>
          <Button color="inherit" component={Link} to="/login">{t('login')}</Button>
          <Button color="inherit" component={Link} to="/register">{t('register')}</Button>
          <Select value={lang} onChange={handleLangChange} style={{ marginLeft: 'auto', color: 'white' }}>
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="es">ES</MenuItem>
            <MenuItem value="fr">FR</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: 32 }}>
        <Routes>
          <Route path="/" element={<Search chatbotEntities={chatbotEntities} onSearchResults={handleSearchResults} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/book" element={<BookFlight />} />
        </Routes>
        <Chatbot onEntities={setChatbotEntities} onBookFromChat={handleBookFromChat} />
        {/* Show chatbotMessages in Chatbot if needed */}
      </Container>
    </Router>
  );
}

export default App; 