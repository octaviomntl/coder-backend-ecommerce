const User = require('../models/user.model');
const Product = require('../models/product.model');
const nodemailer = require('nodemailer');

const adminController = {
  getAdminDashboard(req, res) {
    res.render('admin/dashboard');
  },

  async getUserManagement(req, res) {
    try {
      const users = await User.find({}, 'name email role');
      res.render('admin/userManagement', { users });
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  async updateUserRole(req, res) {
    const userId = req.params.userId;
    const { role } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });

      if (!updatedUser) {
        return res.status(404).send('Usuario no encontrado');
      }

      res.redirect('/admin/userManagement');
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).send('Usuario no encontrado');
      }

      res.redirect('/admin/userManagement');
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  },

  async getProductManagement(req, res) {
    try {
      const products = await Product.find();
      res.render('admin/productManagement', { products });
    } catch (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      const deletedProduct = await Product.findByIdAndRemove(productId);

      if (!deletedProduct) {
        return res.status(404).send('Producto no encontrado');
      }

      const user = await User.findById(deletedProduct.owner);

      if (user && user.role === 'premium') {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Producto eliminado',
          text: `Tu producto "${deletedProduct.name}" ha sido eliminado.`,
        };

        await transporter.sendMail(mailOptions);
      }

      res.redirect('/admin/productManager');
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  },
};

module.exports = adminController;
