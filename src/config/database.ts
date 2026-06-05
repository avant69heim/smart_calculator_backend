/**
 * Configuración de conexión a MongoDB para Calculator Service
 */

import mongoose, { Connection } from 'mongoose';
import dns from 'dns';

// Forzar IPv4 para resolver problemas de DNS en algunos entornos cloud
dns.setDefaultResultOrder('ipv4first');

let connection: Connection | null = null;

/**
 * Conectar a la base de datos calculator_db con retry
 */
export const connectDatabase = async (retries = 3): Promise<Connection> => {
  // Usar variable específica del servicio o la genérica
  const MONGODB_URI = process.env.MONGODB_CALCULATOR_URI || process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_CALCULATOR_URI o MONGODB_URI no está definida en las variables de entorno');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Conectando a calculator_db... (intento ${attempt}/${retries})`);

      const mongooseInstance = await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 30000, // Aumentado para entornos cloud
        family: 4, // Forzar IPv4
        retryWrites: true,
        retryReads: true,
      });

      connection = mongooseInstance.connection;

      console.log('✅ Conectado a calculator_db exitosamente');
      console.log(`📊 Host: ${connection.host}`);
      console.log(`📊 Database: ${connection.name}`);

      // Event listeners
      connection.on('error', (err) => {
        console.error('❌ Error de MongoDB:', err);
      });

      connection.on('disconnected', () => {
        console.log('⚠️ MongoDB desconectado');
      });

      return connection;
    } catch (error) {
      console.error(`❌ Error al conectar (intento ${attempt}/${retries}):`, error);

      if (attempt === retries) {
        throw error;
      }

      // Esperar antes del siguiente intento (backoff exponencial)
      const waitTime = attempt * 2000;
      console.log(`⏳ Esperando ${waitTime/1000}s antes del siguiente intento...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error('No se pudo conectar a la base de datos después de varios intentos');
};

/**
 * Desconectar de la base de datos
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (connection) {
      await mongoose.disconnect();
      connection = null;
      console.log('✅ Desconectado de calculator_db');
    }
  } catch (error) {
    console.error('❌ Error al desconectar de calculator_db:', error);
    throw error;
  }
};

/**
 * Obtener la conexión actual
 */
export const getConnection = (): Connection | null => {
  return connection;
};

/**
 * Verificar el estado de la conexión
 */
export const getConnectionStatus = () => {
  if (!connection) {
    return {
      connected: false,
      readyState: 0,
      message: 'No conectado',
    };
  }

  return {
    connected: connection.readyState === 1,
    readyState: connection.readyState,
    host: connection.host,
    name: connection.name,
    message: connection.readyState === 1 ? 'Conectado' : 'Desconectado',
  };
};
