/**
 * Controlador para tasas BCV
 * Obtiene datos desde la base de datos (actualizados por cron job)
 */

import { Request, Response } from 'express';
import { getRateHistoryModel } from '../models/RateHistory.model';

/**
 * GET /api/calculator/bcv/rates
 * Obtiene las tasas BCV más recientes desde la base de datos
 * Los datos son actualizados automáticamente cada hora por cron job
 */
export const getBcvRatesController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const RateHistory = getRateHistoryModel();

    // Obtener el registro más reciente
    const latestRate = await RateHistory
      .findOne()
      .sort({ createdAt: -1 })
      .exec();

    if (!latestRate) {
      res.status(404).json({
        error: 'No hay datos disponibles. El sistema se está inicializando.',
      });
      return;
    }

    // Responder con el mismo formato que antes
    res.json({
      usd: latestRate.usd,
      eur: latestRate.eur,
      source: latestRate.source,
      lastUpdateUsd: latestRate.lastUpdateUsd,
      lastUpdateEur: latestRate.lastUpdateEur,
      // Información adicional útil
      fetchedAt: latestRate.createdAt,
    });
  } catch (error: any) {
    console.error('Error en /api/calculator/bcv/rates:', error?.message ?? error);
    res.status(500).json({
      error: 'Error obteniendo tasas del BCV',
    });
  }
};

/**
 * GET /api/bcv/history
 * Obtiene historial de tasas BCV
 */
export const getBcvHistoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const RateHistory = getRateHistoryModel();

    // Parámetros de query
    const limit = parseInt(req.query.limit as string) || 100;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Obtener historial ordenado por fecha descendente
    const history = await RateHistory
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await RateHistory.countDocuments().exec();

    res.json({
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error en /api/bcv/history:', error?.message ?? error);
    res.status(500).json({
      error: 'Error obteniendo historial de tasas',
    });
  }
};
