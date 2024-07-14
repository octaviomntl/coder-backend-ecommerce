// src/middleware/purchaseRestriction.js
const Product = require('../models/product.model');

const purchaseRestriction = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send('Usuario no autenticado.');
    }

    if (user.role === 'admin') {
      return res.status(403).send('Los administradores no pueden comprar productos.');
    }

    const productId = req.body.productId || req.params.productId;
    if (!productId) {
      return next();
    }

    const product = await Product.findById(productId).populate('owner');
    if (!product) {
      return res.status(404).send('Producto no encontrado.');
    }

    if (user.role === 'premium' && product.owner._id.toString() === user._id.toString()) {
      return res.status(403).send('No puedes comprar tu propio producto.');
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor.');
  }
};

module.exports = purchaseRestriction;
