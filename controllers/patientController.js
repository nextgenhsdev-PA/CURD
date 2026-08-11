// controllers/patientController.js
// A "controller" holds the actual logic for what happens when a
// request hits a route. The route file just points HTTP verbs + URLs
// to these functions.

const mongoose = require('mongoose');
const Patient = require('../models/Patient');

/* ------------------------------------------------------------------ */
/* CREATE — POST /api/patients                                         */
/* ------------------------------------------------------------------ */
async function createPatient(req, res) {
  try {
    // req.body only exists because server.js has app.use(express.json()).
    // Without that middleware, req.body would be undefined and this
    // would silently create garbage/empty documents.
    const { name, age, condition, email } = req.body;

    const patient = await Patient.create({ name, age, condition, email });
    // .create() = new Patient(...) + .save(), in one step. Always await it.

    // 201 = "Created". Returning the created object lets the frontend
    // immediately show it without a second request.
    res.status(201).json(patient);
  } catch (err) {
    // Mongoose validation errors (missing required field, bad type, etc.)
    // land here. err.name === 'ValidationError' is a common check.
    if (err.code === 11000) {
      // 11000 = MongoDB's "duplicate key" error code (e.g. duplicate email)
      return res.status(409).json({ error: 'A patient with this email already exists' });
    }
    res.status(400).json({ error: err.message });
  }
}

/* ------------------------------------------------------------------ */
/* READ (list) — GET /api/patients                                     */
/* ------------------------------------------------------------------ */
async function getPatients(req, res) {
  try {
    // Basic pagination so this doesn't return 100,000 documents at once
    // in a real app. ?page=2&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      Patient.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Patient.countDocuments(),
    ]);

    res.status(200).json({
      data: patients,
      page,
      totalPages: Math.ceil(total / limit),
      totalPatients: total,
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong fetching patients' });
  }
}

/* ------------------------------------------------------------------ */
/* READ (single) — GET /api/patients/:id                               */
/* ------------------------------------------------------------------ */
async function getPatientById(req, res) {
  try {
    const { id } = req.params;

    // If someone requests /api/patients/banana, Mongoose will throw an
    // ugly CastError. Checking this ourselves gives a clean 400 instead.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }

    const patient = await Patient.findById(id);

    // findById returns null if nothing matches — it does NOT throw.
    // Forgetting this check is why people see "200 OK" with an empty body
    // instead of a proper 404.
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong fetching the patient' });
  }
}

/* ------------------------------------------------------------------ */
/* UPDATE — PATCH /api/patients/:id                                    */
/* ------------------------------------------------------------------ */
async function updatePatient(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }

    // Only allow specific fields to be updated. Never spread req.body
    // directly into an update — a client could otherwise try to set
    // fields like _id or createdAt.
    const allowedUpdates = ['name', 'age', 'condition', 'email'];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, updates, {
      new: true, // return the UPDATED document, not the old one
      runValidators: true, // re-run schema validation (e.g. "age >= 0") on update
    });

    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json(updatedPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/* ------------------------------------------------------------------ */
/* DELETE — DELETE /api/patients/:id                                   */
/* ------------------------------------------------------------------ */
async function deletePatient(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }

    const deleted = await Patient.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // 204 = "No Content" — success, nothing to send back.
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong deleting the patient' });
  }
}

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
