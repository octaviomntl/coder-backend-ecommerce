
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars').create({ defaultLayout: 'main' })
const session = require('express-session');
const MongoStore = require('connect-mongo');
const config = require('./src/config/variablesEntorno');
const { isLoggedIn, isAdmin, isUser } = require('./src/middleware/authMiddleware');
const app = express();
const port = process.env.PORT || 3000;

// Configurar el motor de vistas y la ubicación de las vistas
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware para parsear el cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// // Configurar sesiones
// app.use(session({
//   secret: 'CoderSessionSecret',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl: config.mongodbUri })
// }));

// Conexión a MongoDB
mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas y Middleware
app.use('/admin', isAdmin, require('./src/routes/admin.routes'));
app.use('/carts', isUser, require('./src/routes/carts.routes'));
app.use('/products', require('./src/routes/products.routes'));
app.use('/users', require('./src/routes/users.routes'));

// Ruta de ejemplo para renderizar una vista
app.get('/', (req, res) => {
  res.render('home');  // Renderiza la vista "home.handlebars"
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});