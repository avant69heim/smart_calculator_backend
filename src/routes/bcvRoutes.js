const express = require('express');
const { getBcvRates } = require('../services/bcvService');

const router = express.Router();

// GET /api/bcv/rates
router.get('/rates', async (req, res) => {
  try {
    const data = await getBcvRates();
    res.json(data);
  } catch (error) {
    console.error('Error en /api/bcv/rates:', error.message);
    res.status(500).json({
      error: 'Error obteniendo tasas del BCV',
    });
  }
});

module.exports = router;
