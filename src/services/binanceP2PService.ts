import axios from 'axios';

export interface BinanceP2PPriceResponse {
  asset: string;
  fiat: string;
  price: number;
  source: string;
}

export async function getBinanceUsdtP2PPrice({
  asset = 'USDT',
  fiat = 'VES',
}: {
  asset?: string;
  fiat?: string;
} = {}): Promise<BinanceP2PPriceResponse> {
  // Endpoint interno usado por la web de Binance P2P (no oficial)
  const baseUrl =
    'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';

  // Body mínimo típico para Binance P2P (puedes ajustar filtros luego)
  const body = {
    page: 1,
    rows: 10,
    payTypes: [] as string[],
    asset,
    tradeType: 'BUY',
    fiat,
    publisherType: null as string | null,
  };

  const response = await axios.post(baseUrl, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = response.data as any;

  if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
    throw new Error('La respuesta de Binance P2P no contiene anuncios en data[]');
  }

  const firstAd = data.data[0];
  const priceStr = firstAd?.adv?.price as string | undefined;

  if (!priceStr) {
    throw new Error('No se encontró el campo adv.price en el primer anuncio de Binance P2P');
  }

  const price = parseFloat(priceStr);

  return {
    asset,
    fiat,
    price,
    source: 'Binance P2P',
  };
}
