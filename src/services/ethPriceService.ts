/**
 * ETH to USD price service
 * Fetches live spot price with local session caching and graceful fallback
 */

let cachedPrice: number | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60 * 1000; // 1 minute

export async function getEthUsdPrice(): Promise<number> {
  const now = Date.now();
  if (cachedPrice && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedPrice;
  }

  // Try CoinGecko
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.ethereum?.usd) {
        cachedPrice = Number(data.ethereum.usd);
        lastFetchTime = now;
        return cachedPrice;
      }
    }
  } catch (e) {
    // Fallback to Coinbase public ticker
  }

  try {
    const res = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot');
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.amount) {
        cachedPrice = parseFloat(data.data.amount);
        lastFetchTime = now;
        return cachedPrice;
      }
    }
  } catch (e) {
    // Ignore
  }

  // Fallback to standard baseline if offline/network restricted
  return cachedPrice || 3250.0;
}

export function formatUsdDisplay(ethAmountStr?: string, ethUsdRate: number = 3250): string {
  if (!ethAmountStr) return '$0.00';
  const eth = parseFloat(ethAmountStr);
  if (isNaN(eth) || eth <= 0) return '$0.00';
  const usd = eth * ethUsdRate;
  return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
