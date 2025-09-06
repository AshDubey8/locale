const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/events', (req, res) => {
  const events = [
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
    },
    {
      id: '3',
      name: 'Football Match',
      date: '2025-09-12',
      location: 'Sports Complex',
      city: 'Mumbai'
    }
  ];

  const { q } = req.query;
  
  if (q) {
    const filtered = events.filter(event => 
      event.name.toLowerCase().includes(q.toLowerCase()) ||
      event.city.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filtered);
  } else {
    res.json(events);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
