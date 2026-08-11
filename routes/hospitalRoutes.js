// routes/hospitalRoutes.js
const Hospital = require('../models/Hospital');
const makeCrudController = require('../utils/crudFactory');
const makeCrudRouter = require('../utils/crudRouter');

const controller = makeCrudController(Hospital, {
  allowedFields: ['name', 'address', 'phone'],
  uniqueFieldError: 'A hospital with this name already exists',
});

module.exports = makeCrudRouter(controller);
