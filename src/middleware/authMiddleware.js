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
  res.redirect('/');
}

// Middleware para verificar si el usuario es un usuario registrado
function isUser(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/auth/login');
}

module.exports = { isLoggedIn, isAdmin, isUser };