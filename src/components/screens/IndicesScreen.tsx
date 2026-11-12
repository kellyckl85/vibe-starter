import React, { useState } from 'react';
import { Asset } from '../../types/market';
import { AssetLogo } from '../AssetLogo';
import { Sparkline } from '../Sparkline';
import { Globe, ArrowUpRight, ArrowDownRight, Layers, Star } from 'lucide-react';

interface IndicesScreenProps {
  assets: Asset[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: Asset) => void;
}

export const IndicesScreen: React.FC<IndicesScreenProps> = ({
  assets,
  watchlist,
  onToggleWatchlist,
  onSelectAsset,
}) => {
  const [regionFilter, setRegionFilter] = useState<'all' | 'Americas' | 'Europe' | 'Asia-Pacific'>('all');

  const indices = assets.filter(a => a.category === 'indices');

  const filtered = regionFilter === 'all'
    ? indices
    : indices.filter(a => {
        if (regionFilter === 'Americas') return a.sector?.includes('US');
        if (regionFilter === 'Europe') return a.sector?.includes('Europe');
        if (regionFilter === 'Asia-Pacific') return a.sector?.includes('Asia');
        return true;
      });

  return (
    <div className="space-y-6">
      {/* Header and Region Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            World Major Stock Indices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time global equity index benchmarks, breadth & sector performance
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['all', 'Americas', 'Europe', 'Asia-Pacific'] as const).map(reg => (
            <button
              key={reg}
              onClick={() => setRegionFilter(reg)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize cursor-pointer ${
                regionFilter === reg
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {reg === 'all' ? 'All Regions' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Index Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.slice(0, 3).map(index => {
          const isUp = index.changePercent >= 0;
          return (
            <button
              key={index.id}
              onClick={() => onSelectAsset(index)}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all text-left shadow-xs cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AssetLogo symbol={index.symbol} logoUrl={index.logoUrl} size="md" />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {index.symbol}
                      </div>
                      <div className="text-xs text-slate-400">{index.name}</div>
                    </div>
                  </div>
                  <span
                    className={`flex items-center text-xs font-mono font-bold ${
                      isUp ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {isUp ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                    {index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-xs font-mono font-semibold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isUp ? '+' : ''}{index.change.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Sparkline data={index.sparkline} width={130} height={28} isPositive={isUp} />
                <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {index.technicalRating}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Indices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Index Symbol & Region</th>
                <th className="py-3 px-4 text-right">Last Price</th>
                <th className="py-3 px-4 text-right">Daily Change</th>
                <th className="py-3 px-4 text-right">Daily Change %</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">24h High</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">24h Low</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Technical</th>
                <th className="py-3 px-4 text-center w-28">30D Trend</th>
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

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <AssetLogo symbol={asset.symbol} logoUrl={asset.logoUrl} size="md" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {asset.symbol}
                            <span className="text-[10px] text-slate-400 font-normal px-1 rounded bg-slate-100 dark:bg-slate-800">
                              {asset.sector}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{asset.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td
                      className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${
                        isUp ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isUp ? '+' : ''}{asset.change.toFixed(2)}
                    </td>

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

                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden sm:table-cell">
                      {asset.high24h.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden sm:table-cell">
                      {asset.low24h.toLocaleString()}
                    </td>

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

                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={asset.sparkline} width={75} height={22} isPositive={isUp} />
                      </div>
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
