const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts.controller');

router.get('/', cartsController.getCart);
router.post('/add', cartsController.addToCart);

module.exports = router;