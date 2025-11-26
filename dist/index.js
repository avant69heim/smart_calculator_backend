"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcvRoutes_1 = require("./routes/bcvRoutes");
const binanceRoutes_1 = require("./routes/binanceRoutes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Rutas
app.use('/api/bcv', bcvRoutes_1.bcvRouter);
app.use('/api/binance', binanceRoutes_1.binanceRouter);
// Healthcheck simple
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Smart Calculator Backend funcionando',
    });
});
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
