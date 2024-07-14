const Cart = require('../models/cart.model');

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.session.user._id });
    res.render('cart', { cart });
};


// Función para verificar si un usuario puede comprar un producto
const canPurchase = (user, product) => {
    if (user.role === 'admin') {
        return false; // Los administradores no pueden comprar productos
    }
    if (user.role === 'premium' && product.owner.equals(user._id)) {
        return false; // Los usuarios premium no pueden comprar sus propios productos
    }
    return true; // En todos los demás casos, se permite la compra
};

exports.addToCart = async (req, res) => {
    try {
        // Aplicar el middleware antes de continuar
        await checkPurchasePermissions(req, res, async () => {
            const { productId, quantity } = req.body;
            const cart = await Cart.findOne({ user: req.session.user._id });

            if (!cart) {
                const newCart = new Cart({ user: req.session.user._id, items: [{ product: productId, quantity }] });
                await newCart.save();
            } else {
                const item = cart.items.find(item => item.product.toString() === productId);
                if (item) {
                    item.quantity += quantity;
                } else {
                    cart.items.push({ product: productId, quantity });
                }
                await cart.save();
            }

            // Redirigir al carrito después de agregar producto
            res.redirect('/cart');
        });
    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        res.status(500).send('Error interno del servidor');
    }
};