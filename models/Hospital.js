// models/Hospital.js
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      default: 'Not specified',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
