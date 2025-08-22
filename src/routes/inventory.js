const express = require('express');
const ApiInventory = require('../api/inventory');
const uthMiddleware = require('../middleware/auth');

const inventoryRouter = express.Router();

inventoryRouter.get('/',uthMiddleware(), ApiInventory.FindAll);
inventoryRouter.get('/:id',uthMiddleware(), ApiInventory.FindById);
inventoryRouter.post('/',uthMiddleware(), ApiInventory.Create);
inventoryRouter.put('/:id',uthMiddleware(), ApiInventory.Update);
inventoryRouter.delete('/:id',uthMiddleware(), ApiInventory.Delete);

module.exports = inventoryRouter;