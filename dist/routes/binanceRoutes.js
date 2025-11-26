"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binanceRouter = void 0;
const express_1 = require("express");
const binanceP2PService_1 = require("../services/binanceP2PService");
exports.binanceRouter = (0, express_1.Router)();
// GET /api/binance/usdt-p2p
// Se pueden recibir query params en el futuro, por ejemplo: ?fiat=VES&asset=USDT
exports.binanceRouter.get('/usdt-p2p', async (req, res) => {
    try {
        const asset = req.query.asset || 'USDT';
        const fiat = req.query.fiat || 'VES';
        const data = await (0, binanceP2PService_1.getBinanceUsdtP2PPrice)({ asset, fiat });
        res.json(data);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error en /api/binance/usdt-p2p:', error?.message ?? error);
        res.status(500).json({
            error: 'Error obteniendo precio USDT P2P en Binance',
        });
    }
});
