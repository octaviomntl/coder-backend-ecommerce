const Order = require('../models/order.model');

const createOrder = async (userId, items) => {
    try {
        const newOrder = new Order({
            user: userId,
            items: items,
        });
        await newOrder.save();
    } catch (err) {
        console.error('Error al crear la orden:', err);
        throw err;
    }
};

module.exports = { createOrder };