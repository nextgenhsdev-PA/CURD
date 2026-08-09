// routes/patientRoutes.js
// This file's only job: map "verb + URL" to a controller function.
// Keeping routes separate from logic makes both easier to read.

const express = require('express');
const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

router.post('/', createPatient); // POST   /api/patients
router.get('/', getPatients); // GET    /api/patients
router.get('/:id', getPatientById); // GET    /api/patients/:id
router.patch('/:id', updatePatient); // PATCH  /api/patients/:id
router.delete('/:id', deletePatient); // DELETE /api/patients/:id

module.exports = router;
