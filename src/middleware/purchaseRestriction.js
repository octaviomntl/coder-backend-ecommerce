const Product = require('../models/product.model'); // Ajusta el path según tu estructura

const purchaseRestriction = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(`Usuario intentando comprar: ${user._id}, Rol: ${user.role}`); // Log de usuario

    if (!user) {
      console.log('Usuario no autenticado.');
      return res.status(401).send('Usuario no autenticado.');
    }

    if (user.role === 'admin') {
      console.log('Compra denegada para administradores.');
      return res.status(403).send('Los administradores no pueden comprar productos.');
    }

    const productId = req.body.productId || req.params.productId;
    if (!productId) {
      return next();
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.log('Producto no encontrado.');
      return res.status(404).send('Producto no encontrado.');
    }

    if (product.owner.toString() === user._id.toString()) {
      console.log('Compra denegada para el dueño del producto.');
      return res.status(403).send('No puedes comprar tu propio producto.');
    }

    console.log('Compra permitida.');
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor.');
  }
};

module.exports = purchaseRestriction;