// models/Nurse.js
const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nurse name is required'],
      trim: true,
    },
    shift: {
      type: String,
      enum: ['Day', 'Night', 'Rotating'],
      default: 'Day',
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
      required: [true, 'A nurse must be linked to a hospital'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Nurse', nurseSchema);
