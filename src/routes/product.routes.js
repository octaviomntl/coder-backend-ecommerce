const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const purchaseRestriction = require('../middleware/purchaseRestriction');
const purchaseController = require('../controllers/purchaseController');

// Rutas de productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener productos.');
    }
});

router.post('/add-to-cart/:productId', purchaseRestriction, purchaseController.purchaseProduct);


module.exports = router;