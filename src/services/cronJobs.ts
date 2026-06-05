/**
 * Cron Jobs para actualizar tasas y precios automáticamente
 * Se ejecutan cada hora para mantener datos actualizados en la BD
 */

import cron from 'node-cron';
import { getBcvRates } from './bcvService';
import { getBinanceUsdtP2PPrice } from './binanceP2PService';
import { getRateHistoryModel } from '../models/RateHistory.model';
import { getCryptoPriceHistoryModel } from '../models/CryptoPriceHistory.model';

/**
 * Actualiza las tasas BCV en la base de datos
 */
export const updateBcvRates = async (): Promise<void> => {
  try {
    console.log('🕐 [Cron] Actualizando tasas BCV...');

    const data = await getBcvRates();
    const RateHistory = getRateHistoryModel();

    await RateHistory.create({
      usd: data.usd,
      eur: data.eur,
      source: data.source,
      lastUpdateUsd: data.lastUpdateUsd,
      lastUpdateEur: data.lastUpdateEur,
    });

    console.log(`✅ [Cron] Tasas BCV actualizadas: USD=${data.usd}, EUR=${data.eur}`);
  } catch (error: any) {
    console.error('❌ [Cron] Error actualizando tasas BCV:', error?.message ?? error);
  }
};

/**
 * Actualiza los precios de Binance P2P en la base de datos
 */
export const updateBinancePrices = async (): Promise<void> => {
  try {
    console.log('🕐 [Cron] Actualizando precios Binance P2P...');

    // Actualizar USDT/VES (el par principal)
    const data = await getBinanceUsdtP2PPrice({ asset: 'USDT', fiat: 'VES' });
    const CryptoPriceHistory = getCryptoPriceHistoryModel();

    await CryptoPriceHistory.create({
      asset: data.asset,
      fiat: data.fiat,
      price: data.price,
      source: data.source,
    });

    console.log(`✅ [Cron] Precio Binance P2P actualizado: ${data.asset}/${data.fiat} = ${data.price}`);
  } catch (error: any) {
    console.error('❌ [Cron] Error actualizando precios Binance:', error?.message ?? error);
  }
};

/**
 * Ejecuta todas las actualizaciones una vez
 * Útil para tener datos inmediatos al iniciar el servicio
 */
export const runAllUpdates = async (): Promise<void> => {
  console.log('🔄 [Cron] Ejecutando actualización inicial de datos...');
  await Promise.all([
    updateBcvRates(),
    updateBinancePrices(),
  ]);
  console.log('✅ [Cron] Actualización inicial completada');
};

/**
 * Inicia todos los cron jobs
 */
export const startCronJobs = (): void => {
  console.log('⏰ [Cron] Iniciando cron jobs...');

  // Ejecutar cada hora en el minuto 0
  // Formato: '0 * * * *' = minuto 0 de cada hora
  cron.schedule('0 * * * *', async () => {
    console.log('\n📅 [Cron] Ejecutando actualización programada...');
    await runAllUpdates();
  });

  console.log('✅ [Cron] Cron jobs configurados:');
  console.log('   - Tasas BCV: cada hora (minuto 0)');
  console.log('   - Precios Binance P2P: cada hora (minuto 0)');

  // Ejecutar inmediatamente al iniciar para tener datos disponibles
  runAllUpdates().catch(error => {
    console.error('❌ [Cron] Error en actualización inicial:', error);
  });
};
