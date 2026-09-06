import React from 'react';
import {
  FileCode2,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Terminal,
  Database,
  Car,
  Cpu,
  Users,
} from 'lucide-react';
import { CONTRACT_ADDRESS_SEPOLIA } from '../config/contracts';
import { INITIAL_SIMULATED_ACCOUNTS } from '../services/simulatedBlockchain';
import { shortenAddress } from '../services/contractService';

export const DocsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-slate-900 space-y-10">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#EA580C] font-semibold mb-1">
          <FileCode2 className="w-4 h-4" />
          <span>System Specifications & Architecture</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
          Simulated EVM Engine & Architecture Docs
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Complete technical specifications for the ERC-721 decentralized collectible car marketplace, featuring an internal modular Simulated EVM Wallet & Blockchain engine, OpenZeppelin verified contracts, Pinata IPFS metadata pinning, and persistent client-side state.
        </p>
      </div>

      {/* Contract & Testnet Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="block text-[11px] font-mono text-slate-500 uppercase">
            Target Execution Layer
          </span>
          <span className="font-heading font-bold text-base text-slate-900 block mt-0.5">
            Simulated EVM (Sepolia)
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            Zero Extension Required
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="block text-[11px] font-mono text-slate-500 uppercase">
            Smart Contract Standard
          </span>
          <span className="font-heading font-bold text-base text-slate-900 block mt-0.5">
            ERC-721 + ReentrancyGuard
          </span>
          <span className="text-[11px] text-[#EA580C] font-semibold block mt-1">
            OpenZeppelin v5.x
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="block text-[11px] font-mono text-slate-500 uppercase">
            IPFS Storage Provider
          </span>
          <span className="font-heading font-bold text-base text-slate-900 block mt-0.5">
            Pinata Cloud IPFS
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Dedicated Gateway Enabled
          </span>
        </div>
      </div>

      {/* Simulated Accounts Registry */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Built-in Simulated Accounts
            </h3>
            <p className="text-xs text-slate-500">
              Test peer-to-peer buying, selling, and transfers across multiple distinct accounts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {INITIAL_SIMULATED_ACCOUNTS.map((acc) => (
            <div
              key={acc.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white font-bold text-[10px]"
                  style={{ backgroundColor: acc.avatarColor }}
                >
                  {acc.name.charAt(0)}
                </div>
                <span className="font-bold text-slate-900">{acc.name}</span>
              </div>
              <div className="font-mono text-[11px] text-slate-500 truncate">
                {acc.address}
              </div>
              <div className="font-mono text-slate-700 font-semibold pt-1">
                Initial: {acc.balanceEth} ETH
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h3 className="font-heading text-xl font-bold text-slate-900">
            Marketplace Features & Mechanics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineered with complete validation and realistic EVM state transitions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
              <span>Simulated Wallet & Switching</span>
            </div>
            <p className="text-slate-600">
              Switch seamlessly between Player 1, Player 2, and Player 3. Switching immediately updates the active address, ETH balance, personal garage collection, listings, and transaction provenance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
              <span>Fixed-Price Escrow & Buying</span>
            </div>
            <p className="text-slate-600">
              When Player 2 purchases a car listed by Player 1, the purchase price in ETH is deducted from Player 2, credited to Player 1, ownership is transferred, the card is delisted, and a unique 256-bit transaction hash is recorded.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
              <span>ERC-721 Minting with Pinata IPFS</span>
            </div>
            <p className="text-slate-600">
              Users can customize car models, speed ratings, and horsepower. Metadata is pinned to decentralized IPFS or data URIs, generating sequential token IDs and mint provenance records.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
              <span>Durable Local Persistence</span>
            </div>
            <p className="text-slate-600">
              All simulated blockchain state — token ownership, active listings, price revisions, balances, and transaction logs — is persistently saved to local storage so page refreshes retain exact progress.
            </p>
          </div>
        </div>
      </div>

      {/* CLI Commands for Local Development */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Hardhat Commands & Smart Contract Tests
            </h3>
            <p className="text-xs text-slate-500">
              Hardhat automated test suite verifying contract integrity
            </p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block mb-1"># Run Hardhat Smart Contract Tests</span>
            <code className="text-[#EA580C] font-semibold">npx hardhat test --config hardhat.config.cjs</code>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block mb-1"># Compile Solidity Smart Contracts</span>
            <code className="text-[#EA580C] font-semibold">npx hardhat compile --config hardhat.config.cjs</code>
          </div>
        </div>
      </div>
    </div>
  );
};
