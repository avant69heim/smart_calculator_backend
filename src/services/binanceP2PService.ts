/**
 * Servicio para obtener precios P2P de USDT
 * Consulta la API de Yadio para obtener precios de criptomonedas
 */

import axios from 'axios';

export interface BinanceP2PPriceResponse {
  asset: string;
  fiat: string;
  price: number;
  source: string;
}

/**
 * Obtiene el precio de USDT (u otro asset) usando Yadio API
 */
export async function getBinanceUsdtP2PPrice({
  asset = 'USDT',
  fiat = 'VES',
}: {
  asset?: string;
  fiat?: string;
} = {}): Promise<BinanceP2PPriceResponse> {
  // API de Yadio para obtener tasas de cambio
  const yadioUrl = 'https://api.yadio.io/json';

  const response = await axios.get(yadioUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = response.data as any;

  // Obtener el precio de USDT desde Yadio
  const usdtPrice = data?.USD?.other?.usdt?.rate;

  if (!usdtPrice) {
    throw new Error('No se encontró el precio de USDT en la respuesta de Yadio');
  }

  const price = parseFloat(usdtPrice);

  return {
    asset,
    fiat,
    price,
    source: 'Yadio USDT',
  };
}
