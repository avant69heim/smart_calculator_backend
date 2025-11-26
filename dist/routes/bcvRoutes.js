"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcvRouter = void 0;
const express_1 = require("express");
const bcvService_1 = require("../services/bcvService");
exports.bcvRouter = (0, express_1.Router)();
// GET /api/bcv/rates
exports.bcvRouter.get('/rates', async (_req, res) => {
    try {
        const data = await (0, bcvService_1.getBcvRates)();
        res.json(data);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error en /api/bcv/rates:', error?.message ?? error);
        res.status(500).json({
            error: 'Error obteniendo tasas del BCV',
        });
    }
});
