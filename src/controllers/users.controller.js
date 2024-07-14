const User = require('../models/user.model');
const transporter = require('../config/nodemailer'); // Asegúrate de que la ruta es correcta

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Eliminar usuarios inactivos
exports.deleteInactiveUsers = async (req, res) => {
    try {
        const cutoffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Configuración tiempo inactivo
        const inactiveUsers = await User.find({ lastLogin: { $lt: cutoffDate } });
        const result = await User.deleteMany({ lastLogin: { $lt: cutoffDate } });

        inactiveUsers.forEach(async (user) => {
            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email, 
                subject: 'Cuenta Eliminada por Inactividad',
                text: `Hola ${user.name}, tu cuenta ha sido eliminada debido a la inactividad en los últimos 2 días.`
            };
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Correo enviado:', info.response);
            } catch (err) {
                console.error('Error al enviar correo:', err);
            }
        });

        res.json({ message: `Se eliminaron ${result.deletedCount} usuarios por inactividad.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
};

// Actualizar rol del usuario
exports.updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const newRole = req.body.role;

        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar rol del usuario.' });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar usuario.' });
    }
};