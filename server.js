// server.js
// The entry point. Run this with "npm run dev" (or "npm start").

require('dotenv').config(); // loads variables from .env into process.env

const express = require('express');
const path = require('path');
const connectDB = require('./db');
const patientRoutes = require('./routes/patientRoutes');

const app = express();

// This line is required for req.body to work on POST/PATCH requests.
// Forgetting it is a classic reason "nothing saves" — req.body is
// silently undefined without it.
app.use(express.json());

// Serves the demo webpage (public/index.html) at http://localhost:4000
app.use(express.static(path.join(__dirname, 'public')));

// Every route inside patientRoutes.js is now prefixed with /api/patients
app.use('/api/patients', patientRoutes);

// Catch-all for anything that isn't a static file or a known API route.
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 4000;

// Connect to the database FIRST, then start listening.
// If you start listening before the DB connects, your first few
// requests could hit a database that isn't ready yet.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
