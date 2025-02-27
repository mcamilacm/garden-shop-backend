const express = require("express");
const cors = require("cors");
require("dotenv").config();
const supabase = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes"); 

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/favorites", favoritesRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});