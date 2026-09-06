import React from 'react';
import { CardRarity, CardAttribute } from '../types/card';
import { Sparkles, ShieldCheck, Gauge } from 'lucide-react';

interface LiveCardPreviewProps {
  name: string;
  description: string;
  rarity: CardRarity;
  attributes: CardAttribute[];
  imagePreviewUrl: string;
}

const RARITY_PREVIEW_STYLES: Record<
  CardRarity,
  { border: string; badge: string; text: string; header: string; badgeBorder: string }
> = {
  Common: {
    border: 'border-slate-200',
    badge: 'bg-slate-100',
    badgeBorder: 'border-slate-300',
    text: 'text-slate-700',
    header: 'bg-slate-50',
  },
  Uncommon: {
    border: 'border-emerald-200',
    badge: 'bg-emerald-50',
    badgeBorder: 'border-emerald-300',
    text: 'text-emerald-700',
    header: 'bg-emerald-50/50',
  },
  Rare: {
    border: 'border-sky-200',
    badge: 'bg-sky-50',
    badgeBorder: 'border-sky-300',
    text: 'text-sky-700',
    header: 'bg-sky-50/50',
  },
  Epic: {
    border: 'border-purple-200',
    badge: 'bg-purple-50',
    badgeBorder: 'border-purple-300',
    text: 'text-purple-700',
    header: 'bg-purple-50/50',
  },
  Legendary: {
    border: 'border-amber-200',
    badge: 'bg-amber-50',
    badgeBorder: 'border-amber-300',
    text: 'text-amber-800',
    header: 'bg-amber-50/50',
  },
  Mythic: {
    border: 'border-orange-200',
    badge: 'bg-orange-50',
    badgeBorder: 'border-orange-300',
    text: 'text-orange-800',
    header: 'bg-orange-50/50',
  },
};

export const LiveCardPreview: React.FC<LiveCardPreviewProps> = ({
  name,
  description,
  rarity,
  attributes,
  imagePreviewUrl,
}) => {
  const style = RARITY_PREVIEW_STYLES[rarity] || RARITY_PREVIEW_STYLES.Common;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-[#EA580C] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Live Card Preview
        </span>
        <span>ERC-721 Standard</span>
      </div>

      {/* Main Card Frame */}
      <div
        className={`relative flex flex-col bg-white border-2 ${style.border} rounded-2xl overflow-hidden shadow-xl transition-all duration-300`}
      >
        {/* Card Header Strip */}
        <div
          className={`flex items-center justify-between px-4 py-3 ${style.header} border-b border-slate-100`}
        >
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
            <span className="text-[#EA580C] font-bold">#</span>
            <span>PREVIEW</span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-wider ${style.badge} ${style.text} border ${style.badgeBorder}`}
          >
            {rarity}
          </span>
        </div>

        {/* Artwork Stage */}
        <div className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/50 p-3.5 flex items-center justify-center overflow-hidden">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="Card Preview"
              className="w-full h-full object-contain rounded-xl shadow-inner"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
              <Gauge className="w-10 h-10 mb-2 opacity-30 text-[#EA580C]" />
              <span className="text-xs font-medium text-slate-500">
                Select template or upload vehicle image
              </span>
            </div>
          )}
        </div>

        {/* Card Details & Dynamic Traits */}
        <div className="p-4 bg-white flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900 truncate">
              {name.trim() || 'Untitled Vehicle Card'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {description.trim() || 'No specs or background description provided yet.'}
            </p>

            {/* Attributes Grid */}
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {attributes.length > 0 ? (
                attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono flex items-center justify-between"
                  >
                    <span className="text-slate-500 truncate mr-1">
                      {attr.trait_type || 'Trait'}:
                    </span>
                    <span className="font-bold text-slate-900 truncate">
                      {String(attr.value) || '—'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-[11px] text-slate-400 italic py-1">
                  Add vehicle performance specs below.
                </div>
              )}
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>IPFS Verified</span>
            </div>
            <span>ApexCards v1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
