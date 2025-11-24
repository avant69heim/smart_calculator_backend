const express = require('express');
const bcvRoutes = require('./routes/bcvRoutes');
const binanceRoutes = require('./routes/binanceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use('/api/bcv', bcvRoutes);
app.use('/api/binance', binanceRoutes);

// Healthcheck simple
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Smart Calculator Backend funcionando',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
