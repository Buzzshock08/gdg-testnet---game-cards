import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SimulatedAccount, SimulatedTransactionRecord } from '../types/wallet';
import { simulatedBlockchain, INITIAL_SIMULATED_ACCOUNTS } from '../services/simulatedBlockchain';

interface SimulatedWalletContextType {
  account: SimulatedAccount;
  address: string;
  isConnected: boolean;
  accounts: SimulatedAccount[];
  switchAccount: (accountId: string) => void;
  connectWallet: (accountId?: string) => void;
  disconnectWallet: () => void;
  balanceEth: number;
  transactions: SimulatedTransactionRecord[];
  refreshWallet: () => void;
  networkName: string;
  chainId: number;
}

const SimulatedWalletContext = createContext<SimulatedWalletContextType | undefined>(undefined);

export const SimulatedWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<SimulatedAccount[]>(() => simulatedBlockchain.getAccounts());
  const [activeAccount, setActiveAccount] = useState<SimulatedAccount>(() => simulatedBlockchain.getActiveAccount());
  const [isConnected, setIsConnected] = useState<boolean>(() => simulatedBlockchain.isConnected());
  const [transactions, setTransactions] = useState<SimulatedTransactionRecord[]>(() => simulatedBlockchain.getTransactions());

  const refreshWallet = useCallback(() => {
    const updatedAccounts = simulatedBlockchain.getAccounts();
    const currentActive = simulatedBlockchain.getActiveAccount();
    const connected = simulatedBlockchain.isConnected();
    const currentTxs = simulatedBlockchain.getTransactions();

    setAccounts(updatedAccounts);
    setActiveAccount(currentActive);
    setIsConnected(connected);
    setTransactions(currentTxs);
  }, []);

  const switchAccount = (accountId: string) => {
    simulatedBlockchain.setActiveAccountId(accountId);
    simulatedBlockchain.setConnected(true);
    refreshWallet();
  };

  const connectWallet = (accountId?: string) => {
    if (accountId) {
      simulatedBlockchain.setActiveAccountId(accountId);
    }
    simulatedBlockchain.setConnected(true);
    refreshWallet();
  };

  const disconnectWallet = () => {
    simulatedBlockchain.setConnected(false);
    setIsConnected(false);
  };

  return (
    <SimulatedWalletContext.Provider
      value={{
        account: activeAccount,
        address: activeAccount.address,
        isConnected,
        accounts,
        switchAccount,
        connectWallet,
        disconnectWallet,
        balanceEth: activeAccount.balanceEth,
        transactions,
        refreshWallet,
        networkName: 'Sepolia (Simulated)',
        chainId: 11155111,
      }}
    >
      {children}
    </SimulatedWalletContext.Provider>
  );
};

export function useSimulatedWallet(): SimulatedWalletContextType {
  const context = useContext(SimulatedWalletContext);
  if (!context) {
    throw new Error('useSimulatedWallet must be used within a SimulatedWalletProvider');
  }
  return context;
}
