/**
 * Controlador para precios Binance P2P
 * Obtiene datos desde la base de datos (actualizados por cron job)
 */

import { Request, Response } from 'express';
import { getCryptoPriceHistoryModel } from '../models/CryptoPriceHistory.model';

/**
 * GET /api/calculator/binance/usdt-p2p
 * Obtiene el precio P2P más reciente desde la base de datos
 * Los datos son actualizados automáticamente cada hora por cron job
 */
export const getBinanceP2PController = async (req: Request, res: Response): Promise<void> => {
  try {
    const asset = (req.query.asset as string) || 'USDT';
    const fiat = (req.query.fiat as string) || 'VES';

    const CryptoPriceHistory = getCryptoPriceHistoryModel();

    // Obtener el registro más reciente para el par asset/fiat
    const latestPrice = await CryptoPriceHistory
      .findOne({ asset, fiat })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestPrice) {
      res.status(404).json({
        error: `No hay datos disponibles para ${asset}/${fiat}. El sistema se está inicializando.`,
      });
      return;
    }

    // Responder con el mismo formato que antes
    res.json({
      asset: latestPrice.asset,
      fiat: latestPrice.fiat,
      price: latestPrice.price,
      source: latestPrice.source,
      // Información adicional útil
      fetchedAt: latestPrice.createdAt,
    });
  } catch (error: any) {
    console.error('Error en /api/calculator/binance/usdt-p2p:', error?.message ?? error);
    res.status(500).json({
      error: 'Error obteniendo precio USDT P2P en Binance',
    });
  }
};

/**
 * GET /api/binance/history
 * Obtiene historial de precios P2P
 */
export const getBinanceHistoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const CryptoPriceHistory = getCryptoPriceHistoryModel();

    // Parámetros de query
    const asset = (req.query.asset as string) || 'USDT';
    const fiat = (req.query.fiat as string) || 'VES';
    const limit = parseInt(req.query.limit as string) || 100;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Filtro
    const filter: any = {};
    if (asset) filter.asset = asset.toUpperCase();
    if (fiat) filter.fiat = fiat.toUpperCase();

    // Obtener historial ordenado por fecha descendente
    const history = await CryptoPriceHistory
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await CryptoPriceHistory.countDocuments(filter).exec();

    res.json({
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filter: {
        asset,
        fiat,
      },
    });
  } catch (error: any) {
    console.error('Error en /api/binance/history:', error?.message ?? error);
    res.status(500).json({
      error: 'Error obteniendo historial de precios',
    });
  }
};
