const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get Amadeus access token
async function getAmadeusToken() {
  const { data } = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return data.access_token;
}

// Flight search
router.get('/search', async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, adults, children, travelClass, airline, maxLayovers, maxDuration } = req.query;
    const token = await getAmadeusToken();
    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults,
      ...(returnDate && { returnDate }),
      ...(children && { children }),
      ...(travelClass && { travelClass }),
      currencyCode: 'USD',
      max: 20,
    };
    const { data } = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    let results = data.data || [];
    // Filter by airline
    if (airline) {
      results = results.filter(flight =>
        flight.itineraries.some(itin =>
          itin.segments.some(seg => seg.carrierCode === airline)
        )
      );
    }
    // Filter by max layovers
    if (maxLayovers !== undefined) {
      results = results.filter(flight =>
        flight.itineraries.every(itin => itin.segments.length - 1 <= Number(maxLayovers))
      );
    }
    // Filter by max duration (in minutes)
    if (maxDuration !== undefined) {
      results = results.filter(flight =>
        flight.itineraries.every(itin => {
          const duration = itin.duration.replace('PT', '').replace('H', ':').replace('M', '').split(':');
          const mins = (parseInt(duration[0] || '0') * 60) + parseInt(duration[1] || '0');
          return mins <= Number(maxDuration);
        })
      );
    }
    res.json({ data: results });
  } catch (err) {
    res.status(500).json({ message: 'Flight search failed', error: err.message });
  }
});

module.exports = router; 