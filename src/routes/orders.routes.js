const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const { isLoggedIn } = require('../middleware/authMiddleware');
const purchaseController = require('../controllers/purchase.controller');

router.get('/', isLoggedIn, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product');
        res.render('orders', { orders });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las órdenes.');
    }
});


// Ruta para comprar un producto específico
router.post('/purchase/:productId', purchaseController.purchaseProduct);

module.exports = router;

