// models/Patient.js
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
      unique: true,
      lowercase: true,
      trim: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nurse',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
