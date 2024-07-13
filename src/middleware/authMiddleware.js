const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.redirect('/login');
};

const isUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'user') {
    return next();
  }
  res.redirect('/login');
};

module.exports = { isLoggedIn, isAdmin, isUser };