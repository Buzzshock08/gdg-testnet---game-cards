import { SimulatedAccount, SimulatedTransactionRecord } from '../types/wallet';
import { CardItem } from '../types/card';
import { INITIAL_DEMO_CARDS } from '../data/placeholderCards';

const STORAGE_KEY_ACCOUNTS = 'apex_sim_accounts_v1';
const STORAGE_KEY_ACTIVE_ACCOUNT_ID = 'apex_sim_active_account_id_v1';
const STORAGE_KEY_CARDS = 'apex_sim_cards_v1';
const STORAGE_KEY_TXS = 'apex_sim_tx_history_v1';
const STORAGE_KEY_BLOCK = 'apex_sim_current_block_v1';
const STORAGE_KEY_CONNECTED = 'apex_sim_is_connected_v1';

// Initial Demo Simulated Accounts with realistic EVM addresses
export const INITIAL_SIMULATED_ACCOUNTS: SimulatedAccount[] = [
  {
    id: 'player-1',
    name: 'Player 1 (Apex Champion)',
    address: '0x7A3c8E24D9841C52bF1264B3dC97A671e360491F',
    avatarColor: '#EA580C', // Orange
    balanceEth: 5.42,
  },
  {
    id: 'player-2',
    name: 'Player 2 (Track Racer)',
    address: '0x32A44B3654E7b8B390098F3920a4b7B99214E902',
    avatarColor: '#0284C7', // Sky blue
    balanceEth: 12.85,
  },
  {
    id: 'player-3',
    name: 'Player 3 (Car Collector)',
    address: '0xA4F88123985B129c78D0b5B8E29910C35B913219',
    avatarColor: '#10B981', // Emerald
    balanceEth: 3.10,
  },
];

// Helper to generate a realistic EVM transaction hash
export function generateSimulatedTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export class SimulatedBlockchainService {
  private static instance: SimulatedBlockchainService;

  public static getInstance(): SimulatedBlockchainService {
    if (!SimulatedBlockchainService.instance) {
      SimulatedBlockchainService.instance = new SimulatedBlockchainService();
    }
    return SimulatedBlockchainService.instance;
  }

  // Get all accounts
  public getAccounts(): SimulatedAccount[] {
    const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_SIMULATED_ACCOUNTS;
  }

  public saveAccounts(accounts: SimulatedAccount[]): void {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  }

  // Get active account ID
  public getActiveAccountId(): string {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ACCOUNT_ID);
    if (saved) return saved;
    return INITIAL_SIMULATED_ACCOUNTS[0].id;
  }

  public setActiveAccountId(id: string): void {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT_ID, id);
  }

  // Connection state
  public isConnected(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY_CONNECTED);
    if (saved !== null) return saved === 'true';
    return true; // Default connected for seamless demo experience
  }

  public setConnected(connected: boolean): void {
    localStorage.setItem(STORAGE_KEY_CONNECTED, connected ? 'true' : 'false');
  }

  public getActiveAccount(): SimulatedAccount {
    const accounts = this.getAccounts();
    const activeId = this.getActiveAccountId();
    return accounts.find((a) => a.id === activeId) || accounts[0];
  }

  // Cards state
  public getCards(): CardItem[] {
    const saved = localStorage.getItem(STORAGE_KEY_CARDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Initialize demo cards mapped cleanly to accounts
    const initial = INITIAL_DEMO_CARDS.map((c) => {
      // Map Token #1 to Player 1 for immediate ownership in their Garage
      if (c.tokenId === 1) {
        return {
          ...c,
          owner: INITIAL_SIMULATED_ACCOUNTS[0].address,
          seller: INITIAL_SIMULATED_ACCOUNTS[0].address,
        };
      }
      return c;
    });
    this.saveCards(initial);
    return initial;
  }

  public saveCards(cards: CardItem[]): void {
    // Stringify with replacer to safely handle any potential BigInt
    const serialized = JSON.stringify(cards, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, serialized);
    } catch (e) {
      // Most commonly a QuotaExceededError from storing large image data URLs.
      // Re-throw as a clear, user-facing message rather than letting the
      // raw DOMException bubble up uncaught.
      throw new Error(
        'Could not save card — local storage is full. Try a smaller image or clear some cards.'
      );
    }
  }

  // Transaction History
  public getTransactions(): SimulatedTransactionRecord[] {
    const saved = localStorage.getItem(STORAGE_KEY_TXS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        txHash: '0x8f23c91d4e1258a64119da988972b901fc45b3a1a9e887d12f30b911c471a41c',
        type: 'Mint',
        from: '0x0000000000000000000000000000000000000000',
        to: INITIAL_SIMULATED_ACCOUNTS[0].address,
        tokenId: 1,
        tokenName: 'Apex Vulcan Hyper-GT',
        timestamp: Date.now() - 86400000 * 3,
        blockNumber: 5894120,
        status: 'confirmed',
      },
      {
        txHash: '0x12c478a83b4c919d77f09801452da61bb0e2920fba02239d5e3381a17f99b241',
        type: 'List',
        from: INITIAL_SIMULATED_ACCOUNTS[0].address,
        tokenId: 1,
        tokenName: 'Apex Vulcan Hyper-GT',
        priceEth: '0.25',
        timestamp: Date.now() - 86400000 * 1,
        blockNumber: 5894310,
        status: 'confirmed',
      },
    ];
  }

  public addTransaction(tx: SimulatedTransactionRecord): void {
    const txs = this.getTransactions();
    localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify([tx, ...txs]));
  }

  // Block counter
  public getCurrentBlock(): number {
    const saved = localStorage.getItem(STORAGE_KEY_BLOCK);
    if (saved) return parseInt(saved, 10);
    return 5894520;
  }

  public incrementBlock(): number {
    const current = this.getCurrentBlock() + 1;
    localStorage.setItem(STORAGE_KEY_BLOCK, current.toString());
    return current;
  }

  // Helper to adjust balance
  public adjustAccountBalance(address: string, deltaEth: number): void {
    const accounts = this.getAccounts();
    const updated = accounts.map((acc) => {
      if (acc.address.toLowerCase() === address.toLowerCase()) {
        const newBal = Math.max(0, parseFloat((acc.balanceEth + deltaEth).toFixed(4)));
        return { ...acc, balanceEth: newBal };
      }
      return acc;
    });
    this.saveAccounts(updated);
  }

  // Reset demo state
  public resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEY_ACCOUNTS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_ACCOUNT_ID);
    localStorage.removeItem(STORAGE_KEY_CARDS);
    localStorage.removeItem(STORAGE_KEY_TXS);
    localStorage.removeItem(STORAGE_KEY_BLOCK);
    localStorage.removeItem(STORAGE_KEY_CONNECTED);
  }
}

export const simulatedBlockchain = SimulatedBlockchainService.getInstance();
