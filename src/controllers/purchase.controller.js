const Product = require('../models/product.model');
const User = require('../models/user.model');

// Controlador para realizar una compra
exports.purchaseProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado.');
        }
        // Validar que el usuario no sea administrador ni el propietario del producto si es premium
        if (user.role === 'admin') {
            req.flash('error', 'Los administradores no pueden realizar compras.');
            return res.redirect('/products');
        }

        if (user.role === 'premium' && product.owner.equals(userId)) {
            req.flash('error', 'No puedes comprar tu propio producto si eres usuario premium.');
            return res.redirect('/products');
        }

        // Lógica para procesar la compra 

        req.flash('success', 'Compra realizada exitosamente.');
        res.redirect('/products');
    } catch (err) {
        console.error('Error al realizar la compra:', err);
        req.flash('error', 'Error al realizar la compra.');
        res.redirect('/products');
    }
};