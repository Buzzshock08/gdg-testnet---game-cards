import React, { useState, useMemo } from 'react';
import { CardItem } from '../types/card';
import { CardItem as CardItemComponent } from '../components/CardItem';
import { FilterBar, SortOption, SaleTypeFilter } from '../components/FilterBar';
import { ShoppingBag, Sparkles, PlusCircle, Car, Tag } from 'lucide-react';

interface MarketplacePageProps {
  cards: CardItem[];
  currentAddress?: string;
  onViewDetails: (card: CardItem) => void;
  onBuy: (card: CardItem) => void;
  onList: (card: CardItem) => void;
  onCancelListing: (card: CardItem) => void;
  onUpdatePrice: (card: CardItem) => void;
  onNavigateToMint: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  cards,
  currentAddress,
  onViewDetails,
  onBuy,
  onList,
  onCancelListing,
  onUpdatePrice,
  onNavigateToMint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [saleType, setSaleType] = useState<SaleTypeFilter>('all');

  // Filter and Sort Cards
  const filteredCards = useMemo(() => {
    return cards
      .filter((card) => {
        // Public marketplace only ever shows cards actively listed for sale.
        // Unlisted cards are private to their owner and only appear on the
        // My Collection page.
        if (!card.isListed) {
          return false;
        }

        // Sale Type filter
        if (saleType === 'fixed' && !card.isListed) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = card.name.toLowerCase().includes(q);
          const matchesDesc = card.description.toLowerCase().includes(q);
          const matchesTrait = card.attributes?.some(
            (a) =>
              a.trait_type.toLowerCase().includes(q) ||
              String(a.value).toLowerCase().includes(q)
          );
          if (!matchesName && !matchesDesc && !matchesTrait) {
            return false;
          }
        }

        // Rarity filter
        if (selectedRarity !== 'All' && card.rarity !== selectedRarity) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.tokenId - a.tokenId;
        if (sortBy === 'oldest') return a.tokenId - b.tokenId;
        if (sortBy === 'price_asc') {
          const priceA = a.price ? parseFloat(a.price) : Infinity;
          const priceB = b.price ? parseFloat(b.price) : Infinity;
          return priceA - priceB;
        }
        if (sortBy === 'price_desc') {
          const priceA = a.price ? parseFloat(a.price) : 0;
          const priceB = b.price ? parseFloat(b.price) : 0;
          return priceB - priceA;
        }
        return 0;
      });
  }, [cards, searchQuery, selectedRarity, sortBy, saleType]);

  const activeFixedCount = cards.filter((c) => c.isListed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#EA580C] font-semibold mb-1">
            <Car className="w-3.5 h-3.5" />
            <span>Decentralized Automotive Marketplace</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Showroom & Marketplace
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 max-w-xl leading-relaxed">
            Discover, buy, and trade rare high-performance collectible car cards verified on blockchain testnets with decentralized IPFS metadata.
          </p>
        </div>

        {/* Live Market count — only listed cards are ever shown publicly.
            Unlisted/owned-only cards stay private to their owner and are
            visible on the "My Collection" page instead. */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto shadow-inner">
          <div className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-[#EA580C] bg-white border border-slate-200/80 shadow-xs">
            Live Market ({activeFixedCount})
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRarity={selectedRarity}
        setSelectedRarity={setSelectedRarity}
        sortBy={sortBy}
        setSortBy={setSortBy}
        saleType={saleType}
        setSaleType={setSaleType}
        totalCards={filteredCards.length}
      />

      {/* Responsive Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <CardItemComponent
              key={card.tokenId}
              card={card}
              currentAddress={currentAddress}
              onViewDetails={onViewDetails}
              onBuy={onBuy}
              onList={onList}
              onCancelListing={onCancelListing}
              onUpdatePrice={onUpdatePrice}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C] mx-auto mb-4">
            <Car className="w-7 h-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
            No vehicles found
          </h3>
          <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
            {searchQuery || selectedRarity !== 'All'
              ? 'Try adjusting your search keywords or active filters.'
              : 'There are currently no vehicles matching your criteria. Mint a new collectible car to get started!'}
          </p>
          <button
            onClick={onNavigateToMint}
            className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mint Car NFT</span>
          </button>
        </div>
      )}
    </div>
  );
};
