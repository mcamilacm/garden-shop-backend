const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


app.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      return res.status(400).json({ message: 'Error al consultar productos', error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
});


app.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, birth_date, city } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const { data: existingUser, error: emailCheckError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    if (emailCheckError) {
      throw emailCheckError;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ first_name, last_name, email, password: hashedPassword, birth_date, city }])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: data[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) return res.status(500).json({ message: "Error en la base de datos" });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ 
      message: "Login exitoso",
      token,
      user: { userId: user.user_id, email: user.email, name: user.first_name }
    });
  } catch (err) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});
app.get("/favorites", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Usuario no autenticado" });

  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", userId);

  if (error) return res.status(500).json({ message: "Error obteniendo favoritos" });

  res.status(200).json(data.map((fav) => fav.product_id));
});


app.post("/favorites", async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId) return res.status(400).json({ message: "Usuario no autenticado" });

  const { error } = await supabase
    .from("favorites")
    .insert([{ user_id: userId, product_id: productId }]);

  if (error) return res.status(500).json({ message: "Error al agregar a favoritos" });

  res.status(201).json({ message: "Producto añadido a favoritos" });
});


app.delete("/favorites/:productId", async (req, res) => {
  const { userId } = req.query;
  const { productId } = req.params;

  if (!userId) return res.status(400).json({ message: "Usuario no autenticado" });

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) return res.status(500).json({ message: "Error al eliminar de favoritos" });

  res.status(200).json({ message: "Producto eliminado de favoritos" });
});

/** 🔹 INICIAR EL SERVIDOR */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});