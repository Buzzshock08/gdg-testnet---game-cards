import React, { useState } from 'react';
import { CardItem } from '../types/card';
import { X, Tag, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface ListModalProps {
  card: CardItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmList: (tokenId: number, priceEth: string) => Promise<void>;
}

export const ListModal: React.FC<ListModalProps> = ({
  card,
  isOpen,
  onClose,
  onConfirmList,
}) => {
  const [priceEth, setPriceEth] = useState('0.05');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !card) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(priceEth);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid price greater than 0 ETH');
      return;
    }
    setError(null);
    try {
      setIsSubmitting(true);
      await onConfirmList(card.tokenId, priceEth);
      onClose();
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || 'Failed to list card.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold">List Vehicle for Sale</h3>
            <p className="text-xs text-slate-500">
              Token #{card.tokenId} • {card.name}
            </p>
          </div>
        </div>

        {/* Card Thumbnail Mini preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden p-1 flex-shrink-0">
            <img src={card.image} alt={card.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{card.name}</h4>
            <span className="text-[10px] font-mono text-[#EA580C] font-semibold uppercase">
              {card.rarity}
            </span>
          </div>
        </div>

        {/* Listing Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Listing Price (ETH)
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                value={priceEth}
                onChange={(e) => {
                  setPriceEth(e.target.value);
                  setError(null);
                }}
                required
                placeholder="0.05"
                className="w-full pl-4 pr-16 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs font-mono font-bold text-[#EA580C]">
                ETH
              </div>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              You will receive 100% of the sale proceeds upon buyer purchase.
            </p>
          </div>

          {/* Workflow Steps Info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Smart Contract Listing Workflow</span>
            </div>
            <p>
              1. Approve the marketplace contract to manage Card #{card.tokenId}.
            </p>
            <p>
              2. Emit <code className="text-[#EA580C] font-mono bg-white px-1 py-0.5 rounded border border-slate-200">CardListed</code> on-chain with your designated price.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Listing Vehicle...</span>
              ) : (
                <>
                  <span>Confirm Listing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
