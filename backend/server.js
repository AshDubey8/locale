const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/events', async (req, res) => {
  const { q } = req.query;
  
  try {
    const apiKey = process.env.TICKETMASTER_API_KEY;
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        apikey: apiKey,
        keyword: q || 'music',
        countryCode: 'US',
        size: 10
      }
    });

    const events = response.data._embedded?.events?.map(event => ({
      id: event.id,
      name: event.name,
      date: event.dates?.start?.localDate || 'TBD',
      location: event._embedded?.venues?.[0]?.name || 'TBD',
      city: event._embedded?.venues?.[0]?.city?.name || 'TBD'
    })) || [];

    res.json(events);
  } catch (error) {
    console.error('API Error:', error.message);
    
    const fallbackEvents = [
      {
        id: '1',
        name: 'Music Event',
        date: '2025-09-09',
        location: 'Uppal Stadium',
        city: 'Hyderabad'
      },
      {
        id: '2', 
        name: 'Dance Event',
        date: '2025-09-10',
        location: 'Mega Mall',
        city: 'Bangalore'
      }
    ];

    const filtered = q ? fallbackEvents.filter(event => 
      event.name.toLowerCase().includes(q.toLowerCase()) ||
      event.city.toLowerCase().includes(q.toLowerCase())
    ) : fallbackEvents;

    res.json(filtered);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
