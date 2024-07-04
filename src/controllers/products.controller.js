const Product = require('../models/product.model');
const transporter = require('../config/nodemailer');

exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.render('catalog', { products });
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (product) {
        await product.remove();
        if (product.owner.role === 'premium') {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: product.owner.email,
                subject: 'Producto eliminado',
                text: `Tu producto "${product.name}" ha sido eliminado.`,
            });
        }
    }
    res.redirect('/admin/products');
};