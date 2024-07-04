const Cart = require('../models/cart.model');

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.session.user._id });
    res.render('cart', { cart });
};

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.session.user._id });
    if (cart) {
        const item = cart.items.find(item => item.product.toString() === productId);
        if (item) {
            item.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    } else {
        const newCart = new Cart({ user: req.session.user._id, items: [{ product: productId, quantity }] });
        await newCart.save();
    }
    res.redirect('/cart');
};