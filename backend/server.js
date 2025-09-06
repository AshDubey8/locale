const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const { pool, dbConnected } = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute  
  max: 30, // 30 searches per minute
  message: {
    error: 'Too many searches, please wait before searching again.',
    retryAfter: '1 minute'
  }
});

app.use('/events', searchLimiter);
app.use('/favorites', apiLimiter);

let memoryFavorites = [];

app.get('/', (req, res) => {
  res.json({ 
    message: 'Locale API is running!',
    database: dbConnected ? 'PostgreSQL' : 'Memory Storage',
    rateLimits: {
      events: '30 requests/minute',
      favorites: '60 requests/minute'
    }
  });
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

app.post('/favorites', async (req, res) => {
  try {
    const { event_id, name, date, location, city } = req.body;
    
    if (dbConnected) {
      const result = await pool.query(
        'INSERT INTO favorites (event_id, name, date, location, city) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [event_id, name, date, location, city]
      );
      res.json(result.rows[0]);
    } else {
      const favorite = {
        id: memoryFavorites.length + 1,
        event_id,
        name,
        date,
        location,
        city,
        created_at: new Date()
      };
      memoryFavorites.push(favorite);
      res.json(favorite);
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
    res.status(500).json({ error: 'Failed to save favorite' });
  }
});

app.get('/favorites', async (req, res) => {
  try {
    if (dbConnected) {
      const result = await pool.query('SELECT * FROM favorites ORDER BY created_at DESC');
      res.json(result.rows);
    } else {
      res.json(memoryFavorites.reverse());
    }
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
