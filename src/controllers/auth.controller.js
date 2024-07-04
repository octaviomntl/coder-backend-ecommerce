const bcrypt = require('bcrypt');
const User = require('../models/user.model');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'user' });
    await user.save();
    res.redirect('/login');
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};