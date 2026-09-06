import React from 'react';
import { CardRarity } from '../types/card';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc';
export type SaleTypeFilter = 'all' | 'fixed';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRarity: string;
  setSelectedRarity: (rarity: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  saleType?: SaleTypeFilter;
  setSaleType?: (type: SaleTypeFilter) => void;
  totalCards: number;
}

const RARITY_OPTIONS: ('All' | CardRarity)[] = [
  'All',
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
  'Mythic',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedRarity,
  setSelectedRarity,
  sortBy,
  setSortBy,
  totalCards,
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cars by model, HP, aerodynamics, traits..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
          />
        </div>

        {/* Sort & Stats Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              <strong className="text-slate-900">{totalCards}</strong> vehicles
            </span>

            <div className="relative flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#EA580C] shadow-xs cursor-pointer"
              >
                <option value="newest">Recently Listed / Newest</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Rarity Pill Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1 flex-shrink-0">
          <SlidersHorizontal className="w-3 h-3 text-[#EA580C]" />
          Tier:
        </span>
        {RARITY_OPTIONS.map((rarity) => {
          const isSelected = selectedRarity === rarity;
          return (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#EA580C] text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {rarity}
            </button>
          );
        })}
      </div>
    </div>
  );
};
