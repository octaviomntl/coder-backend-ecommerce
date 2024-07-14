const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const productsController = require('../controllers/products.controller');
const { isAdmin } = require('../middleware/authMiddleware');

// Ruta para la gestión de productos por admin
router.get('/productManager', isAdmin, adminController.getProductManagement);
router.post('/products/add', isAdmin, productsController.addProduct);
router.delete('/products/:productId', isAdmin, productsController.deleteProduct);


// Ruta para la vista de administración de productos
router.get('/productManager', productsController.getAllProducts);

// Ruta para el dashboard de administración
router.get('/dashboard', isAdmin, adminController.getAdminDashboard);

// Ruta para obtener la vista de gestión de usuarios
router.get('/userManagement', adminController.getUserManagement);

// Ruta para actualizar el rol de un usuario
router.post('/users/:userId', adminController.updateUserRole);

// Ruta para eliminar un usuario
router.post('/users/:userId/delete', adminController.deleteUser);

module.exports = router;
