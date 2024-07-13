const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models/user.model'); // Asegúrate de que esta ruta sea correcta
const bcrypt = require('bcrypt');
const flash = require('express-flash');

// Ruta de inicio de sesión (GET)
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

// Ruta de inicio de sesión (POST)
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// Ruta de registro (GET)
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta de registro (POST)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validar que el correo no esté ya registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        req.flash('error', 'El correo ya está registrado.');
        return res.redirect('/auth/register');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'user' // Rol por defecto
    });

    try {
        await newUser.save();
        res.redirect('/auth/login'); // Redirigir a la página de inicio de sesión
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar usuario.');
    }
});

// Ruta de cierre de sesión (GET)
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;