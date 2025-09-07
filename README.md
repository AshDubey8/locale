# Locale

A full-stack event discovery application that helps you find local events using the Ticketmaster API. You can search for events by city and save favorites to a PostgreSQL database.

## Features

- Search events by city with real-time results
- Save and manage favorite events
- Rate limiting protection (60 requests/minute)
- PostgreSQL database with connection pooling

## Tech Stack

- Backend: Node.js, Express.js
- Database: PostgreSQL
- Frontend: HTML, CSS, JavaScript
- API: Ticketmaster Discovery API

## Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- Ticketmaster API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/AshDubey8/locale.git
   cd locale
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Create environment file
   Create a `.env` file in the `backend/` directory:
   ```
   TICKETMASTER_API_KEY=your_api_key_here
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=locale_db
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

4. Set up PostgreSQL database
   ```sql
   CREATE DATABASE locale_db;
   ```

5. Start the server
   ```bash
   npm start
   ```

6. Open the application
   Open `frontend/index.html` in your browser

## Getting Ticketmaster API Key

1. Go to https://developer.ticketmaster.com/
2. Create a free account
3. Register a new application
4. Copy your Consumer Key to the `.env` file

## API Endpoints

- `GET /events?city={city}` - Search events by city
- `GET /favorites` - Get all saved events
- `POST /favorites` - Save an event
- `DELETE /favorites/:id` - Remove a saved event

## Project Structure

```
locale/
├── backend/
│   ├── server.js          # Main server file
│   ├── database.js        # Database connection
│   ├── package.json       # Dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── index.html        # Main page
│   ├── style.css         # Styles
│   └── script.js         # Client code
└── README.md
```

## Performance

- Average API response time: 327ms
- Database query time: 15ms average
- Rate limiting: 60 requests per minute