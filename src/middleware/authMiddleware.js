const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  };
  
  const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      res.status(403).send('Access denied');
    }
  };
  
  const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
      next();
    } else {
      res.status(403).send('Access denied');
    }
  };
  
  module.exports = { isLoggedIn, isAdmin, isUser };