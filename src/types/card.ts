import { Address } from 'viem';

export type CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface CardAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // ipfs://... or https://...
  attributes: CardAttribute[];
  rarity?: CardRarity;
  edition?: string;
  created_at?: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  from: string;
  to?: string;
  price?: string;
  priceEth?: string;
  timestamp: number;
  txHash?: string;
}

export interface CardItem {
  tokenId: number;
  tokenURI: string;
  name: string;
  description: string;
  image: string;
  rarity: CardRarity;
  attributes: CardAttribute[];
  owner: string;
  seller?: string;
  price?: string; // in ETH (formatted string)
  priceWei?: bigint; // in wei
  isListed: boolean;
  rawMetadata?: NFTMetadata;
  history?: ActivityItem[];
  activity?: ActivityItem[];
}

export interface SmartContractListing {
  tokenId: bigint;
  seller: string;
  price: bigint;
  isActive: boolean;
}

export type TransactionStatus =
  | 'idle'
  | 'uploading_image'
  | 'uploading_metadata'
  | 'waiting_wallet'
  | 'confirming'
  | 'success'
  | 'error';

export interface TransactionState {
  status: TransactionStatus;
  message?: string;
  txHash?: string;
  tokenId?: number;
  error?: string;
}
