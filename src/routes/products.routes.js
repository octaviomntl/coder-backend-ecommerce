const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

router.get('/', productsController.getAllProducts);
router.delete('/:productId', productsController.deleteProduct);

module.exports = router;