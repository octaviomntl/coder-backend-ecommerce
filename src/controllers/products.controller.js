const Product = require('../models/product.model');
const transporter = require('../config/nodemailer');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('catalog', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener productos');
    }
};

// Agregar un nuevo producto
exports.addProduct = async (req, res) => {
    const { name, price, description, owner } = req.body;

    const newProduct = new Product({
        name,
        price,
        description,
        owner
    });

    try {
        await newProduct.save();
        res.redirect('/products'); // Redirige a la lista de productos
    } catch (err) {
        console.error('Error al agregar producto:', err);
        res.status(500).send('Error al agregar producto.');
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        await product.remove();

        if (product.owner.role === 'premium') {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: product.owner.email,
                subject: 'Producto eliminado',
                text: `Tu producto "${product.name}" ha sido eliminado.`,
            });
        }

        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).send('Error al eliminar producto.');
    }
};