import React, { useState } from 'react';
import { useSimulatedWallet } from '../context/SimulatedWalletContext';
import { CardItem } from '../types/card';
import { CardItem as CardItemComponent } from '../components/CardItem';
import { Sparkles, Wallet, PlusCircle, Car, Gauge, Tag, ArrowRight } from 'lucide-react';
import { SimulatedConnectButton } from '../components/SimulatedConnectButton';

interface MyCollectionPageProps {
  cards: CardItem[];
  onViewDetails: (card: CardItem) => void;
  onList: (card: CardItem) => void;
  onCancelListing: (card: CardItem) => void;
  onUpdatePrice: (card: CardItem) => void;
  onNavigateToMint: () => void;
}

export const MyCollectionPage: React.FC<MyCollectionPageProps> = ({
  cards,
  onViewDetails,
  onList,
  onCancelListing,
  onUpdatePrice,
  onNavigateToMint,
}) => {
  const { address, isConnected, account } = useSimulatedWallet();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlisted' | 'listed'>('all');

  // Filter cards owned by the active simulated account (or listed by them)
  const myCards = cards.filter((card) => {
    if (!address) return false;
    const isOwner = card.owner.toLowerCase() === address.toLowerCase();
    const isSeller = card.seller && card.seller.toLowerCase() === address.toLowerCase();
    return isOwner || isSeller;
  });

  const filteredMyCards = myCards.filter((c) => {
    if (activeFilter === 'listed') return c.isListed;
    if (activeFilter === 'unlisted') return !c.isListed;
    return true;
  });

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C] mx-auto mb-5">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">
            Connect Simulated Wallet
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Connect your simulated account (Player 1, Player 2, or Player 3) to view and manage cars owned by your address in your private garage.
          </p>
          <div className="flex justify-center">
            <SimulatedConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Garage Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-white via-orange-50/40 to-white border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-2xl shadow-sm"
              style={{ backgroundColor: account.avatarColor }}
            >
              {account.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  {account.name}'s Garage
                </h1>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-mono mt-0.5">
                {address} • Balance:{' '}
                <strong className="text-slate-900">{account.balanceEth.toFixed(4)} ETH</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToMint}
            className="px-5 py-3 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mint New Vehicle</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-200/80">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            All Cars ({myCards.length})
          </button>
          <button
            onClick={() => setActiveFilter('unlisted')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'unlisted'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            In Vault ({myCards.filter((c) => !c.isListed).length})
          </button>
          <button
            onClick={() => setActiveFilter('listed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'listed'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            Listed for Sale ({myCards.filter((c) => c.isListed).length})
          </button>
        </div>
      </div>

      {/* Grid of User's Cards */}
      {filteredMyCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMyCards.map((card) => (
            <CardItemComponent
              key={card.tokenId}
              card={card}
              currentAddress={address}
              onViewDetails={onViewDetails}
              onBuy={() => {}}
              onList={onList}
              onCancelListing={onCancelListing}
              onUpdatePrice={onUpdatePrice}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C] mx-auto mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
            {activeFilter === 'all'
              ? 'Your Garage is Empty'
              : activeFilter === 'listed'
              ? 'No Vehicles Listed'
              : 'No Unlisted Vehicles in Vault'}
          </h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {activeFilter === 'all'
              ? 'You do not own any collectible car NFTs with this simulated account yet. Mint your first custom vehicle or switch to another simulated account!'
              : 'Adjust your filters or list cars from your vault to see them here.'}
          </p>
          <button
            onClick={onNavigateToMint}
            className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mint Vehicle to Blockchain</span>
          </button>
        </div>
      )}
    </div>
  );
};
