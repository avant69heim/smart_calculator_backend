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

  // Yadio exposes the USDT/<fiat> P2P rate under data.<fiat>.rate_p2p.
  // (It used to live at data.USD.other.usdt.rate, which Yadio removed; reading
  // the old path returned undefined and silently broke the price feed.)
  const usdtPrice = data?.[fiat]?.rate_p2p;

  if (usdtPrice === undefined || usdtPrice === null) {
    throw new Error(`No se encontró el precio P2P de USDT/${fiat} en la respuesta de Yadio`);
  }

  const price = Number(usdtPrice);

  return {
    asset,
    fiat,
    price,
    source: 'Yadio USDT',
  };
}
