const User = require('../models/user.model');
const nodemailer = require('nodemailer');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.deleteInactiveUsers = async (req, res) => {
    try {
        const cutoffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const usersToDelete = await User.find({ lastLogin: { $lt: cutoffDate } });

        for (const user of usersToDelete) {
            // Enviar correo de eliminación
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
                subject: 'Cuenta eliminada por inactividad',
                text: 'Tu cuenta ha sido eliminada por inactividad.',
            };

            await transporter.sendMail(mailOptions);

            await user.remove();
        }

        res.json({ message: 'Usuarios inactivos eliminados' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
};