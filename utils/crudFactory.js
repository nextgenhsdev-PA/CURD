// utils/crudFactory.js
//
// Every entity in this app (Patient, Doctor, Nurse, Hospital) needs the
// exact same five operations: create, list, get one, update, delete.
// Rather than writing that logic four separate times with copy-paste,
// this factory builds a controller for any Mongoose model in one call.
//
// Why this matters: if we find a bug in, say, how pagination works,
// we fix it here ONCE and every entity gets the fix. Adding a fifth
// entity later (Pharmacy, Nutritionist, whatever) takes ~10 lines,
// not another 150-line copy-pasted controller file.

const mongoose = require('mongoose');

function makeCrudController(Model, options = {}) {
  const { allowedFields = [], populate = [], uniqueFieldError = 'A record with this value already exists' } = options;

  function pickAllowed(body) {
    const result = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) result[key] = body[key];
    }
    return result;
  }

  async function create(req, res) {
    try {
      const data = pickAllowed(req.body);
      const doc = await Model.create(data);
      res.status(201).json(doc);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: uniqueFieldError });
      }
      res.status(400).json({ error: err.message });
    }
  }

  async function getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      let query = Model.find().skip(skip).limit(limit).sort({ createdAt: -1 });
      for (const field of populate) query = query.populate(field);

      const [data, total] = await Promise.all([query, Model.countDocuments()]);

      res.status(200).json({
        data,
        page,
        totalPages: Math.ceil(total / limit),
        total,
      });
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong fetching records' });
    }
  }

  async function getById(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      let query = Model.findById(id);
      for (const field of populate) query = query.populate(field);
      const doc = await query;

      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.status(200).json(doc);
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong fetching the record' });
    }
  }

  async function update(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const data = pickAllowed(req.body);
      const updated = await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.status(200).json(updated);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: uniqueFieldError });
      }
      res.status(400).json({ error: err.message });
    }
  }

  async function remove(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const deleted = await Model.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong deleting the record' });
    }
  }

  return { create, getAll, getById, update, remove };
}

module.exports = makeCrudController;
