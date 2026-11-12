import React from 'react';
import { Asset } from '../types/market';

interface TechnicalGaugeProps {
  asset: Asset;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ asset }) => {
  const score = asset.technicalScore ?? 50; // 0 to 100
  const rating = asset.technicalRating;

  // Convert 0..100 score to angle: -90deg (Strong Sell) to +90deg (Strong Buy)
  const angle = (score / 100) * 180 - 90;

  const ratingColors = {
    'Strong Sell': 'text-rose-600 dark:text-rose-400',
    'Sell': 'text-orange-500 dark:text-orange-400',
    'Neutral': 'text-slate-500 dark:text-slate-400',
    'Buy': 'text-emerald-500 dark:text-emerald-400',
    'Strong Buy': 'text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Technical Analysis Summary
      </div>

      {/* Speedometer Arc SVG */}
      <div className="relative w-48 h-26 overflow-hidden flex items-end justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Needle Center Pin */}
          <circle cx="100" cy="100" r="6" fill="#3b82f6" />
        </svg>

        {/* Dynamic Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-slate-800 dark:bg-white rounded-full origin-bottom transition-transform duration-700 ease-out shadow-md"
          style={{
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        />
      </div>

      {/* Main Status Text */}
      <div className={`text-base font-bold tracking-tight mt-2 ${ratingColors[rating]}`}>
        {rating}
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
        {/* Oscillators */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-slate-500 mb-1">Oscillators</span>
          <div className="flex items-center gap-2 font-mono tabular-nums text-[11px]">
            <span className="text-rose-500">{asset.oscillators.sell} Sell</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{asset.oscillators.neutral} Neutral</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-500">{asset.oscillators.buy} Buy</span>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-slate-500 mb-1">Moving Averages</span>
          <div className="flex items-center gap-2 font-mono tabular-nums text-[11px]">
            <span className="text-rose-500">{asset.movingAverages.sell} Sell</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{asset.movingAverages.neutral} Neutral</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-500">{asset.movingAverages.buy} Buy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
