// seed.js
// Generates realistic-looking fake data at whatever scale you want —
// change the numbers below, nothing else. No manual typing of records.
//
// Run with: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const Nurse = require('./models/Nurse');
const Patient = require('./models/Patient');

/* ------------------------------------------------------------------ */
/* Change these numbers to whatever scale you want                     */
/* ------------------------------------------------------------------ */
const HOSPITAL_COUNT = 5;
const DOCTOR_COUNT = 50;
const NURSE_COUNT = 60;
const PATIENT_COUNT = 200;

/* ------------------------------------------------------------------ */
/* Reference lists used to generate realistic-looking values           */
/* ------------------------------------------------------------------ */

const SPECIALTIES = [
  'Endocrinology', 'Cardiology', 'Psychiatry', 'General Practice',
  'Pediatrics', 'Dermatology', 'Neurology', 'Oncology',
  'Orthopedics', 'Gastroenterology',
];

const CONDITIONS = [
  'Type 2 Diabetes', 'Hypertension', 'Asthma', 'Generalized Anxiety Disorder',
  'Chronic Kidney Disease, Stage 2', 'Hypothyroidism', 'Migraine',
  'Osteoarthritis', 'Coronary Artery Disease', 'Not specified',
];

const SHIFTS = ['Day', 'Night', 'Rotating'];

// Guarantees a unique email even if two fake names happen to collide,
// by appending an index. Mongoose's unique index would otherwise reject
// the second insert with the same email.
function uniqueEmail(name, index) {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '');
  return `${slug}.${index}@example.com`;
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* ------------------------------------------------------------------ */
/* Generators — each returns an array of plain objects ready to insert */
/* ------------------------------------------------------------------ */

function generateHospitals(count) {
  return Array.from({ length: count }, () => ({
    name: `${faker.location.city()} ${randomFrom(['General', 'Memorial', 'Regional', 'Community'])} Hospital`,
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
  }));
}

function generateDoctors(count, hospitalIds) {
  return Array.from({ length: count }, (_, i) => {
    const name = `Dr. ${faker.person.fullName()}`;
    return {
      name,
      specialty: randomFrom(SPECIALTIES),
      email: uniqueEmail(name, i),
      hospital: randomFrom(hospitalIds),
    };
  });
}

function generateNurses(count, hospitalIds) {
  return Array.from({ length: count }, (_, i) => {
    const name = `Nurse ${faker.person.fullName()}`;
    return {
      name,
      shift: randomFrom(SHIFTS),
      email: uniqueEmail(name, i),
      hospital: randomFrom(hospitalIds),
    };
  });
}

function generatePatients(count, hospitals, doctors, nurses) {
  return Array.from({ length: count }, (_, i) => {
    const name = faker.person.fullName();
    // Pick a hospital first, then a doctor/nurse who actually works there,
    // so the data stays logically consistent (a patient's doctor really
    // is at the patient's hospital) instead of being fully random.
    const hospital = randomFrom(hospitals);
    const doctorsHere = doctors.filter(d => String(d.hospital) === String(hospital._id));
    const nursesHere = nurses.filter(n => String(n.hospital) === String(hospital._id));

    return {
      name,
      age: faker.number.int({ min: 1, max: 95 }),
      condition: randomFrom(CONDITIONS),
      email: uniqueEmail(name, i),
      hospital: hospital._id,
      doctor: doctorsHere.length ? randomFrom(doctorsHere)._id : null,
      nurse: nursesHere.length ? randomFrom(nursesHere)._id : null,
    };
  });
}

/* ------------------------------------------------------------------ */
/* Run it                                                               */
/* ------------------------------------------------------------------ */

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      Hospital.deleteMany({}),
      Doctor.deleteMany({}),
      Nurse.deleteMany({}),
      Patient.deleteMany({}),
    ]);
    console.log('Cleared existing hospitals, doctors, nurses, and patients');

    const hospitals = await Hospital.insertMany(generateHospitals(HOSPITAL_COUNT));
    console.log(`Inserted ${hospitals.length} hospitals`);

    const hospitalIds = hospitals.map(h => h._id);
    const doctors = await Doctor.insertMany(generateDoctors(DOCTOR_COUNT, hospitalIds));
    console.log(`Inserted ${doctors.length} doctors`);

    const nurses = await Nurse.insertMany(generateNurses(NURSE_COUNT, hospitalIds));
    console.log(`Inserted ${nurses.length} nurses`);

    const patients = await Patient.insertMany(generatePatients(PATIENT_COUNT, hospitals, doctors, nurses));
    console.log(`Inserted ${patients.length} patients, each linked to a hospital/doctor/nurse`);

    await mongoose.disconnect();
    console.log('Done. Run "npm run dev" to start the server.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
