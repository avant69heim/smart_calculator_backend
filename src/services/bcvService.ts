import axios from 'axios';

export interface BcvRatesResponse {
  usd: number;
  eur: number;
  source: string;
  lastUpdateUsd: string | null;
  lastUpdateEur: string | null;
}

export async function getBcvRates(): Promise<BcvRatesResponse> {
  // Usamos la API pública open.er-api.com para obtener USD/VES y EUR/VES
  const usdUrl = 'https://open.er-api.com/v6/latest/USD';
  const eurUrl = 'https://open.er-api.com/v6/latest/EUR';

  // Ejecutamos ambas peticiones en paralelo
  const [usdResponse, eurResponse] = await Promise.all([
    axios.get(usdUrl),
    axios.get(eurUrl),
  ]);

  const usdData = usdResponse.data as any;
  const eurData = eurResponse.data as any;

  if (!usdData?.rates?.VES || !eurData?.rates?.VES) {
    throw new Error('La respuesta de open.er-api.com no contiene rates.VES');
  }

  const usdRate = usdData.rates.VES as number;
  const eurRate = eurData.rates.VES as number;

  return {
    usd: usdRate,
    eur: eurRate,
    source: 'open.er-api.com',
    lastUpdateUsd: (usdData.time_last_update_utc as string) || null,
    lastUpdateEur: (eurData.time_last_update_utc as string) || null,
  };
}
