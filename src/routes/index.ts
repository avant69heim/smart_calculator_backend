/**
 * Rutas principales del Calculator Service
 */

import { Router, Request, Response } from 'express';
import { getConnectionStatus } from '../config/database';

const router = Router();

/**
 * GET /
 * Información del servicio
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    service: 'Calculator Service',
    version: '1.0.0',
    description: 'Microservicio de calculadora y operaciones matemáticas',
    endpoints: {
      info: 'GET /',
      health: 'GET /health',
      dbStatus: 'GET /db/status',
      // TODO: Agregar endpoints de operaciones matemáticas
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /health
 * Health check del servicio
 */
router.get('/health', (_req: Request, res: Response) => {
  const dbStatus = getConnectionStatus();

  res.status(dbStatus.connected ? 200 : 503).json({
    status: dbStatus.connected ? 'healthy' : 'unhealthy',
    service: 'Calculator Service',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /db/status
 * Estado de la conexión a la base de datos
 */
router.get('/db/status', (_req: Request, res: Response) => {
  const dbStatus = getConnectionStatus();

  res.status(dbStatus.connected ? 200 : 503).json({
    status: dbStatus.connected ? 'connected' : 'disconnected',
    database: 'calculator_db',
    details: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
