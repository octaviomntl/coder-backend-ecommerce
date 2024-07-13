require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGO_URI,
    emailUser: process.env.NODEMAILER_USER,
    emailPass: process.env.NODEMAILER_PASS,
    secretKey: process.env.SECRET_KEY, 
    sessionSecret: process.env.SESSION_SECRET
};