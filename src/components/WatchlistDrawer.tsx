import React, { useState } from 'react';
import { Asset, PortfolioPosition } from '../types/market';
import { AssetLogo } from './AssetLogo';
import { Sparkline } from './Sparkline';
import {
  X,
  Star,
  Trash2,
  TrendingUp,
  TrendingDown,
  Briefcase,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  assets: Asset[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: Asset) => void;
  positions: PortfolioPosition[];
  paperBalance: number;
  onClosePosition: (positionId: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  assets,
  onToggleWatchlist,
  onSelectAsset,
  positions,
  paperBalance,
  onClosePosition,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'watchlist' | 'portfolio'>('watchlist');

  // Filter watchlist assets
  const watchlistAssets = watchlistSymbols
    .map(sym => assets.find(a => a.symbol === sym))
    .filter((a): a is Asset => !!a);

  // Compute portfolio totals
  const totalInvested = positions.reduce((acc, p) => acc + p.totalCost, 0);
  const totalCurrentValue = positions.reduce((acc, p) => acc + p.quantity * p.currentPrice, 0);
  const totalUnrealizedPnl = totalCurrentValue - totalInvested;
  const portfolioEquity = paperBalance + totalCurrentValue;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md h-full bg-white dark:bg-[#131722] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'watchlist'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Watchlist ({watchlistSymbols.length})
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'portfolio'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Paper Portfolio ({positions.length})
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'watchlist' ? (
            <div className="space-y-3">
              {watchlistAssets.length === 0 ? (
                <div className="text-center py-16 space-y-2 text-slate-400">
                  <Star className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs font-medium">Your watchlist is empty.</p>
                  <p className="text-[11px] text-slate-500">
                    Click the star icon next to any ticker to pin it here.
                  </p>
                </div>
              ) : (
                watchlistAssets.map(asset => {
                  const isUp = asset.changePercent >= 0;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => onSelectAsset(asset)}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 hover:border-blue-500/50 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="md" />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                            {asset.symbol}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                            {asset.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                            ${asset.price.toFixed(2)}
                          </div>
                          <div
                            className={`font-mono text-[11px] font-bold tabular-nums ${
                              isUp ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                          >
                            {isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%
                          </div>
                        </div>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onToggleWatchlist(asset.symbol);
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Portfolio Tab */
            <div className="space-y-4">
              {/* Account Summary Strip */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Total Account Equity</span>
                  <span className="font-mono text-emerald-500 font-bold">Paper Simulated</span>
                </div>
                <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                  ${portfolioEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Available Cash:</span>
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Unrealized P&L:</span>
                    <div
                      className={`font-mono font-bold ${
                        totalUnrealizedPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {totalUnrealizedPnl >= 0 ? '+' : ''}
                      ${totalUnrealizedPnl.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Positions List */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                  Active Positions ({positions.length})
                </div>

                {positions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No active positions. Execute a trade from any asset card to test your strategy.
                  </div>
                ) : (
                  positions.map(pos => {
                    const currentVal = pos.quantity * pos.currentPrice;
                    const pnl = currentVal - pos.totalCost;
                    const pnlPct = (pnl / pos.totalCost) * 100;
                    const isProfitable = pnl >= 0;

                    return (
                      <div
                        key={pos.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                pos.side === 'BUY'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {pos.side}
                            </span>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {pos.symbol}
                            </span>
                            <span className="text-[11px] text-slate-400">× {pos.quantity}</span>
                          </div>

                          <button
                            onClick={() => onClosePosition(pos.id)}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            Close Position
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-slate-400 text-[10px]">Entry:</span>{' '}
                            <span className="font-mono font-semibold">${pos.entryPrice.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px]">Current:</span>{' '}
                            <span className="font-mono font-semibold">${pos.currentPrice.toFixed(2)}</span>
                          </div>
                          <div
                            className={`font-mono font-bold text-xs ${
                              isProfitable ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                          >
                            {isProfitable ? '+' : ''}${pnl.toFixed(2)} ({isProfitable ? '+' : ''}{pnlPct.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
