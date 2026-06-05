/**
 * Modelo para guardar historial de tasas de cambio BCV
 */

import { Schema, Document, Model } from 'mongoose';
import { getConnection } from '../config/database';

export interface IRateHistory extends Document {
  usd: number;
  eur: number;
  source: string;
  lastUpdateUsd: string | null;
  lastUpdateEur: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const rateHistorySchema = new Schema<IRateHistory>(
  {
    usd: {
      type: Number,
      required: true,
      index: true,
    },
    eur: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
      default: 'open.er-api.com',
    },
    lastUpdateUsd: {
      type: String,
      default: null,
    },
    lastUpdateEur: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'rate_history',
  }
);

// Índices para consultas eficientes
rateHistorySchema.index({ createdAt: -1 });
rateHistorySchema.index({ source: 1, createdAt: -1 });

/**
 * Obtener el modelo con la conexión correcta
 */
export const getRateHistoryModel = (): Model<IRateHistory> => {
  const connection = getConnection();

  if (!connection) {
    throw new Error('No hay conexión a la base de datos');
  }

  // Si el modelo ya existe, retornarlo
  if (connection.models.RateHistory) {
    return connection.models.RateHistory as Model<IRateHistory>;
  }

  // Si no existe, crearlo
  return connection.model<IRateHistory>('RateHistory', rateHistorySchema);
};
