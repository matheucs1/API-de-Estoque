const express = require('express');
const ApiProduct = require('../api/product');
const uthMiddleware = require('../middleware/auth');

const productRouter = express.Router();

productRouter.get('/',uthMiddleware(), ApiProduct.FindAll);
productRouter.get('/:id',uthMiddleware(), ApiProduct.FindById);
productRouter.post('/',uthMiddleware(), ApiProduct.Create);
productRouter.put('/:id',uthMiddleware(), ApiProduct.Update);
productRouter.delete('/:id',uthMiddleware(), ApiProduct.Delete);

module.exports = productRouter;