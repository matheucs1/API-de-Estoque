const express = require('express');
const inventoryMovement = require('../api/inventoryMovement');
const uthMiddleware = require('../middleware/auth');

const movementRouter = express.Router();

movementRouter.get('/:inventoryId/',uthMiddleware(), inventoryMovement.FindAll);
movementRouter.get('/:inventoryId/:id',uthMiddleware(), inventoryMovement.FindById);
movementRouter.post('/:inventoryId/',uthMiddleware(), inventoryMovement.Create);
movementRouter.put('/:inventoryId/:id',uthMiddleware(), inventoryMovement.Update);
movementRouter.delete('/:inventoryId/:id',uthMiddleware(), inventoryMovement.Delete);

module.exports = movementRouter;