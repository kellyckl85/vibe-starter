import React, { useState } from 'react';
import { Asset } from '../../types/market';
import { forexMatrix } from '../../data/mockMarketData';
import { AssetLogo } from '../AssetLogo';
import { Sparkline } from '../Sparkline';
import { ArrowUpDown, Star, Compass, DollarSign, Layers } from 'lucide-react';

interface ForexScreenProps {
  assets: Asset[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: Asset) => void;
  onOpenTrade: (asset: Asset) => void;
}

export const ForexScreen: React.FC<ForexScreenProps> = ({
  assets,
  watchlist,
  onToggleWatchlist,
  onSelectAsset,
  onOpenTrade,
}) => {
  const forexAssets = assets.filter(a => a.category === 'forex');

  // Relative Currency Strength (computed against baseline)
  const currencyStrength = [
    { currency: 'USD', strength: 82, status: 'Strong', color: 'bg-emerald-500' },
    { currency: 'JPY', strength: 71, status: 'Bullish', color: 'bg-emerald-400' },
    { currency: 'GBP', strength: 55, status: 'Neutral', color: 'bg-blue-500' },
    { currency: 'EUR', strength: 38, status: 'Soft', color: 'bg-amber-500' },
    { currency: 'AUD', strength: 42, status: 'Weak', color: 'bg-rose-400' },
    { currency: 'CHF', strength: 64, status: 'Moderate', color: 'bg-blue-400' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Relative Currency Strength Meter */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-500" />
              Forex Market & Cross Rates
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Foreign exchange rates, currency strength matrix & pip analytics
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">24/5 FX IDC Feed</span>
        </div>

        {/* Currency Strength Bars */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Relative Currency Strength Meter
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {currencyStrength.map(c => (
              <div
                key={c.currency}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">{c.currency}</span>
                  <span className="font-mono text-[11px] text-slate-400 font-semibold">{c.strength}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.strength}%` }} />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{c.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. TradingView Currency Cross-Rates Matrix */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Currency Cross Rates Matrix
          </h3>
          <span className="text-[11px] text-slate-400">Base Currency (Row) vs Quote Currency (Column)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-bold text-[11px] text-slate-500">
                <th className="py-2.5 px-3 text-left">Base / Quote</th>
                {forexMatrix.currencies.map(cur => (
                  <th key={cur} className="py-2.5 px-3 font-extrabold text-slate-700 dark:text-slate-200">
                    {cur}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {forexMatrix.currencies.map(base => (
                <tr key={base} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-left font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                    {base}
                  </td>
                  {forexMatrix.currencies.map(quote => {
                    if (base === quote) {
                      return (
                        <td key={quote} className="py-2.5 px-3 text-slate-300 dark:text-slate-600 font-mono">
                          —
                        </td>
                      );
                    }

                    const pairKey = `${base}/${quote}`;
                    const inverseKey = `${quote}/${base}`;
                    const pair = forexMatrix.rates[pairKey as keyof typeof forexMatrix.rates];
                    const inverse = forexMatrix.rates[inverseKey as keyof typeof forexMatrix.rates];

                    let rate = 0;
                    let change = 0;

                    if (pair) {
                      rate = pair.rate;
                      change = pair.change;
                    } else if (inverse) {
                      rate = Number((1 / inverse.rate).toFixed(4));
                      change = -inverse.change;
                    }

                    if (!rate) {
                      return <td key={quote} className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">1.000</td>;
                    }

                    const isUp = change >= 0;

                    return (
                      <td
                        key={quote}
                        onClick={() => {
                          const target = assets.find(a => a.symbol === pairKey || a.symbol === `${base}${quote}`);
                          if (target) onSelectAsset(target);
                        }}
                        className={`py-2 px-2.5 font-mono cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                          isUp
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        <div className="font-bold text-[11px] tabular-nums">
                          {rate >= 10 ? rate.toFixed(2) : rate.toFixed(4)}
                        </div>
                        <div className="text-[9px] tabular-nums font-semibold">
                          {isUp ? '+' : ''}{change.toFixed(2)}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Major Forex Pairs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Major & Cross Currency Pairs
          </span>
          <span className="text-xs text-slate-400">Real-time Bid/Ask Spreads</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Pair</th>
                <th className="py-3 px-4 text-right">Bid (Sell)</th>
                <th className="py-3 px-4 text-right">Ask (Buy)</th>
                <th className="py-3 px-4 text-right">Pip Spread</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Technical</th>
                <th className="py-3 px-4 text-center w-28">30D Trend</th>
                <th className="py-3 px-4 text-right">Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {forexAssets.map(asset => {
                const isUp = asset.changePercent >= 0;
                const inWatchlist = watchlist.includes(asset.symbol);
                const pipSpread = asset.price > 50 ? '1.2' : '0.8';
                const bid = asset.price;
                const ask = asset.price + (asset.price > 50 ? 0.012 : 0.00008);

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
                          <div className="font-bold text-slate-900 dark:text-white">{asset.symbol}</div>
                          <div className="text-[11px] text-slate-500">{asset.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-500 tabular-nums">
                      {asset.price > 50 ? bid.toFixed(2) : bid.toFixed(4)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-500 tabular-nums">
                      {asset.price > 50 ? ask.toFixed(2) : ask.toFixed(4)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums">
                      {pipSpread} pips
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
