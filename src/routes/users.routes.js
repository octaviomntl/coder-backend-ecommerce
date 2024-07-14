const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const { isAdmin } = require('../middleware/authMiddleware');

// Ruta para obtener todos los usuarios 
router.get('/', isAdmin, userController.getAllUsers);

// Ruta para eliminar usuarios inactivos
router.delete('/', isAdmin, userController.deleteInactiveUsers);

// Ruta para actualizar rol de un usuario
router.post('/:id', isAdmin, userController.updateUserRole);

// Ruta para eliminar un usuario
router.post('/delete/:id', isAdmin, userController.deleteUser);

// Rutas de usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener usuarios.');
    }
});


module.exports = router;