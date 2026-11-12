import React, { useState, useEffect, useRef } from 'react';
import { Asset, AssetCategory } from '../types/market';
import { AssetLogo } from './AssetLogo';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface MarketSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const MarketSearchModal: React.FC<MarketSearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AssetCategory>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setCategoryFilter('all');
    }
  }, [isOpen]);

  // Keyboard shortcut for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter(asset => {
    if (categoryFilter !== 'all' && asset.category !== categoryFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      (asset.sector && asset.sector.toLowerCase().includes(q))
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbol, company, crypto, currency or index..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 hidden sm:inline-block">
            ESC
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
          {(['all', 'stocks', 'crypto', 'indices', 'forex', 'futures', 'bonds'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors capitalize cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No instruments found for "{query}".
            </div>
          ) : (
            filteredAssets.slice(0, 15).map(asset => {
              const isUp = asset.changePercent >= 0;

              return (
                <button
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-lg flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] text-slate-400 px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 uppercase">
                          {asset.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-sm">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        {asset.category === 'forex'
                          ? asset.price.toFixed(4)
                          : asset.category === 'bonds'
                          ? `${asset.price.toFixed(3)}%`
                          : `$${asset.price >= 1000 ? asset.price.toLocaleString() : asset.price.toFixed(2)}`}
                      </div>
                      <div
                        className={`font-mono text-[11px] font-bold tabular-nums ${
                          isUp ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
