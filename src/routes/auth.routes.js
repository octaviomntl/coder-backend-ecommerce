const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models/user.model'); 
const bcrypt = require('bcrypt');
const authController = require('../controllers/auth.controller');

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

// Ruta para el formulario de registro (GET)
router.get('/register', authController.showRegisterForm);

// Ruta para procesar el registro (POST)
router.post('/register', authController.registerUser);

// Ruta de registro (POST)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validar que el correo no esté ya registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        req.flash('error', 'El correo ya está registrado.');
        return res.redirect('/register');
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
        res.redirect('/login'); // Redirigir a la página de inicio de sesión
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar usuario.');
    }
});

// Ruta de logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

module.exports = router;