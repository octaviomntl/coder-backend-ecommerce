const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Mostrar formulario de registro
exports.showRegisterForm = (req, res) => {
  res.render('register');
};

// Procesar registro de usuario
exports.registerUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'El usuario ya existe.');
      return res.redirect('/auth/register');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user' // o 'premium' según sea necesario
    });

    await newUser.save();

    req.flash('success', 'Registro exitoso. Por favor, inicia sesión.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    req.flash('error', 'Error al registrar el usuario.');
    res.redirect('/auth/register');
  }
};
