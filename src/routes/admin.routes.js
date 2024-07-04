const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAdmin } = require('../middleware/authorization');

// Vista de administración
router.get('/', isAdmin, adminController.getAdminDashboard);

// Gestión de usuarios (solo accesible por el administrador)
router.get('/users', isAdmin, adminController.getUserManagement);
router.put('/users/:userId', isAdmin, adminController.updateUserRole);
router.delete('/users/:userId', isAdmin, adminController.deleteUser);

// Gestión de productos (solo accesible por el administrador)
router.delete('/products/:productId', isAdmin, adminController.deleteProduct);

module.exports = router;