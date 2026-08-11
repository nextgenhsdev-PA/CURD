// routes/nurseRoutes.js
const Nurse = require('../models/Nurse');
const makeCrudController = require('../utils/crudFactory');
const makeCrudRouter = require('../utils/crudRouter');

const controller = makeCrudController(Nurse, {
  allowedFields: ['name', 'shift', 'email', 'hospital'],
  populate: ['hospital'],
  uniqueFieldError: 'A nurse with this email already exists',
});

module.exports = makeCrudRouter(controller);
