import { CardItem } from './card';

export interface SimulatedAccount {
  id: string;
  name: string;
  address: string;
  avatarColor: string;
  balanceEth: number;
}

export interface SimulatedTransactionRecord {
  txHash: string;
  type: 'Mint' | 'List' | 'Sale' | 'Buy' | 'Cancel' | 'PriceUpdate';
  from: string;
  to?: string;
  tokenId: number;
  tokenName?: string;
  priceEth?: string;
  timestamp: number;
  blockNumber: number;
  status: 'confirmed' | 'failed';
}

export interface SimulatedBlockchainState {
  currentBlock: number;
  accounts: SimulatedAccount[];
  activeAccountId: string;
  transactions: SimulatedTransactionRecord[];
}
