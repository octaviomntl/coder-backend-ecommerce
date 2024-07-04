const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { isAdmin } = require('../middleware/authorization');

// Obtener todos los usuarios
router.get('/', usersController.getUsers);

// Eliminar usuarios inactivos (solo accesible por el administrador)
router.delete('/', isAdmin, usersController.deleteInactiveUsers);

module.exports = router;