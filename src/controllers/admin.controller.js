const User = require('../models/user.model');
const Product = require('../models/product.model');

exports.getAdminDashboard = (req, res) => {
    res.render('admin/dashboard');
};

exports.getUserManagement = async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin/users', { users });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        await User.findByIdAndUpdate(userId, { role });
        res.redirect('/admin/users');
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar rol del usuario' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.redirect('/admin/users');
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        const user = await User.findById(product.userId);

        await product.remove();

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
                text: 'Tu producto ha sido eliminado.',
            };

            await transporter.sendMail(mailOptions);
        }

        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
