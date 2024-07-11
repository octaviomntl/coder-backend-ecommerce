const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Ver el carrito
router.get('/', async (req, res) => {
  const cart = await Cart.findOne({ user: req.session.user._id }).populate('items.product');
  res.render('cart', { cart });
});

// Añade un producto al carrito
router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.session.user._id });
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
      user: req.session.user._id,
      items: [{ product: productId, quantity }]
    });
  }

  res.redirect('/carts');
});

// Proceso de compra
router.post('/checkout', async (req, res) => {
  const cart = await Cart.findOne({ user: req.session.user._id }).populate('items.product');

  if (!cart) {
    return res.redirect('/carts');
  }

  // Procesar el pago y crear la orden
  // Aquí se implementaría la lógica de pago y creación de la orden

  // Vacia el carrito después del checkout
  cart.items = [];
  await cart.save();

  res.redirect('/orders'); // Redirige a una página de órdenes o similar
});

module.exports = router;