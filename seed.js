// seed.js
// Run this once with "node seed.js" to fill your database with 10 sample
// patients — useful for demos, so you have something to show right away
// instead of an empty collection.
//
// Safe to run more than once: it clears existing patients first, so you
// won't end up with duplicates piling up every time you run it.

require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('./models/Patient');

const samplePatients = [
  { name: 'Maria Chen', age: 42, condition: 'Type 2 Diabetes', email: 'maria.chen@example.com' },
  { name: 'James Okafor', age: 58, condition: 'Hypertension', email: 'james.okafor@example.com' },
  { name: 'Priya Sharma', age: 34, condition: 'Asthma', email: 'priya.sharma@example.com' },
  { name: 'Liam O\u2019Brien', age: 67, condition: 'Coronary Artery Disease', email: 'liam.obrien@example.com' },
  { name: 'Aisha Bello', age: 29, condition: 'Generalized Anxiety Disorder', email: 'aisha.bello@example.com' },
  { name: 'Tomás García', age: 51, condition: 'Chronic Kidney Disease, Stage 2', email: 'tomas.garcia@example.com' },
  { name: 'Sarah Kim', age: 45, condition: 'Hypothyroidism', email: 'sarah.kim@example.com' },
  { name: 'David Osei', age: 39, condition: 'Migraine', email: 'david.osei@example.com' },
  { name: 'Fatima Al-Sayed', age: 62, condition: 'Osteoarthritis', email: 'fatima.alsayed@example.com' },
  { name: 'Noah Williams', age: 71, condition: 'Type 2 Diabetes, Hypertension', email: 'noah.williams@example.com' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const deleted = await Patient.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing patient(s)`);

    const inserted = await Patient.insertMany(samplePatients);
    console.log(`Inserted ${inserted.length} sample patients`);

    await mongoose.disconnect();
    console.log('Done. You can now start the server with "npm run dev".');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
