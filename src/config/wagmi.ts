import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, baseSepolia, arbitrumSepolia, hardhat, localhost, mainnet } from 'wagmi/chains';
import { http } from 'viem';

// Fallback project ID for development or testnet exploration
export const WALLET_CONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfb';

export const wagmiConfig = getDefaultConfig({
  appName: 'Decentralized Game Card Marketplace',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia, baseSepolia, arbitrumSepolia, hardhat, localhost, mainnet],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_RPC_URL || 'https://rpc.sepolia.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [localhost.id]: http('http://127.0.0.1:8545'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
  ssr: false,
});
