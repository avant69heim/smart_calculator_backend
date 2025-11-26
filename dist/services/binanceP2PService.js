"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinanceUsdtP2PPrice = getBinanceUsdtP2PPrice;
const axios_1 = __importDefault(require("axios"));
async function getBinanceUsdtP2PPrice({ asset = 'USDT', fiat = 'VES', } = {}) {
    // Endpoint interno usado por la web de Binance P2P (no oficial)
    const baseUrl = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';
    // Body mínimo típico para Binance P2P (puedes ajustar filtros luego)
    const body = {
        page: 1,
        rows: 10,
        payTypes: [],
        asset,
        tradeType: 'BUY',
        fiat,
        publisherType: null,
    };
    const response = await axios_1.default.post(baseUrl, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = response.data;
    if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('La respuesta de Binance P2P no contiene anuncios en data[]');
    }
    const firstAd = data.data[0];
    const priceStr = firstAd?.adv?.price;
    if (!priceStr) {
        throw new Error('No se encontró el campo adv.price en el primer anuncio de Binance P2P');
    }
    const price = parseFloat(priceStr);
    return {
        asset,
        fiat,
        price,
        source: 'Binance P2P',
    };
}
