// db.js
// This file's only job: connect to MongoDB using Mongoose.
// We keep it separate from server.js so the connection logic is easy to find.

const mongoose = require('mongoose');

async function connectDB() {
  try {
    // mongoose.connect() returns a Promise, so we MUST await it.
    // Forgetting "await" here is the #1 reason people think
    // "my database isn't connected" when actually it just hasn't finished yet.
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    // If the connection string is wrong, password wrong, IP not whitelisted
    // in Atlas, etc. — this is where you'll see the real error.
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // stop the app, there's no point running without a DB
  }
}

module.exports = connectDB;
