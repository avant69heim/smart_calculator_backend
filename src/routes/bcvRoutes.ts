/**
 * Rutas para tasas BCV
 * Accesibles vía: /api/calculator/bcv/*
 *
 * Gateway quita /api/calculator, estas rutas solo manejan /bcv/*
 */

import { Router } from 'express';
import {
  getBcvRatesController,
  getBcvHistoryController,
} from '../controllers/bcvController';

export const bcvRouter = Router();

/**
 * GET /api/calculator/bcv/rates (vía Gateway)
 * Obtiene tasas actuales del BCV (USD/VES y EUR/VES)
 */
bcvRouter.get('/rates', getBcvRatesController);

/**
 * GET /api/calculator/bcv/history (vía Gateway)
 * Obtiene historial de tasas BCV
 * Query params: limit, page
 */
bcvRouter.get('/history', getBcvHistoryController);
