// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    specialty: {
      type: String,
      default: 'General Practice',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // This is how a "relationship" works in MongoDB: we don't nest the
    // whole hospital document inside a doctor. We store a reference (the
    // hospital's _id) and use .populate() later to fetch the full details
    // when we need them. This keeps each document small and avoids
    // duplicating hospital data across every doctor that works there.
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'A doctor must be linked to a hospital'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
