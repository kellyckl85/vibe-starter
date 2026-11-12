import React, { useState } from 'react';
import { Asset } from '../../types/market';
import { AssetLogo } from '../AssetLogo';
import { Sparkline } from '../Sparkline';
import { Flame, Star, TrendingUp, TrendingDown, ShieldAlert, BarChart3 } from 'lucide-react';

interface FuturesScreenProps {
  assets: Asset[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: Asset) => void;
  onOpenTrade: (asset: Asset) => void;
}

export const FuturesScreen: React.FC<FuturesScreenProps> = ({
  assets,
  watchlist,
  onToggleWatchlist,
  onSelectAsset,
  onOpenTrade,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'energy' | 'metals' | 'bonds'>('all');

  const futuresAssets = assets.filter(a => a.category === 'futures' || a.category === 'bonds');

  const filtered = futuresAssets.filter(asset => {
    if (activeTab === 'energy') return asset.sector === 'Energy';
    if (activeTab === 'metals') return asset.sector === 'Metals';
    if (activeTab === 'bonds') return asset.category === 'bonds';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Futures, Commodities & Sovereign Yields
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Global energy, precious metals, industrial resources and government treasury curves
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['all', 'energy', 'metals', 'bonds'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize cursor-pointer ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Contracts' : tab === 'bonds' ? 'Bonds & Yields' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Yield Curve Preview Banner */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            US Treasury Yield Curve Benchmark
          </div>
          <span className="text-xs text-slate-400 font-mono">2Y/10Y Spread: +14.3 bps (Normal Curve)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500">2-Year Yield</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">4.282%</div>
            <div className="text-[11px] font-mono text-emerald-500 font-semibold mt-0.5">+0.56%</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500">5-Year Yield</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">4.335%</div>
            <div className="text-[11px] font-mono text-emerald-500 font-semibold mt-0.5">+0.62%</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500">10-Year Benchmark</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">4.425%</div>
            <div className="text-[11px] font-mono text-emerald-500 font-semibold mt-0.5">+0.87%</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500">30-Year Bond</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">4.610%</div>
            <div className="text-[11px] font-mono text-emerald-500 font-semibold mt-0.5">+0.94%</div>
          </div>
        </div>
      </div>

      {/* Futures Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Commodity / Contract</th>
                <th className="py-3 px-4 text-right">Settlement Price</th>
                <th className="py-3 px-4 text-right">Net Change</th>
                <th className="py-3 px-4 text-right">Change %</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">24h High</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">24h Low</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Rating</th>
                <th className="py-3 px-4 text-center w-28">30D Trend</th>
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
                        <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="md" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {asset.symbol}
                            <span className="text-[10px] text-slate-400 font-normal px-1 rounded bg-slate-100 dark:bg-slate-800">
                              {asset.exchange}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{asset.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {asset.category === 'bonds'
                        ? `${asset.price.toFixed(3)}%`
                        : `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
                      {asset.category === 'bonds' ? `${asset.high24h.toFixed(3)}%` : `$${asset.high24h.toFixed(2)}`}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums hidden sm:table-cell">
                      {asset.category === 'bonds' ? `${asset.low24h.toFixed(3)}%` : `$${asset.low24h.toFixed(2)}`}
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
