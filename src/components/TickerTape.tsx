import React from 'react';
import { Asset } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  flashingAssetIds?: Record<string, 'up' | 'down'>;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  assets,
  onSelectAsset,
  flashingAssetIds = {},
}) => {
  // Select top representative assets for ticker tape
  const tapeSymbols = ['SPX', 'NDX', 'BTCUSD', 'ETHUSD', 'NVDA', 'AAPL', 'TSLA', 'GC1!', 'CL1!', 'EURUSD', 'US10Y'];
  const tapeAssets = tapeSymbols
    .map(sym => assets.find(a => a.id === sym))
    .filter((a): a is Asset => !!a);

  // Duplicate for seamless infinite marquee scroll
  const displayItems = [...tapeAssets, ...tapeAssets];

  return (
    <div className="relative w-full bg-slate-900 text-slate-100 border-b border-slate-800 text-xs overflow-hidden select-none h-9 flex items-center">
      <div className="ticker-track flex items-center gap-6 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
        {displayItems.map((asset, idx) => {
          const isUp = asset.changePercent >= 0;
          const flash = flashingAssetIds[asset.id];

          return (
            <button
              key={`${asset.id}-${idx}`}
              onClick={() => onSelectAsset(asset)}
              className={`flex items-center gap-2 py-1 px-2.5 rounded transition-colors hover:bg-slate-800 cursor-pointer shrink-0 ${
                flash === 'up' ? 'flash-up text-emerald-400' : flash === 'down' ? 'flash-down text-rose-400' : ''
              }`}
            >
              <span className="font-bold text-slate-200 tracking-tight">{asset.symbol}</span>
              <span className="font-mono tabular-nums text-slate-100 font-semibold">
                {asset.category === 'forex'
                  ? asset.price.toFixed(4)
                  : asset.category === 'bonds'
                  ? `${asset.price.toFixed(3)}%`
                  : asset.price >= 1000
                  ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : asset.price.toFixed(2)}
              </span>
              <span
                className={`flex items-center gap-0.5 font-mono tabular-nums font-semibold ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3 shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 shrink-0" />
                )}
                {isUp ? '+' : ''}
                {asset.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 42s linear infinite;
        }
      `}</style>
    </div>
  );
};
