const express = require("express");
const { getFavorites, addFavoriteHandler, removeFavoriteHandler } = require("../controllers/favoriteController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", authenticateToken, getFavorites);
router.post("/", authenticateToken, addFavoriteHandler);
router.delete("/:productId", authenticateToken, removeFavoriteHandler);

module.exports = router;