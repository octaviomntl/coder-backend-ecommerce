const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');  

// Ver carrito
router.get('/', async (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.render('cart', { cart });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el carrito.');
    }
});

// Añade un producto al carrito
router.post('/add', async (req, res) => {
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

// Proceso de compra
router.post('/checkout', async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart) {
    return res.redirect('/cart');
  }

  // Crea una nueva orden
  const order = new Order({
    user: req.user._id,
    items: cart.items
  });

  try {
    await order.save();

    // Vacia el carrito después del checkout
    cart.items = [];
    await cart.save();

    res.redirect('/orders'); // Redirige a la página de órdenes
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al procesar la compra.');
  }
});

module.exports = router;