// routes/patientRoutes.js
const Patient = require('../models/Patient');
const makeCrudController = require('../utils/crudFactory');
const makeCrudRouter = require('../utils/crudRouter');

const controller = makeCrudController(Patient, {
  allowedFields: ['name', 'age', 'condition', 'email', 'hospital', 'doctor', 'nurse'],
  populate: ['hospital', 'doctor', 'nurse'],
  uniqueFieldError: 'A patient with this email already exists',
});

module.exports = makeCrudRouter(controller);
