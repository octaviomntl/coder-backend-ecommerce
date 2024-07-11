const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const { isAdmin } = require('../middleware/authorization');

// Ruta para obtener todos los usuarios y renderizar la vista de gestión de usuarios
router.get('/', isAdmin, userController.getAllUsers);

// Ruta para eliminar usuarios inactivos
router.delete('/', isAdmin, userController.deleteInactiveUsers);

// Ruta para actualizar rol de un usuario
router.post('/:id', isAdmin, userController.updateUserRole);

// Ruta para eliminar un usuario
router.post('/delete/:id', isAdmin, userController.deleteUser);

module.exports = router;