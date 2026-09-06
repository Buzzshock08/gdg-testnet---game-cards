import React, { useState } from 'react';
import { SimulatedWalletProvider, useSimulatedWallet } from './context/SimulatedWalletContext';
import { useMarketplace } from './hooks/useMarketplace';
import { CardItem } from './types/card';
import { Navbar } from './components/Navbar';
import { MarketplacePage } from './pages/MarketplacePage';
import { MintPage } from './pages/MintPage';
import { MyCollectionPage } from './pages/MyCollectionPage';
import { DocsPage } from './pages/DocsPage';
import { CardDetailModal } from './components/CardDetailModal';
import { ListModal } from './components/ListModal';
import { UpdatePriceModal } from './components/UpdatePriceModal';
import { TransactionModal } from './components/TransactionModal';
import { Gauge, ShieldCheck, Car, RefreshCw } from 'lucide-react';

function MainMarketplaceApp() {
  const { address, isConnected, account } = useSimulatedWallet();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mint' | 'collection' | 'docs'>('marketplace');

  // Modal States
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [cardToList, setCardToList] = useState<CardItem | null>(null);
  const [cardToUpdatePrice, setCardToUpdatePrice] = useState<CardItem | null>(null);

  // Marketplace State Hook
  const {
    cards,
    isLoading,
    isOnChain,
    txState,
    resetTxState,
    mintCard,
    listCard,
    updateListingPrice,
    buyCard,
    cancelListing,
    refreshMarketplace,
  } = useMarketplace();

  const myCardsCount = cards.filter((card) => {
    if (!isConnected || !address) return false;
    return (
      card.owner.toLowerCase() === address.toLowerCase() ||
      (card.seller && card.seller.toLowerCase() === address.toLowerCase())
    );
  }).length;

  const handleViewDetails = (card: CardItem) => {
    const latest = cards.find((c) => c.tokenId === card.tokenId) || card;
    setSelectedCard(latest);
  };

  const handleOpenListModal = (card: CardItem) => {
    setCardToList(card);
  };

  const handleOpenUpdatePriceModal = (card: CardItem) => {
    setCardToUpdatePrice(card);
  };

  const handleConfirmList = async (tokenId: number, priceEth: string) => {
    await listCard(tokenId, priceEth);
    if (selectedCard && selectedCard.tokenId === tokenId) {
      setSelectedCard((prev) =>
        prev
          ? {
              ...prev,
              isListed: true,
              price: priceEth,
              seller: address,
            }
          : null
      );
    }
  };

  const handleConfirmUpdatePrice = async (tokenId: number, newPriceEth: string) => {
    await updateListingPrice(tokenId, newPriceEth);
    if (selectedCard && selectedCard.tokenId === tokenId) {
      setSelectedCard((prev) =>
        prev
          ? {
              ...prev,
              price: newPriceEth,
            }
          : null
      );
    }
  };

  const handleBuyCard = async (card: CardItem) => {
    await buyCard(card.tokenId);
    if (selectedCard && selectedCard.tokenId === card.tokenId) {
      setSelectedCard((prev) =>
        prev
          ? {
              ...prev,
              owner: address,
              isListed: false,
              seller: undefined,
            }
          : null
      );
    }
  };

  const handleCancelListing = async (card: CardItem) => {
    await cancelListing(card.tokenId);
    if (selectedCard && selectedCard.tokenId === card.tokenId) {
      setSelectedCard((prev) =>
        prev
          ? {
              ...prev,
              isListed: false,
              seller: undefined,
            }
          : null
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* Navigation Bar with Simulated Wallet Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myCardsCount={myCardsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <MarketplacePage
            cards={cards}
            currentAddress={address}
            onViewDetails={handleViewDetails}
            onBuy={handleBuyCard}
            onList={handleOpenListModal}
            onCancelListing={handleCancelListing}
            onUpdatePrice={handleOpenUpdatePriceModal}
            onNavigateToMint={() => setActiveTab('mint')}
          />
        )}

        {activeTab === 'mint' && (
          <MintPage onMint={mintCard} txState={txState} />
        )}

        {activeTab === 'collection' && (
          <MyCollectionPage
            cards={cards}
            onViewDetails={handleViewDetails}
            onList={handleOpenListModal}
            onCancelListing={handleCancelListing}
            onUpdatePrice={handleOpenUpdatePriceModal}
            onNavigateToMint={() => setActiveTab('mint')}
          />
        )}

        {activeTab === 'docs' && <DocsPage />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#EA580C]" />
            <span className="font-heading font-bold text-slate-800">APEXCARDS</span>
            <span>• Decentralized Collectible Car Marketplace</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Simulated EVM Engine Active
            </span>
            <span className="font-mono text-slate-400">ERC-721 Standard</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CardDetailModal
        card={selectedCard}
        currentAddress={address}
        onClose={() => setSelectedCard(null)}
        onBuy={handleBuyCard}
        onList={handleOpenListModal}
        onCancelListing={handleCancelListing}
        onOpenUpdatePrice={handleOpenUpdatePriceModal}
      />

      <ListModal
        card={cardToList}
        isOpen={Boolean(cardToList)}
        onClose={() => setCardToList(null)}
        onConfirmList={handleConfirmList}
      />

      <UpdatePriceModal
        card={cardToUpdatePrice}
        isOpen={Boolean(cardToUpdatePrice)}
        onClose={() => setCardToUpdatePrice(null)}
        onConfirmUpdatePrice={handleConfirmUpdatePrice}
      />

      <TransactionModal
        state={txState}
        onClose={resetTxState}
        onViewMintedCard={(tid) => {
          const c = cards.find((card) => card.tokenId === tid);
          if (c) setSelectedCard(c);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <SimulatedWalletProvider>
      <MainMarketplaceApp />
    </SimulatedWalletProvider>
  );
}
