const User = require('../models/user.model');

exports.getCurrentUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
      try {
          const currentUser = await User.findById(req.session.userId);
          if (currentUser) {
              req.currentUser = currentUser;
          }
      } catch (err) {
          console.error('Error al obtener usuario actual:', err);
      }
  }
  next();
}

// Middleware para verificar si el usuario está autenticado
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/auth/login');
}

// Middleware para verificar si el usuario es admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
      return next();
  }
  req.flash('error', 'No tienes permiso para acceder a esta página.');
  res.redirect('/login');
}

// Middleware para verificar si el usuario es un usuario registrado
function isUser(req, res, next) {
  if (req.user) {
      return next();
  }
  res.redirect('/auth/login');
}

module.exports = { isLoggedIn, isAdmin, isUser };