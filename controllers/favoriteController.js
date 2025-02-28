const { getFavoritesByUser, addFavorite, removeFavorite } = require('../models/favoriteModel');

const getFavorites = async (req, res) => {
    const { userId } = req.user; 

    if (!userId) {
        return res.status(400).json({ message: "Usuario no autenticado" });
    }

    try {
        const favorites = await getFavoritesByUser(userId);
        res.status(200).json(favorites);
    } catch (err) {
        res.status(500).json({ message: "Error obteniendo favoritos", error: err.message });
    }
};

const addFavoriteHandler = async (req, res) => {
    const { userId } = req.user;
    const { productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: "Datos insuficientes" });
    }

    try {
        await addFavorite(userId, productId);
        res.status(201).json({ message: "Producto añadido a favoritos" });
    } catch (err) {
        res.status(500).json({ message: "Error al agregar a favoritos", error: err.message });
    }
};

const removeFavoriteHandler = async (req, res) => {
    const { userId } = req.user;
    const { productId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "Usuario no autenticado" });
    }

    try {
        await removeFavorite(userId, productId);
        res.status(200).json({ message: "Producto eliminado de favoritos" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar de favoritos", error: err.message });
    }
};

module.exports = { getFavorites, addFavoriteHandler, removeFavoriteHandler };