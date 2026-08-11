// routes/doctorRoutes.js
const Doctor = require('../models/Doctor');
const makeCrudController = require('../utils/crudFactory');
const makeCrudRouter = require('../utils/crudRouter');

const controller = makeCrudController(Doctor, {
  allowedFields: ['name', 'specialty', 'email', 'hospital'],
  populate: ['hospital'], // so reads include the hospital's name, not just its ID
  uniqueFieldError: 'A doctor with this email already exists',
});

module.exports = makeCrudRouter(controller);
