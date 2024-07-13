require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { engine } = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('./src/config/passport');
const { isLoggedIn, isAdmin, isUser } = require('./src/middleware/authMiddleware');
const config = require('./src/config/variablesEntorno');
const helpers = require('./src/helpers/handlebars-helpers');

const app = express();
const port = process.env.PORT || 3000;

// Configurar el motor de vistas
app.engine('handlebars', engine({
  helpers: helpers,
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
      getProtoProperty: function(obj, prop) {
          return obj[prop];
      }
  }
}),
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './src/views'));

// Middleware para parsear el cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: config.mongodbUri }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 semana
  }
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
app.use('/api/carts', isUser, require('./src/routes/carts.routes')); // Asegúrate de que la ruta esté registrada
app.use('/products', require('./src/routes/products.routes'));
app.use('/users', require('./src/routes/users.routes'));
app.use('/cart', isUser, require('./src/routes/carts.routes'));
app.use('/auth', require('./src/routes/auth.routes'));

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('home'); 
});

// Ruta de login (GET)
app.get('/login', (req, res) => {
  res.render('login');
});

// Ruta de inicio de sesión (POST)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true,
  successMessage: 'Has iniciado sesión con éxito'  
}), (req, res) => {
  console.log('User authenticated:', req.user);  
});

// Ruta de logout
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

// Manejo datos del usuario en las vistas
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});