const mongoose = require('mongoose');
const Product = require('../src/models/product.model'); 

require('dotenv').config();

const mongodbUri = process.env.MONGO_URI; 

const products = [
    {
        name: "Producto 1",
        price: 100,
        description: "Descripción del Producto 1",
        owner: "6691971f2f2588f10fe49c24" 
    },
    {
        name: "Producto 2",
        price: 200,
        description: "Descripción del Producto 2",
        owner: "6691971f2f2588f10fe49c24" 
    },
    {
        name: "Producto 3",
        price: 150,
        description: "Descripción del Producto 3",
        owner: "6691971f2f2588f10fe49c24" 
    }
];

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        await Product.insertMany(products);
        console.log('Productos insertados con éxito');
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err);
    })
    .finally(() => {
        mongoose.connection.close();
    });