require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars').create({ defaultLayout: 'main' });
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('./src/config/passport');
const { isLoggedIn, isAdmin, isUser } = require('./src/middleware/authMiddleware');
const config = require('./src/config/variablesEntorno');

const app = express();
const port = process.env.PORT || 3000;

// Configurar el motor de vistas
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './src/views'));

// Middleware para parsear el cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'CoderSessionSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: config.mongodbUri })
}));

// Inicialización de Passport y sesión
app.use(passport.initialize());
app.use(passport.session());

// Configurar express-flash
app.use(flash());

// Conexión a MongoDB
mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas y Middleware
app.use('/', require('./src/routes/auth.routes')); // Ajusta la ruta según tu estructura
app.use('/admin', isAdmin, require('./src/routes/admin.routes'));
app.use('/carts', isUser, require('./src/routes/carts.routes'));
app.use('/products', require('./src/routes/products.routes'));
app.use('/users', require('./src/routes/users.routes'));

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('home'); // Renderiza la vista "home.handlebars"
});

// Ruta de login (GET)
app.get('/login', (req, res) => {
  res.render('login');
});

// Ruta de login (POST)
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Ruta de logout
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});