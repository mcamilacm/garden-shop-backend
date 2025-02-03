
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./db');


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/products', async (req, res) => {
 try {
   const { data, error } = await supabase
     .from('products')
     .select('*');

   if (error) {
     res.status(400).json({ message: 'Error al consultar productos', error: error.message });
     return;
   }

   res.status(200).json(data);
 } catch (err) {
   res.status(500).json({
     message: 'Error interno del servidor al consultar productos',
     error: err.message,
   });
 }
});

app.listen(PORT, () => {
 console.log(`Servidor corrieendo en el puerto ${PORT}`);
});
