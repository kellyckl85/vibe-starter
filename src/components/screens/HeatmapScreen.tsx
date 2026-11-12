import React, { useState } from 'react';
import { stockHeatmapData, cryptoHeatmapData } from '../../data/mockMarketData';
import { Asset, HeatmapNode } from '../../types/market';
import { AssetLogo } from '../AssetLogo';
import { TrendingUp, TrendingDown, Layers, Filter } from 'lucide-react';

interface HeatmapScreenProps {
  onSelectAssetBySymbol: (symbol: string) => void;
}

export const HeatmapScreen: React.FC<HeatmapScreenProps> = ({ onSelectAssetBySymbol }) => {
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | 'YTD'>('1D');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<HeatmapNode | null>(null);

  const rawData = heatmapType === 'stocks' ? stockHeatmapData : cryptoHeatmapData;

  // Filter by sector if selected
  const filteredData = sectorFilter === 'all'
    ? rawData
    : rawData.filter(d => d.sector === sectorFilter);

  // Group by sector
  const sectors = Array.from(new Set(rawData.map(d => d.sector)));
  const totalMarketCap = filteredData.reduce((acc, cur) => acc + cur.marketCap, 0);

  // Color mapper based on % change
  const getColor = (pct: number) => {
    if (pct >= 4.0) return 'bg-emerald-600 hover:bg-emerald-500 text-white';
    if (pct >= 2.0) return 'bg-emerald-500 hover:bg-emerald-400 text-white';
    if (pct > 0) return 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100';
    if (pct === 0) return 'bg-slate-600 hover:bg-slate-500 text-slate-100';
    if (pct > -2.0) return 'bg-rose-700/80 hover:bg-rose-600 text-rose-100';
    if (pct > -4.0) return 'bg-rose-600 hover:bg-rose-500 text-white';
    return 'bg-rose-800 hover:bg-rose-700 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            {heatmapType === 'stocks' ? 'S&P 500 Market Heatmap' : 'Cryptocurrency Market Heatmap'}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Tile size represents Market Capitalization</span>
            <span>·</span>
            <span>Color represents {timeframe} Performance</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => { setHeatmapType('stocks'); setSectorFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                heatmapType === 'stocks'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              US Stocks
            </button>
            <button
              onClick={() => { setHeatmapType('crypto'); setSectorFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                heatmapType === 'crypto'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Crypto
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['1D', '1W', '1M', 'YTD'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium cursor-pointer"
            >
              <option value="all">All Sectors</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Heatmap Legend Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-rose-500">-5.0%</span>
          <div className="flex h-3 w-44 rounded-sm overflow-hidden">
            <div className="flex-1 bg-rose-800" />
            <div className="flex-1 bg-rose-600" />
            <div className="flex-1 bg-rose-700/80" />
            <div className="w-2 bg-slate-600" />
            <div className="flex-1 bg-emerald-700/80" />
            <div className="flex-1 bg-emerald-500" />
            <div className="flex-1 bg-emerald-600" />
          </div>
          <span className="font-semibold text-emerald-500">+5.0%</span>
        </div>
        <div className="text-slate-400">
          Showing {filteredData.length} market leaders · Click any block to view full chart & trade
        </div>
      </div>

      {/* Interactive Treemap Canvas / Mosaic Grid */}
      <div className="space-y-6">
        {sectors
          .filter(sec => sectorFilter === 'all' || sectorFilter === sec)
          .map(sec => {
            const sectorItems = filteredData.filter(d => d.sector === sec);
            if (sectorItems.length === 0) return null;

            return (
              <div key={sec} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-1">
                  <span>{sec}</span>
                  <span className="font-mono text-[11px] font-normal text-slate-500">
                    ${(sectorItems.reduce((acc, c) => acc + c.marketCap, 0) / (heatmapType === 'stocks' ? 1000 : 1)).toFixed(2)}T
                  </span>
                </div>

                {/* Sized Grid for the Sector */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {sectorItems.map(item => {
                    const isMega = item.marketCap > 1000;
                    const isLarge = item.marketCap > 300;
                    const colSpan = isMega
                      ? 'col-span-2 row-span-2 min-h-36'
                      : isLarge
                      ? 'col-span-1 min-h-24'
                      : 'col-span-1 min-h-20';

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectAssetBySymbol(item.symbol)}
                        onMouseEnter={() => setHoveredNode(item)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className={`relative p-3 rounded-lg flex flex-col justify-between transition-all duration-150 transform hover:scale-[1.02] hover:z-10 shadow-xs cursor-pointer text-left ${getColor(
                          item.changePercent
                        )} ${colSpan}`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-extrabold text-sm tracking-tight leading-none">
                              {item.symbol}
                            </div>
                            <div className="text-[11px] opacity-90 truncate max-w-[120px] mt-0.5 font-medium">
                              {item.name}
                            </div>
                          </div>

                          <AssetLogo
                            symbol={item.symbol}
                            logoSlug={item.logoSlug}
                            size={isMega ? 'md' : 'sm'}
                            className="bg-white/20 border-white/20"
                          />
                        </div>

                        <div className="mt-2">
                          <div className="text-base font-bold font-mono tabular-nums leading-tight">
                            {item.changePercent > 0 ? '+' : ''}
                            {item.changePercent.toFixed(2)}%
                          </div>
                          <div className="text-[11px] font-mono tabular-nums opacity-85">
                            ${item.price >= 1000 ? item.price.toLocaleString() : item.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Subtle market cap badge */}
                        <div className="absolute bottom-2 right-2 text-[10px] font-mono opacity-70">
                          {heatmapType === 'stocks' ? `$${(item.marketCap / 1000).toFixed(1)}T` : `$${item.marketCap.toFixed(1)}B`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
