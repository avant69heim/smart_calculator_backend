import { Router, Request, Response } from 'express';
import { getBinanceUsdtP2PPrice } from '../services/binanceP2PService';

export const binanceRouter = Router();

// GET /api/binance/usdt-p2p
// Se pueden recibir query params en el futuro, por ejemplo: ?fiat=VES&asset=USDT
binanceRouter.get('/usdt-p2p', async (req: Request, res: Response) => {
  try {
    const asset = (req.query.asset as string) || 'USDT';
    const fiat = (req.query.fiat as string) || 'VES';
    const data = await getBinanceUsdtP2PPrice({ asset, fiat });
    res.json(data);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error en /api/binance/usdt-p2p:', error?.message ?? error);
    res.status(500).json({
      error: 'Error obteniendo precio USDT P2P en Binance',
    });
  }
});
