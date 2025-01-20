
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
