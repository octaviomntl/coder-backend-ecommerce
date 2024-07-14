const User = require('../models/user.model');
const Product = require('../models/product.model');

exports.getAdminDashboard = (req, res) => {
    res.render('admin/dashboard');
};

exports.getUserManagement = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.render('admin/userManagement', { users });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};


exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        await User.findByIdAndUpdate(userId, { role });

    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar rol del usuario' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);

    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};


// Obtener la vista de gestión de productos
exports.getProductManagement = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/productManagement', { products });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Eliminar directamente por ID
        await Product.findByIdAndRemove(productId);

        // Obtener el usuario asociado al producto
        const product = await Product.findById(productId);
        const user = await User.findById(product.owner);

        // Enviar correo si el usuario es premium
        if (user.role === 'premium') {
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

    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};