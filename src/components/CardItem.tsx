import React, { useState, useEffect } from 'react';
import { CardItem as CardItemType, CardRarity } from '../types/card';
import { shortenAddress } from '../services/contractService';
import { formatUsdDisplay, getEthUsdPrice } from '../services/ethPriceService';
import { PRESET_CARDS } from '../data/placeholderCards';
import { Tag, ShoppingCart, Eye, Sparkles, Gauge, Edit3 } from 'lucide-react';

const DEFAULT_CARD_IMAGE = PRESET_CARDS[0].svgArt;

interface CardItemProps {
  card: CardItemType;
  currentAddress?: string;
  onViewDetails: (card: CardItemType) => void;
  onBuy?: (card: CardItemType) => void;
  onList?: (card: CardItemType) => void;
  onCancelListing?: (card: CardItemType) => void;
  onUpdatePrice?: (card: CardItemType) => void;
  showActions?: boolean;
}

const RARITY_THEMES: Record<
  CardRarity,
  {
    border: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    accent: string;
    badgeBorder: string;
  }
> = {
  Common: {
    border: 'border-slate-200',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    glow: 'hover:border-slate-400 hover:shadow-slate-200',
    accent: '#64748B',
  },
  Uncommon: {
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-300',
    glow: 'hover:border-emerald-400 hover:shadow-emerald-100',
    accent: '#059669',
  },
  Rare: {
    border: 'border-sky-200',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-300',
    glow: 'hover:border-sky-400 hover:shadow-sky-100',
    accent: '#0284C7',
  },
  Epic: {
    border: 'border-purple-200',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-300',
    glow: 'hover:border-purple-400 hover:shadow-purple-100',
    accent: '#7C3AED',
  },
  Legendary: {
    border: 'border-amber-200',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-300',
    glow: 'hover:border-amber-400 hover:shadow-amber-100',
    accent: '#D97706',
  },
  Mythic: {
    border: 'border-orange-200',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-800',
    badgeBorder: 'border-orange-300',
    glow: 'hover:border-orange-400 hover:shadow-orange-100',
    accent: '#EA580C',
  },
};

export const CardItem: React.FC<CardItemProps> = ({
  card,
  currentAddress,
  onViewDetails,
  onBuy,
  onList,
  onCancelListing,
  onUpdatePrice,
  showActions = true,
}) => {
  const [ethUsdRate, setEthUsdRate] = useState<number>(3250);

  useEffect(() => {
    getEthUsdPrice().then(setEthUsdRate).catch(() => {});
  }, []);

  const theme = RARITY_THEMES[card.rarity] || RARITY_THEMES.Common;
  const isOwner =
    currentAddress &&
    (card.owner.toLowerCase() === currentAddress.toLowerCase() ||
      (card.seller && card.seller.toLowerCase() === currentAddress.toLowerCase()));

  const primaryTraits = card.attributes?.slice(0, 2) || [];

  return (
    <div
      className={`group relative flex flex-col bg-white border ${theme.border} ${theme.glow} rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl`}
    >
      {/* Top Header Strip: Token ID + Rarity */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-1 font-mono text-slate-500 font-medium">
          <span className="text-[#EA580C] font-bold">#</span>
          <span>{card.tokenId}</span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-wider ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}
        >
          {card.rarity}
        </span>
      </div>

      {/* Visually Dominant Artwork Frame */}
      <div
        className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/50 overflow-hidden cursor-pointer flex items-center justify-center p-3.5 select-none"
        onClick={() => onViewDetails(card)}
      >
        {card.image ? (
          <img
            src={card.image}
            alt={card.name}
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src !== DEFAULT_CARD_IMAGE) {
                img.src = DEFAULT_CARD_IMAGE;
              }
            }}
            className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Sparkles className="w-8 h-8 mb-1 opacity-40" />
            <span className="text-xs">No artwork</span>
          </div>
        )}

        {/* Badges Overlays */}
        {card.isListed ? (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-orange-200 text-[#EA580C] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Tag className="w-3 h-3 text-[#EA580C]" />
            <span>For Sale</span>
          </div>
        ) : null}
      </div>

      {/* Card Info & Attribute Specs */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h4
            onClick={() => onViewDetails(card)}
            className="font-heading text-base font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors line-clamp-1 cursor-pointer"
          >
            {card.name}
          </h4>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {card.description}
          </p>

          {/* Key Traits Badges */}
          {primaryTraits.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {primaryTraits.map((attr, idx) => (
                <div
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-mono flex items-center gap-1"
                >
                  <span className="text-slate-500">{attr.trait_type}:</span>
                  <span className="font-semibold text-slate-900">{attr.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] font-mono uppercase text-slate-500 font-medium">
              {card.isListed ? 'Price' : 'Owner'}
            </span>
            {card.isListed && card.price ? (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-bold text-lg text-slate-900">
                    {card.price}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#EA580C]">ETH</span>
                </div>
                <span className="text-xs font-bold font-mono text-slate-400 block -mt-0.5">
                  ≈ {formatUsdDisplay(card.price, ethUsdRate)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-700 font-medium">
                {shortenAddress(card.owner)}
              </span>
            )}
          </div>

          {/* Contextual Action Button */}
          {showActions && (
            <div>
              {card.isListed ? (
                isOwner ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdatePrice && onUpdatePrice(card)}
                      className="p-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#EA580C]"
                      title="Update Price"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onCancelListing && onCancelListing(card)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 transition-colors shadow-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onBuy && onBuy(card)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-xs font-semibold text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Buy</span>
                  </button>
                )
              ) : isOwner ? (
                <button
                  onClick={() => onList && onList(card)}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-300 text-xs font-semibold text-[#EA580C] transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>List</span>
                </button>
              ) : (
                <button
                  onClick={() => onViewDetails(card)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title="View Car Specs"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
