/**
 * Rutas para precios Binance P2P
 * Accesibles vía: /api/calculator/binance/*
 *
 * Gateway quita /api/calculator, estas rutas solo manejan /binance/*
 */

import { Router } from 'express';
import {
  getBinanceP2PController,
  getBinanceHistoryController,
} from '../controllers/binanceController';

export const binanceRouter = Router();

/**
 * GET /api/calculator/binance/usdt-p2p (vía Gateway)
 * Obtiene precio actual de USDT en mercado P2P de Binance
 * Query params: asset (default: USDT), fiat (default: VES)
 */
binanceRouter.get('/usdt-p2p', getBinanceP2PController);

/**
 * GET /api/calculator/binance/history (vía Gateway)
 * Obtiene historial de precios P2P
 * Query params: asset, fiat, limit, page
 */
binanceRouter.get('/history', getBinanceHistoryController);
