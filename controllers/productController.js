const { getAllProducts } = require('../models/productModel');

const getProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error obteniendo productos', error: err.message });
    }
};

module.exports = { getProducts };