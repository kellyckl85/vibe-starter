import React, { useState } from 'react';
import { Asset } from '../../types/market';
import { AssetLogo } from '../AssetLogo';
import { Sparkline } from '../Sparkline';
import {
  Search,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Layers,
} from 'lucide-react';

interface StocksScreenProps {
  assets: Asset[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: Asset) => void;
  onOpenTrade: (asset: Asset) => void;
}

type TabPreset = 'all' | 'gainers' | 'losers' | 'active' | 'large_cap';

export const StocksScreen: React.FC<StocksScreenProps> = ({
  assets,
  watchlist,
  onToggleWatchlist,
  onSelectAsset,
  onOpenTrade,
}) => {
  const [activeTab, setActiveTab] = useState<TabPreset>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'marketCap' | 'price' | 'changePercent' | 'volume'>('marketCap');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter only stocks
  const stockAssets = assets.filter(a => a.category === 'stocks');

  // Available sectors
  const sectors = Array.from(new Set(stockAssets.map(a => a.sector).filter(Boolean)));

  // Filter by tab, sector, search
  const filtered = stockAssets.filter(asset => {
    // Sector filter
    if (selectedSector !== 'all' && asset.sector !== selectedSector) return false;

    // Search query
    if (
      searchQuery &&
      !asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Presets
    if (activeTab === 'gainers') return asset.changePercent > 0;
    if (activeTab === 'losers') return asset.changePercent < 0;
    if (activeTab === 'active') return asset.volumeNumeric > 25000000;
    if (activeTab === 'large_cap') return (asset.marketCapNumeric || 0) > 1000000000000;

    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let aVal = 0;
    let bVal = 0;

    if (sortField === 'marketCap') {
      aVal = a.marketCapNumeric || 0;
      bVal = b.marketCapNumeric || 0;
    } else if (sortField === 'price') {
      aVal = a.price;
      bVal = b.price;
    } else if (sortField === 'changePercent') {
      aVal = a.changePercent;
      bVal = b.changePercent;
    } else if (sortField === 'volume') {
      aVal = a.volumeNumeric;
      bVal = b.volumeNumeric;
    }

    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Preset Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Stocks
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Most Active
          </button>
          <button
            onClick={() => setActiveTab('gainers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'gainers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'losers'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Top Losers
          </button>
          <button
            onClick={() => setActiveTab('large_cap')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'large_cap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            $1T+ Mega Caps
          </button>
        </div>

        {/* Search & Sector Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter ticker or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium cursor-pointer"
          >
            <option value="all">All Sectors</option>
            {sectors.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* High Density TradingView Screener Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Symbol & Name</th>
                <th
                  onClick={() => toggleSort('price')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-800 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    Price <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('changePercent')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-800 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    Change % <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('volume')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-800 dark:hover:text-white hidden sm:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    Volume <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('marketCap')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-800 dark:hover:text-white hidden md:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    Market Cap <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">P/E Ratio</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Technical</th>
                <th className="py-3 px-4 text-center w-28">7D Trend</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No stocks match the selected criteria.
                  </td>
                </tr>
              ) : (
                sorted.map(asset => {
                  const isUp = asset.changePercent >= 0;
                  const inWatchlist = watchlist.includes(asset.symbol);

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => onSelectAsset(asset)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      {/* Watchlist Star */}
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
                          title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Symbol & Company */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="md" />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {asset.symbol}
                              <span className="text-[10px] text-slate-400 font-normal px-1 rounded bg-slate-100 dark:bg-slate-800">
                                {asset.exchange}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[160px] sm:max-w-[220px]">
                              {asset.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        ${asset.price.toFixed(2)}
                      </td>

                      {/* Change % */}
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

                      {/* Volume */}
                      <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden sm:table-cell">
                        {asset.volume}
                      </td>

                      {/* Market Cap */}
                      <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden md:table-cell">
                        {asset.marketCap}
                      </td>

                      {/* P/E Ratio */}
                      <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden lg:table-cell">
                        {asset.peRatio ? asset.peRatio.toFixed(1) : '—'}
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

                      {/* Sparkline */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <Sparkline data={asset.sparkline} width={75} height={22} isPositive={isUp} />
                        </div>
                      </td>

                      {/* Actions: Trade Button */}
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
