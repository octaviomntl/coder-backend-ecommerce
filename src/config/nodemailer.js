const nodemailer = require('nodemailer');
const config = require('./variablesEntorno'); // Asegúrate de que la ruta es correcta

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.emailUser,
        pass: config.emailPass,
    },
});

module.exports = transporter;