const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const handlebars = require('express-handlebars');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const passport = require('./config/passport');

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/users', require('./src/routes/users.routes'));
app.use('/api/products', require('./src/routes/products.routes'));
app.use('/api/carts', require('./src/routes/carts.routes'));
app.use('/admin', require('./src/routes/admin.routes'));

// Ruta principal
app.get('/', (req, res) => {
    res.render('home');
});

// Rutas de autenticación
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
