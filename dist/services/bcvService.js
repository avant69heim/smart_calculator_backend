"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBcvRates = getBcvRates;
const axios_1 = __importDefault(require("axios"));
async function getBcvRates() {
    // Usamos la API pública open.er-api.com para obtener USD/VES y EUR/VES
    const usdUrl = 'https://open.er-api.com/v6/latest/USD';
    const eurUrl = 'https://open.er-api.com/v6/latest/EUR';
    // Ejecutamos ambas peticiones en paralelo
    const [usdResponse, eurResponse] = await Promise.all([
        axios_1.default.get(usdUrl),
        axios_1.default.get(eurUrl),
    ]);
    const usdData = usdResponse.data;
    const eurData = eurResponse.data;
    if (!usdData?.rates?.VES || !eurData?.rates?.VES) {
        throw new Error('La respuesta de open.er-api.com no contiene rates.VES');
    }
    const usdRate = usdData.rates.VES;
    const eurRate = eurData.rates.VES;
    return {
        usd: usdRate,
        eur: eurRate,
        source: 'open.er-api.com',
        lastUpdateUsd: usdData.time_last_update_utc || null,
        lastUpdateEur: eurData.time_last_update_utc || null,
    };
}
