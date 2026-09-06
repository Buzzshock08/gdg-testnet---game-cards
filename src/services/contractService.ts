import { formatEther } from 'viem';
import { CardItem, NFTMetadata } from '../types/card';
import { resolveIPFSUrl } from './pinata';

export interface CardOnChainDetails {
  tokenId: number;
  uri: string;
  owner: string;
  seller: string;
  price: bigint;
  isListed: boolean;
}

/**
 * Fetch metadata JSON from IPFS URI or gateway
 */
export async function fetchNFTMetadata(tokenURI: string): Promise<NFTMetadata | null> {
  if (!tokenURI) return null;

  // Check session storage cache
  const cleanUri = tokenURI.trim();
  const cachedMeta = sessionStorage.getItem(`meta_cache_${cleanUri}`);
  if (cachedMeta) {
    try {
      return JSON.parse(cachedMeta);
    } catch (e) {
      // parse error
    }
  }

  // If it is a data URI
  if (cleanUri.startsWith('data:application/json')) {
    try {
      const jsonContent = decodeURIComponent(cleanUri.split(',')[1]);
      return JSON.parse(jsonContent);
    } catch (e) {
      // ignore
    }
  }

  const httpUrl = resolveIPFSUrl(cleanUri);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(httpUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      sessionStorage.setItem(`meta_cache_${cleanUri}`, JSON.stringify(json));
      return json;
    }
  } catch (err) {
    // If external gateway fails, attempt to read from fallback session storage
    if (cleanUri.startsWith('ipfs://')) {
      const cid = cleanUri.replace('ipfs://', '');
      const localMeta = sessionStorage.getItem(`ipfs_meta_${cid}`);
      if (localMeta) {
        try {
          return JSON.parse(localMeta);
        } catch (e) {}
      }
    }
  }

  return null;
}

/**
 * Normalizes on-chain listing + metadata into CardItem
 */
export function formatCardItem(
  tokenId: number,
  tokenURI: string,
  owner: string,
  seller: string,
  priceWei: bigint,
  isListed: boolean,
  metadata?: NFTMetadata | null
): CardItem {
  const name = metadata?.name || `Apex Collectible #${tokenId}`;
  const description = metadata?.description || 'Unique high-performance digital collectible car NFT.';
  const image = metadata?.image ? resolveIPFSUrl(metadata.image) : '';
  const rarity = (metadata?.rarity ||
    metadata?.attributes?.find((a) => a.trait_type.toLowerCase() === 'rarity')?.value ||
    'Common') as any;
  const attributes = metadata?.attributes || [];

  return {
    tokenId,
    tokenURI,
    name,
    description,
    image,
    rarity,
    attributes,
    owner,
    seller: isListed ? seller : undefined,
    price: isListed ? formatEther(priceWei) : undefined,
    priceWei: isListed ? priceWei : undefined,
    isListed,
    rawMetadata: metadata || undefined,
  };
}

/**
 * Formats a wallet address into shortened format (e.g., 0x1234...5678)
 */
export function shortenAddress(address?: string): string {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format ETH price with precision
 */
export function formatEthDisplay(ethStr?: string): string {
  if (!ethStr) return '0.00';
  const num = parseFloat(ethStr);
  if (isNaN(num)) return '0.00';
  if (num < 0.0001 && num > 0) return '<0.0001';
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

