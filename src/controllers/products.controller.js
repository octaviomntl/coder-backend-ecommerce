const Product = require('../models/product.model');
const User = require('../models/user.model');
const transporter = require('../config/nodemailer');
const { ObjectId } = require('mongoose').Types;

// Obtener todos los productos y renderizar la vista de gestión de productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener productos');
    }
};

// Agregar un nuevo producto
exports.addProduct = async (req, res) => {
    const { name, price, description } = req.body;

    const newProduct = new Product({
        name,
        price,
        description,
        owner: req.user._id
    });

    try {
        await newProduct.save();
        req.flash('success', 'Producto agregado exitosamente');
        res.redirect('/admin/productManager'); // Redirigir a productManager después de agregar
    } catch (err) {
        console.error('Error al agregar producto:', err);
        req.flash('error', 'Error al agregar producto.');
        res.redirect('/admin/productManager'); // Redirigir a productManager en caso de error
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Eliminar el producto por su ID
        await Product.deleteOne({ _id: productId });

        // Obtener el producto antes de eliminar para obtener el usuario propietario
        const product = await Product.findById(productId);
        
        if (!product) {
            req.flash('error', 'Producto no encontrado');
            return res.redirect('/admin/productManager');
        }

        const user = await User.findById(product.owner);

        // Enviar correo si el usuario es premium
        if (user && user.role === 'premium') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Producto eliminado',
                text: `Tu producto "${product.name}" ha sido eliminado.`,
            };

            await transporter.sendMail(mailOptions);
        }

        // Redirigir después de eliminar

    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ error: 'Error al eliminar producto' });
     
    }
};