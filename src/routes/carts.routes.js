const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { createOrder } = require('../controllers/order.controller'); 
const { isLoggedIn, isUser } = require('../middleware/authMiddleware');
const cartsController = require('../controllers/carts.controller');

// Ver carrito
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.render('cart', { cart });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el carrito.');
    }
});


router.post('/add', isUser, cartsController.addToCart);
router.get('/', isUser, cartsController.getCart);


// Añadir un producto al carrito
router.post('/add', isLoggedIn, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        if (cart) {
            const item = cart.items.find(item => item.product.toString() === productId);
            if (item) {
                item.quantity += Number(quantity);
            } else {
                cart.items.push({ product: productId, quantity: Number(quantity) });
            }
            await cart.save();
        } else {
            await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity: Number(quantity) }]
            });
        }

        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar el producto al carrito.');
    }
});

// Eliminar un producto del carrito
router.post('/remove', isLoggedIn, async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el producto del carrito.');
    }
});

// Proceso de compra
router.post('/checkout', isLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        // Lógica de pago y creación de la orden
        await createOrder(req.user._id, cart.items);

        // Vacía el carrito después del checkout
        cart.items = [];
        await cart.save();

        res.redirect('/orders');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al procesar el checkout.');
    }
});

module.exports = router;