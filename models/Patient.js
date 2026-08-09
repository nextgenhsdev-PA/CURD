// models/Patient.js
// A "model" describes the SHAPE of a document in MongoDB, and gives you
// methods (.find, .save, .findByIdAndUpdate, etc.) to work with it.
//
// IMPORTANT: any field NOT listed here will be silently dropped by
// Mongoose when you try to save it. This is the #1 cause of
// "my data isn't saving" bugs for beginners.

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: [0, 'Age cannot be negative'],
    },
    condition: {
      type: String,
      default: 'Not specified',
    },
    email: {
      type: String,
      required: true,
      unique: true, // MongoDB will reject a second patient with the same email
      lowercase: true,
      trim: true,
    },
  },
  {
    // Automatically adds createdAt / updatedAt fields, and keeps
    // updatedAt current every time you .save() or findByIdAndUpdate() with
    // the right options (see controller).
    timestamps: true,
  }
);

// mongoose.model(name, schema) -> creates the Model class.
// MongoDB will store these in a collection called "patients" (lowercase, plural).
module.exports = mongoose.model('Patient', patientSchema);
