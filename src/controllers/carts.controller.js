const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

exports.getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.session.user._id });
    res.render('cart', { cart });
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = req.user;

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        // Verificar si el usuario es admin
        if (user.role === 'admin') {
            return res.status(403).send('Los administradores no pueden agregar productos al carrito');
        }

        // Verificar si el usuario premium intenta agregar su propio producto
        if (user.role === 'premium' && product.owner.equals(user._id)) {
            return res.status(403).send('No puedes agregar tus propios productos al carrito');
        }

        // Obtener el carrito del usuario
        let cart = await Cart.findOne({ user: user._id });

        if (!cart) {
            cart = new Cart({ user: user._id, items: [{ product: productId, quantity }] });
        } else {
            const item = cart.items.find(item => item.product.toString() === productId);
            if (item) {
                item.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        res.status(500).send('Error interno del servidor');
    }
};