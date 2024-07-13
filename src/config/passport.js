const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Estrategia Local
passport.use(new LocalStrategy(
    {
        usernameField: 'email',  // El campo del formulario de login que Passport usará como nombre de usuario
        passwordField: 'password'  // El campo del formulario de login que Passport usará como contraseña
    },
    async (email, password, done) => {
        try {
            // Buscar al usuario por el email
            const user = await User.findOne({ email });

            // Si el usuario no existe, devolver un mensaje de error
            if (!user) {
                return done(null, false, { message: 'Correo no registrado' });
            }

            // Verificar la contraseña
            const match = await bcrypt.compare(password, user.password);

            // Si la contraseña no es correcta, devolver un mensaje de error
            if (!match) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            // Si el usuario existe y la contraseña es correcta, devolver el usuario
            return done(null, user);
        } catch (err) {
            // Manejar errores
            return done(err);
        }
    }
));

// Serialización del usuario
passport.serializeUser((user, done) => {
    done(null, user.id);  // Almacena el ID del usuario en la sesión
});

// Deserialización del usuario
passport.deserializeUser(async (id, done) => {
    try {
        // Encuentra al usuario por ID y devuelve el usuario
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        // Manejar errores
        done(err);
    }
});

module.exports = passport;