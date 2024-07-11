const User = require('../models/user.model');
const nodemailer = require('nodemailer');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'nombre correo rol'); // Obtener solo nombre, correo y rol
        res.render('admin/adminUserManagement', { users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Eliminar usuarios inactivos
exports.deleteInactiveUsers = async (req, res) => {
    try {
        const cutoffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });
        const result = await User.deleteMany({ lastLogin: { $lt: twoDaysAgo } });

        inactiveUsers.forEach(user => {
            const mailOptions = {
                from: process.env.EMAIL,
                to: user.correo,
                subject: 'Cuenta Eliminada por Inactividad',
                text: `Hola ${user.nombre}, tu cuenta ha sido eliminada debido a la inactividad en los últimos 2 días.`
            };
            nodemailer.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error al enviar correo:', err);
                } else {
                    console.log('Correo enviado:', info.response);
                }
            });
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
        const newRole = req.body.rol;

        const user = await User.findByIdAndUpdate(userId, { rol: newRole }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.redirect('/admin/users'); // Redirigir a la vista de gestión de usuarios
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

        res.redirect('/admin/users'); // Redirigir a la vista de gestión de usuarios
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar usuario.' });
    }
};