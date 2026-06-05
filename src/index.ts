/**
 * Calculator Service - Microservicio de Calculadora
 *
 * Este servicio maneja operaciones matemáticas, tasas de cambio,
 * precios de criptomonedas y funcionalidades relacionadas.
 */

import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import { connectDatabase, disconnectDatabase } from './config/database';
import routes from './routes';
import { bcvRouter } from './routes/bcvRoutes';
import { binanceRouter } from './routes/binanceRoutes';
import { startCronJobs } from './services/cronJobs';

const app: Application = express();
// Standalone backend: bind to the platform-injected port (Render/Heroku set PORT),
// fall back to 3002 for local development.
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.use('/', routes);

// Rutas de tasas de cambio y criptomonedas
// IMPORTANTE: Gateway enruta /api/calculator/* y quita el prefijo
// Por eso estas rutas no tienen /api/calculator, solo /bcv y /binance
app.use('/bcv', bcvRouter);
app.use('/binance', binanceRouter);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada en Calculator Service',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Función principal
 */
const main = async (): Promise<void> => {
  try {
    console.log('\n🧮 ================================');
    console.log('   CALCULATOR SERVICE');
    console.log('================================\n');

    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar cron jobs para actualizar tasas y precios automáticamente
    startCronJobs();

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log('\n✅ Calculator Service iniciado correctamente');
      console.log(`🌐 Servidor: http://localhost:${PORT}`);
      console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n💡 Listo para procesar operaciones matemáticas\n');
    });

    // Manejo de cierre graceful
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n⚠️ Señal ${signal} recibida. Cerrando Calculator Service...`);

      server.close(async () => {
        console.log('🔌 Servidor HTTP cerrado');
        await disconnectDatabase();
        console.log('✅ Calculator Service cerrado correctamente');
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('⚠️ Forzando cierre...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Error al iniciar Calculator Service:', error);
    process.exit(1);
  }
};

// Ejecutar la aplicación
main();
