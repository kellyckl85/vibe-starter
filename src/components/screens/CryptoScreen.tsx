import React, { useState } from 'react';
import { Asset } from '../../types/market';
import { AssetLogo } from '../AssetLogo';
import { Sparkline } from '../Sparkline';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Star,
  Search,
  ArrowUpDown,
  Zap,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface CryptoScreenProps {
  assets: Asset[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: Asset) => void;
  onOpenTrade: (asset: Asset) => void;
}

export const CryptoScreen: React.FC<CryptoScreenProps> = ({
  assets,
  watchlist,
  onToggleWatchlist,
  onSelectAsset,
  onOpenTrade,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cryptoAssets = assets.filter(a => a.category === 'crypto');
  const categories = Array.from(new Set(cryptoAssets.map(a => a.sector).filter(Boolean)));

  const filtered = cryptoAssets.filter(asset => {
    if (selectedCategory !== 'all' && asset.sector !== selectedCategory) return false;
    if (
      searchQuery &&
      !asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Global Crypto Market Barometer KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Market Cap</div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">$2.64T</div>
          <div className="text-[11px] font-mono text-emerald-500 font-semibold mt-0.5">+2.84% 24h</div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">24h Total Volume</div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">$89.4B</div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">Across 42 Exchanges</div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bitcoin Dominance</div>
          <div className="text-lg font-bold font-mono tabular-nums text-amber-500 mt-1">54.6%</div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">ETH: 16.4%</div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fear & Greed Index</div>
          <div className="text-lg font-bold font-mono tabular-nums text-emerald-500 mt-1">78 / 100</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Extreme Greed</div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 col-span-2 md:col-span-4 lg:col-span-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">DeFi TVL Locked</div>
          <div className="text-lg font-bold font-mono tabular-nums text-blue-500 mt-1">$118.2B</div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">Ethereum & Solana lead</div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Coins
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat!)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search crypto token..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 3. Crypto Screen Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4 text-right">Price (USD)</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">24h High</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">24h Low</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">24h Volume</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">Market Cap</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Technical</th>
                <th className="py-3 px-4 text-center w-28">7D Trend</th>
                <th className="py-3 px-4 text-right">Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map(asset => {
                const isUp = asset.changePercent >= 0;
                const inWatchlist = watchlist.includes(asset.symbol);

                return (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Watchlist */}
                    <td
                      className="py-3 px-4"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleWatchlist(asset.symbol);
                      }}
                    >
                      <button
                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                          inWatchlist ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Asset Name & Logo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="md" />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {asset.symbol}
                            <span className="text-[10px] text-slate-400 font-normal px-1 rounded bg-slate-100 dark:bg-slate-800">
                              {asset.sector}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      ${asset.price >= 1000 ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price.toFixed(4)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] ${
                          isUp
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* 24h High */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden sm:table-cell">
                      ${asset.high24h >= 1000 ? asset.high24h.toLocaleString() : asset.high24h.toFixed(2)}
                    </td>

                    {/* 24h Low */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden sm:table-cell">
                      ${asset.low24h >= 1000 ? asset.low24h.toLocaleString() : asset.low24h.toFixed(2)}
                    </td>

                    {/* 24h Volume */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden md:table-cell">
                      {asset.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden lg:table-cell">
                      {asset.marketCap}
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 px-4 text-center hidden md:table-cell">
                      <span
                        className={`text-[11px] font-semibold ${
                          asset.technicalRating.includes('Buy')
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : asset.technicalRating.includes('Sell')
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {asset.technicalRating}
                      </span>
                    </td>

                    {/* 7D Trend Sparkline */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={asset.sparkline} width={75} height={22} isPositive={isUp} />
                      </div>
                    </td>

                    {/* Trade Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenTrade(asset);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-xs"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
