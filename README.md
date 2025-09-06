# Locale

Event discovery app

## Setup

1. Clone the repo
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Then edit `.env` and add your Ticketmaster API credentials

4. Start the backend:
   ```
   npm start
   ```

5. Open `frontend/index.html` in your browser

## Getting API Keys

1. Go to https://developer.ticketmaster.com/
2. Create a free account
3. Register your application
4. Copy your Consumer Key and Secret to `.env`

## Tech Stack

- Backend: Node.js, Express
- Frontend: HTML, CSS, JavaScript
- API: Ticketmaster Discovery API