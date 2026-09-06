import React, { useState, useEffect } from 'react';
import { CardItem } from '../types/card';
import { shortenAddress } from '../services/contractService';
import { formatUsdDisplay, getEthUsdPrice } from '../services/ethPriceService';
import { CONTRACT_ADDRESS_SEPOLIA } from '../config/contracts';
import { PRESET_CARDS } from '../data/placeholderCards';

const DEFAULT_CARD_IMAGE = PRESET_CARDS[0].svgArt;
import {
  X,
  Tag,
  ShoppingCart,
  Copy,
  Check,
  Flame,
  Gauge,
  Sparkles,
  History,
  ShieldCheck,
  Edit3,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface CardDetailModalProps {
  card: CardItem | null;
  currentAddress?: string;
  onClose: () => void;
  onBuy: (card: CardItem) => void;
  onList: (card: CardItem) => void;
  onCancelListing: (card: CardItem) => void;
  onOpenUpdatePrice?: (card: CardItem) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  currentAddress,
  onClose,
  onBuy,
  onList,
  onCancelListing,
  onOpenUpdatePrice,
}) => {
  const [copiedTokenUri, setCopiedTokenUri] = useState(false);
  const [copiedOwner, setCopiedOwner] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [ethUsdRate, setEthUsdRate] = useState<number>(3250);
  const [activeTab, setActiveTab] = useState<'details' | 'provenance'>('details');

  useEffect(() => {
    getEthUsdPrice().then(setEthUsdRate).catch(() => {});
  }, []);

  if (!card) return null;

  const isOwner =
    currentAddress &&
    (card.owner.toLowerCase() === currentAddress.toLowerCase() ||
      (card.seller && card.seller.toLowerCase() === currentAddress.toLowerCase()));

  const handleCopyUri = () => {
    navigator.clipboard.writeText(card.tokenURI);
    setCopiedTokenUri(true);
    setTimeout(() => setCopiedTokenUri(false), 2000);
  };

  const handleCopyOwner = () => {
    navigator.clipboard.writeText(card.owner);
    setCopiedOwner(true);
    setTimeout(() => setCopiedOwner(false), 2000);
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS_SEPOLIA);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 my-8 animate-in fade-in max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Dominant Artwork Display */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/60 border border-slate-200 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden shadow-inner">
              <img
                src={card.image}
                alt={card.name}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== DEFAULT_CARD_IMAGE) {
                    img.src = DEFAULT_CARD_IMAGE;
                  }
                }}
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-orange-200 text-xs font-mono font-bold text-[#EA580C] shadow-xs">
                #{card.tokenId}
              </div>
            </div>

            {/* Token URI / IPFS Explorer */}
            <div className="w-full mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
              <div className="truncate mr-2">
                <span className="text-slate-400 font-semibold">IPFS URI:</span> {card.tokenURI}
              </div>
              <button
                onClick={handleCopyUri}
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy IPFS URI"
              >
                {copiedTokenUri ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Contract Details */}
            <div className="w-full mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contract:</span>
                <div className="flex items-center gap-1">
                  <span>{shortenAddress(CONTRACT_ADDRESS_SEPOLIA)}</span>
                  <button onClick={handleCopyContract} className="p-0.5 hover:text-[#EA580C]">
                    {copiedContract ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Standard:</span>
                <span className="text-slate-900 font-bold">ERC-721</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Network:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-600" />
                  Sepolia (Simulated EVM)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Card Metadata, Attributes & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] border border-orange-200 text-xs font-mono font-bold uppercase tracking-wider">
                    {card.rarity}
                  </span>
                  {card.isListed ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Direct Sale Listing
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-semibold">
                      In Private Garage
                    </span>
                  )}
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  {card.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Tabs: Specifications vs Provenance */}
              <div className="flex border-b border-slate-200 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 px-3 border-b-2 font-semibold cursor-pointer transition-colors ${
                    activeTab === 'details'
                      ? 'border-[#EA580C] text-[#EA580C]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Technical Specifications
                </button>
                <button
                  onClick={() => setActiveTab('provenance')}
                  className={`pb-2.5 px-3 border-b-2 font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'provenance'
                      ? 'border-[#EA580C] text-[#EA580C]'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Ownership & Provenance</span>
                </button>
              </div>

              {activeTab === 'details' ? (
                <>
                  {/* Attributes Grid */}
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2 block">
                      Performance Telemetry & Specs
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {card.attributes && card.attributes.length > 0 ? (
                        card.attributes.map((attr, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left"
                          >
                            <span className="text-[10px] font-mono uppercase text-slate-400 block truncate">
                              {attr.trait_type}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-900 truncate block mt-0.5">
                              {attr.value}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-xs text-slate-400 py-2">
                          Standard factory specifications
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ownership & Escrow Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Current Owner:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-900 font-semibold">
                          {shortenAddress(card.owner)}
                        </span>
                        {isOwner && (
                          <span className="px-1.5 py-0.2 rounded bg-orange-100 text-[#EA580C] text-[10px] font-mono font-bold">
                            YOU
                          </span>
                        )}
                        <button
                          onClick={handleCopyOwner}
                          className="p-1 hover:text-[#EA580C]"
                          title="Copy Address"
                        >
                          {copiedOwner ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {card.seller && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Marketplace Seller:</span>
                        <span className="font-mono text-slate-700 font-medium">
                          {shortenAddress(card.seller)}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Activity & Provenance Tab */
                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {((card.activity && card.activity.length > 0) || (card.history && card.history.length > 0)) ? (
                    (card.activity || card.history || []).map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                            <span className="capitalize">{act.type.replace('_', ' ')}</span>
                            {act.price && (
                              <span className="text-[#EA580C] font-mono">
                                • {act.price} ETH
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right font-mono text-[11px] text-slate-600">
                          <div>From: {shortenAddress(act.from)}</div>
                          {act.to && <div>To: {shortenAddress(act.to)}</div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] font-mono font-bold text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Newly Minted • Recently Launched</span>
                      </div>
                      <p className="text-xs text-slate-500 max-w-xs">
                        This digital collectible car is pristine in its original mint state with no secondary sales history yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price Banner & Primary Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
              
              {/* Fixed-Price Listing Banner */}
              {card.isListed && card.price && (
                <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
                      Listing Price
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-heading text-2xl font-bold text-slate-900">
                        {card.price}
                      </span>
                      <span className="text-sm font-mono font-bold text-[#EA580C]">
                        ETH
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        (≈ {formatUsdDisplay(card.price, ethUsdRate)})
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 font-mono">
                    <span className="text-emerald-700 font-semibold">Instant Execution</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {card.isListed ? (
                  isOwner ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenUpdatePrice && onOpenUpdatePrice(card);
                        }}
                        className="py-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-semibold text-[#EA580C] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Update Price</span>
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onCancelListing(card);
                        }}
                        className="py-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 transition-colors cursor-pointer"
                      >
                        Cancel Listing
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onClose();
                        onBuy(card);
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy Now for {card.price} ETH</span>
                    </button>
                  )
                ) : isOwner ? (
                  <button
                    onClick={() => {
                      onClose();
                      onList(card);
                    }}
                    className="w-full py-3.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-300 text-xs font-semibold text-[#EA580C] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Tag className="w-4 h-4 text-[#EA580C]" />
                    <span>List Vehicle for Fixed Price Sale</span>
                  </button>
                ) : (
                  <div className="w-full py-3.5 rounded-xl bg-slate-100 text-center text-xs text-slate-500 font-medium">
                    This vehicle is in the owner's vault and not currently listed for sale.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
