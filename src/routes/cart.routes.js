const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Ruta para ver el carrito
router.get('/', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.render('cart', { cart });
});

// Ruta para agregar productos al carrito
router.post('/add', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    const product = await Product.findById(productId);

    if (cart) {
        const item = cart.items.find(item => item.product.toString() === productId);
        if (item) {
            item.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    } else {
        await Cart.create({
            user: req.user._id,
            items: [{ product: productId, quantity }]
        });
    }

    res.redirect('/cart');
});

module.exports = router;