/**
 * Modelo para guardar historial de precios de criptomonedas P2P
 */

import { Schema, Document, Model } from 'mongoose';
import { getConnection } from '../config/database';

export interface ICryptoPriceHistory extends Document {
  asset: string;
  fiat: string;
  price: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const cryptoPriceHistorySchema = new Schema<ICryptoPriceHistory>(
  {
    asset: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    fiat: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    source: {
      type: String,
      required: true,
      default: 'Binance P2P',
    },
  },
  {
    timestamps: true,
    collection: 'crypto_price_history',
  }
);

// Índices compuestos para consultas eficientes
cryptoPriceHistorySchema.index({ asset: 1, fiat: 1, createdAt: -1 });
cryptoPriceHistorySchema.index({ source: 1, createdAt: -1 });

/**
 * Obtener el modelo con la conexión correcta
 */
export const getCryptoPriceHistoryModel = (): Model<ICryptoPriceHistory> => {
  const connection = getConnection();

  if (!connection) {
    throw new Error('No hay conexión a la base de datos');
  }

  // Si el modelo ya existe, retornarlo
  if (connection.models.CryptoPriceHistory) {
    return connection.models.CryptoPriceHistory as Model<ICryptoPriceHistory>;
  }

  // Si no existe, crearlo
  return connection.model<ICryptoPriceHistory>('CryptoPriceHistory', cryptoPriceHistorySchema);
};
