const express = require('express');
const { getBinanceUsdtP2PPrice } = require('../services/binanceP2PService');

const router = express.Router();

// GET /api/binance/usdt-p2p
// Se pueden recibir query params en el futuro, por ejemplo: ?fiat=VES&asset=USDT
router.get('/usdt-p2p', async (req, res) => {
  try {
    const { asset = 'USDT', fiat = 'VES' } = req.query;
    const data = await getBinanceUsdtP2PPrice({ asset, fiat });
    res.json(data);
  } catch (error) {
    console.error('Error en /api/binance/usdt-p2p:', error.message);
    res.status(500).json({
      error: 'Error obteniendo precio USDT P2P en Binance',
    });
  }
});

module.exports = router;
