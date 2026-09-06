import React, { useState, useEffect } from 'react';
import { Car, PlusCircle, LayoutGrid, FileCode2, KeyRound, Gauge, TrendingUp, Cpu } from 'lucide-react';
import { getPinataJWT } from '../services/pinata';
import { PinataSettingsModal } from './PinataSettingsModal';
import { getEthUsdPrice } from '../services/ethPriceService';
import { SimulatedConnectButton } from './SimulatedConnectButton';

interface NavbarProps {
  activeTab: 'marketplace' | 'mint' | 'collection' | 'docs';
  setActiveTab: (tab: 'marketplace' | 'mint' | 'collection' | 'docs') => void;
  myCardsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  myCardsCount,
}) => {
  const [isPinataOpen, setIsPinataOpen] = useState(false);
  const [ethUsdRate, setEthUsdRate] = useState<number>(3250);
  const hasPinataJwt = Boolean(getPinataJWT());

  useEffect(() => {
    getEthUsdPrice().then(setEthUsdRate).catch(() => {});
    const interval = setInterval(() => {
      getEthUsdPrice().then(setEthUsdRate).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo & Brand */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={() => setActiveTab('marketplace')}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-xs group-hover:border-orange-400 group-hover:scale-105 transition-all">
                <Car className="w-5 h-5 text-[#EA580C]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#EA580C] transition-colors">
                    APEX<span className="text-[#EA580C]">CARDS</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200 font-semibold flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-[#EA580C]" />
                    Simulated EVM
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Decentralized Collectible Car Marketplace
                </p>
              </div>
            </div>

            {/* Main Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'marketplace'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-[#EA580C]" />
                Showroom
              </button>

              <button
                onClick={() => setActiveTab('mint')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'mint'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#EA580C]" />
                Mint Car NFT
              </button>

              <button
                onClick={() => setActiveTab('collection')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'collection'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Gauge className="w-4 h-4 text-[#EA580C]" />
                My Garage
                {myCardsCount > 0 && (
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[#EA580C] text-white font-mono font-bold">
                    {myCardsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'docs'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <FileCode2 className="w-4 h-4 text-slate-500" />
                Specs
              </button>
            </nav>

            {/* Right Actions: Live Ticker + IPFS Settings + Simulated Wallet Connect */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Live ETH USD Ticker */}
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>ETH:</span>
                <strong className="text-slate-900">${ethUsdRate.toLocaleString()}</strong>
              </div>

              <button
                onClick={() => setIsPinataOpen(true)}
                title="Configure Pinata IPFS Keys"
                className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#EA580C]" />
                <span className="hidden lg:inline">IPFS Pinata</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasPinataJwt ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-amber-500 ring-2 ring-amber-100'
                  }`}
                />
              </button>

              {/* Simulated Wallet Connect Button */}
              <SimulatedConnectButton />
            </div>
          </div>

          {/* Mobile Navigation bar */}
          <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 text-xs font-medium bg-white">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-orange-50 text-slate-900 border border-orange-200 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#EA580C]" />
              Showroom
            </button>

            <button
              onClick={() => setActiveTab('mint')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer ${
                activeTab === 'mint'
                  ? 'bg-orange-50 text-slate-900 border border-orange-200 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#EA580C]" />
              Mint
            </button>

            <button
              onClick={() => setActiveTab('collection')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer ${
                activeTab === 'collection'
                  ? 'bg-orange-50 text-slate-900 border border-orange-200 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-[#EA580C]" />
              Garage
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-orange-50 text-slate-900 border border-orange-200 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
              Specs
            </button>
          </div>
        </div>
      </header>

      {/* Pinata IPFS Settings Modal */}
      <PinataSettingsModal
        isOpen={isPinataOpen}
        onClose={() => setIsPinataOpen(false)}
      />
    </>
  );
};
