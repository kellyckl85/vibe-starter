import React from 'react';
import { Asset, EconomicEvent, NewsItem } from '../../types/market';
import { globalExchanges, stockHeatmapData } from '../../data/mockMarketData';
import { AssetLogo } from '../AssetLogo';
import { Sparkline } from '../Sparkline';
import {
  TrendingUp,
  TrendingDown,
  Globe,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Activity,
  Layers,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface OverviewScreenProps {
  assets: Asset[];
  news: NewsItem[];
  economicEvents: EconomicEvent[];
  onSelectAsset: (asset: Asset) => void;
  onNavigateToScreen: (screen: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  assets,
  news,
  economicEvents,
  onSelectAsset,
  onNavigateToScreen,
}) => {
  // Top benchmark assets for marquee overview cards
  const benchmarkIds = ['SPX', 'NDX', 'BTCUSD', 'GC1!', 'CL1!', 'US10Y'];
  const benchmarks = benchmarkIds
    .map(id => assets.find(a => a.id === id))
    .filter((a): a is Asset => !!a);

  // Calculate Market Movers
  const sortedByGain = [...assets].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sortedByGain.slice(0, 5);
  const topLosers = [...assets].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = [...assets].sort((a, b) => b.volumeNumeric - a.volumeNumeric).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 1. Global Benchmark Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            Global Market Barometers
          </h2>
          <span className="text-xs text-slate-400">Live prices · Updated 1s ago</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {benchmarks.map(asset => {
            const isUp = asset.changePercent >= 0;
            return (
              <button
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all text-left shadow-xs cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="sm" />
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-500 transition-colors">
                      {asset.symbol}
                    </span>
                  </div>
                  <span
                    className={`flex items-center text-[11px] font-mono tabular-nums font-semibold shrink-0 ${
                      isUp ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div>
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {asset.category === 'forex'
                      ? asset.price.toFixed(4)
                      : asset.category === 'bonds'
                      ? `${asset.price.toFixed(3)}%`
                      : asset.price >= 1000
                      ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : asset.price.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {asset.name}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <Sparkline data={asset.sparkline} width={75} height={20} isPositive={isUp} />
                  <span className="text-[10px] text-slate-400 font-mono">1D</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. World Financial Centers Operating Status */}
      <section className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Clock className="w-4 h-4 text-amber-500" />
            World Exchanges & Trading Hours
          </div>
          <span className="text-xs text-slate-400">Global market session coverage</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {globalExchanges.map(ex => {
            const isOpen = ex.status === 'OPEN';
            return (
              <div
                key={ex.city}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ex.city}</span>
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      isOpen
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-500/10 text-slate-500'
                    }`}
                  >
                    {ex.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{ex.exchange}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">{ex.hours} {ex.timezone}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Market Movers: 3-Column Widget (Gainers, Losers, Most Active) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Today's Market Movers
          </h2>
          <button
            onClick={() => onNavigateToScreen('stocks')}
            className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 font-semibold cursor-pointer"
          >
            Explore all stocks <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Gainers */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4" /> Top Gainers
              </span>
              <span className="text-[11px] text-slate-400">1D %</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {topGainers.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="w-full py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="sm" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{asset.symbol}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{asset.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      ${asset.price.toFixed(2)}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-emerald-500">
                      +{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <ArrowDownRight className="w-4 h-4" /> Top Losers
              </span>
              <span className="text-[11px] text-slate-400">1D %</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {topLosers.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="w-full py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="sm" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{asset.symbol}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{asset.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      ${asset.price.toFixed(2)}
                    </div>
                    <div className="font-mono text-[11px] font-bold text-rose-500">
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Most Active by Volume */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Most Active Volume
              </span>
              <span className="text-[11px] text-slate-400">Vol / 24h</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {mostActive.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="w-full py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AssetLogo symbol={asset.symbol} logoSlug={asset.logoSlug} logoUrl={asset.logoUrl} size="sm" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{asset.symbol}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{asset.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {asset.volume}
                    </div>
                    <div
                      className={`font-mono text-[11px] font-semibold ${
                        asset.changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {asset.changePercent >= 0 ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Two-Column Split: Mini Heatmap Snapshot & News / Economic Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sector Performance & Mini Heatmap Preview */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Market Sector Heatmap Preview
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">S&P 500 relative weight & 1D price shifts</p>
            </div>
            <button
              onClick={() => onNavigateToScreen('heatmap')}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              Open Full Heatmap <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini Treemap Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {stockHeatmapData.slice(0, 12).map(item => {
              const isGain = item.changePercent >= 0;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    const found = assets.find(a => a.symbol === item.symbol);
                    if (found) onSelectAsset(found);
                  }}
                  className={`p-2.5 rounded-lg text-left transition-transform hover:scale-[1.03] shadow-xs cursor-pointer flex flex-col justify-between ${
                    item.changePercent >= 3
                      ? 'bg-emerald-600 text-white'
                      : item.changePercent > 0
                      ? 'bg-emerald-700/80 text-emerald-100'
                      : item.changePercent > -2
                      ? 'bg-rose-700/80 text-rose-100'
                      : 'bg-rose-800 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs">{item.symbol}</span>
                    <AssetLogo symbol={item.symbol} logoSlug={item.logoSlug} size="sm" className="bg-white/20 border-transparent" />
                  </div>
                  <div className="mt-3">
                    <div className="font-mono text-xs font-bold tabular-nums">
                      {isGain ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-[10px] font-mono opacity-80">${item.price.toFixed(1)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Economic Catalysts */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Economic Calendar
            </h3>
            <span className="text-[11px] text-slate-400">High Impact</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {economicEvents.map(event => (
              <div key={event.id} className="py-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AssetLogo symbol={event.country} logoUrl={event.flag} size="sm" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{event.country}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      event.impact === 'High'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {event.impact}
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {event.title}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{event.time}</span>
                  <span>Prev: {event.previous} {event.forecast ? `| Fcst: ${event.forecast}` : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Editorial News & Market Commentary */}
      <section className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            Breaking Market Intelligence
          </h2>
          <button
            onClick={() => onNavigateToScreen('news')}
            className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
          >
            View all stories <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.slice(0, 4).map(item => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.source}</span>
                  <span>·</span>
                  <span>{item.timeAgo}</span>
                  <span>·</span>
                  <span
                    className={`font-semibold capitalize ${
                      item.sentiment === 'bullish'
                        ? 'text-emerald-500'
                        : item.sentiment === 'bearish'
                        ? 'text-rose-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug hover:text-blue-500 transition-colors cursor-pointer">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Tickers:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.relatedSymbols.map(sym => (
                    <button
                      key={sym}
                      onClick={() => {
                        const target = assets.find(a => a.symbol === sym || a.id === sym);
                        if (target) onSelectAsset(target);
                      }}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:border-blue-500 transition-colors cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
