import React, { useState } from 'react';
import { Asset, PortfolioPosition } from '../types/market';
import { AssetLogo } from './AssetLogo';
import { SuperChart } from './SuperChart';
import { TechnicalGauge } from './TechnicalGauge';
import {
  X,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  paperBalance: number;
  onExecuteTrade: (position: Omit<PortfolioPosition, 'id' | 'pnl' | 'pnlPercent' | 'openedAt'>) => boolean;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
  watchlist,
  onToggleWatchlist,
  paperBalance,
  onExecuteTrade,
}) => {
  if (!isOpen || !asset) return null;

  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState<number>(10);
  const [orderStatus, setOrderStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isUp = asset.changePercent >= 0;
  const inWatchlist = watchlist.includes(asset.symbol);

  // Compute total cost
  const totalCost = quantity * asset.price;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setOrderStatus({ message: 'Quantity must be greater than 0', type: 'error' });
      return;
    }

    if (orderSide === 'BUY' && totalCost > paperBalance) {
      setOrderStatus({ message: `Insufficient paper funds ($${paperBalance.toFixed(2)} available)`, type: 'error' });
      return;
    }

    const success = onExecuteTrade({
      symbol: asset.symbol,
      name: asset.name,
      side: orderSide,
      quantity,
      entryPrice: asset.price,
      currentPrice: asset.price,
      totalCost,
    });

    if (success) {
      setOrderStatus({
        message: `Successfully executed ${orderSide} order for ${quantity} shares of ${asset.symbol} at $${asset.price.toFixed(2)}!`,
        type: 'success',
      });
      setTimeout(() => setOrderStatus(null), 4000);
    }
  };

  // 52-week progress calculation
  const weekLow = asset.low24h * 0.85;
  const weekHigh = asset.high24h * 1.15;
  const rangeProgress = Math.min(100, Math.max(0, ((asset.price - weekLow) / (weekHigh - weekLow)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {asset.symbol}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {asset.exchange}
                </span>
                <span className="text-xs text-slate-400 capitalize">{asset.category}</span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md">{asset.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Price Tag */}
            <div className="text-right hidden sm:block">
              <div className="text-xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {asset.category === 'forex'
                  ? asset.price.toFixed(4)
                  : asset.category === 'bonds'
                  ? `${asset.price.toFixed(3)}%`
                  : `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              <div
                className={`flex items-center justify-end gap-1 text-xs font-mono font-bold tabular-nums ${
                  isUp ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isUp ? '+' : ''}{asset.change.toFixed(2)} ({isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%)
              </div>
            </div>

            {/* Watchlist Star Toggle */}
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                inWatchlist
                  ? 'border-amber-400/50 bg-amber-400/10 text-amber-500'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${inWatchlist ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Interactive SuperChart */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <SuperChart asset={asset} height={380} showIndicatorsToggle={true} />
          </div>

          {/* Two Columns: Key Stats & Technical Gauge vs Paper Trading Ticket */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Stats, 52W Range & Technical Analysis */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Statistics Grid */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Key Market Statistics
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Day High</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      ${asset.high24h.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Day Low</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      ${asset.low24h.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">24h Volume</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {asset.volume}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Market Cap</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {asset.marketCap || '—'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">P/E Ratio</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {asset.peRatio ? asset.peRatio.toFixed(1) : '—'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Dividend Yield</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {asset.dividendYield ? `${asset.dividendYield}%` : '—'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Sector</span>
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                      {asset.sector || asset.category}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Exchange</span>
                    <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">
                      {asset.exchange}
                    </div>
                  </div>
                </div>

                {/* 52-Week Range Bar */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-mono">
                    <span>52W Low: ${weekLow.toFixed(2)}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">52-Week Range</span>
                    <span>52W High: ${weekHigh.toFixed(2)}</span>
                  </div>
                  <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-blue-500 rounded-full"
                      style={{ width: `${rangeProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Technical Analysis Gauge */}
              <TechnicalGauge asset={asset} />

              {/* Company Description */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  About {asset.name}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {asset.description}
                </p>
              </div>
            </div>

            {/* Right 1 Col: Paper Trading Order Entry Ticket */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Order Entry
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Paper Trading Account
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded">
                    Cash: ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* BUY / SELL Switch */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg mb-4">
                  <button
                    type="button"
                    onClick={() => setOrderSide('BUY')}
                    className={`py-2 text-xs font-extrabold rounded-md transition-colors cursor-pointer ${
                      orderSide === 'BUY'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderSide('SELL')}
                    className={`py-2 text-xs font-extrabold rounded-md transition-colors cursor-pointer ${
                      orderSide === 'SELL'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    SELL / SHORT
                  </button>
                </div>

                {/* Order Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                  {/* Order Type */}
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
                      Execution Type
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('MARKET')}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          orderType === 'MARKET'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Market Order
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('LIMIT')}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          orderType === 'LIMIT'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Limit Order
                      </button>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">
                      Units / Shares
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Price Preview */}
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Execution Price:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ${asset.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-700">
                      <span>Estimated Total:</span>
                      <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                        ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Status Banner */}
                  {orderStatus && (
                    <div
                      className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                        orderStatus.type === 'success'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {orderStatus.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{orderStatus.message}</span>
                    </div>
                  )}

                  {/* Submit Order Button */}
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all cursor-pointer ${
                      orderSide === 'BUY'
                        ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99]'
                        : 'bg-rose-600 hover:bg-rose-500 active:scale-[0.99]'
                    }`}
                  >
                    Place {orderSide} Order
                  </button>
                </form>
              </div>

              {/* Order Execution disclaimer */}
              <div className="text-[10px] text-slate-400 leading-normal text-center">
                Paper simulation mode · Instant execution · Zero commission fees
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
