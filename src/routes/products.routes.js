const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');


// Obtener todos los productos
router.get('/', productsController.getAllProducts);

// Agregar un nuevo producto
router.post('/add', productsController.addProduct);

// Eliminar un producto
router.delete('/:productId', productsController.deleteProduct);

module.exports = router;