// controllers/purchaseController.js
const Product = require('../models/product.model');

exports.purchaseProduct = async (req, res) => {
  try {
    const user = req.user;
    const productId = req.params.productId;

    const product = await Product.findById(productId).populate('owner');
    if (!product) {
      req.flash('error', 'Producto no encontrado.');
      return res.redirect('/products');
    }

    if (user.role === 'admin') {
      req.flash('error', 'Los administradores no pueden realizar compras.');
      return res.redirect('/products');
    }

    if (user.role === 'premium' && product.owner._id.equals(user._id)) {
      req.flash('error', 'No puedes comprar tu propio producto.');
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
