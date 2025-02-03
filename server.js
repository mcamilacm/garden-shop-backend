console.log('Iniciando aplicación...');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./db');

console.log('Configuraciones cargadas correctamente');

const app = express();
const PORT = process.env.PORT || 4000;

console.log('Configurando middlewares...');
app.use(cors());
app.use(express.json());

console.log('Configurando rutas...');
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

app.get('/products', async (req, res) => {
  console.log('Endpoint /products invocado');
  try {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Error al consultar productos:', error.message);
      res.status(400).json({ message: 'Error al consultar productos', error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error interno del servidor:', err.message);
    res.status(500).json({
      message: 'Error interno del servidor al consultar productos',
      error: err.message,
    });
  }
});

console.log('Iniciando servidor...');
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
