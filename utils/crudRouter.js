// utils/crudRouter.js
// Wires the standard 5 CRUD routes to whatever controller was built by
// crudFactory.js. Every entity route file becomes ~3 lines instead of
// repeating router.post/get/patch/delete five times each.

const express = require('express');

function makeCrudRouter(controller) {
  const router = express.Router();
  router.post('/', controller.create);
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
}

module.exports = makeCrudRouter;
