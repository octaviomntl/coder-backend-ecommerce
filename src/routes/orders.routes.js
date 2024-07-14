const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.get('/', isLoggedIn, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product');
        res.render('orders', { orders });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las órdenes.');
    }
});

module.exports = router;