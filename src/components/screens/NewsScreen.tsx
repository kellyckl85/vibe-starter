import React, { useState } from 'react';
import { NewsItem, Asset } from '../../types/market';
import { Newspaper, ArrowUpRight, TrendingUp, TrendingDown, Clock, Tag } from 'lucide-react';

interface NewsScreenProps {
  news: NewsItem[];
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({ news, assets, onSelectAsset }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(news[0] || null);

  const categories = ['All', 'Stocks', 'Crypto', 'Economy', 'Commodities'];

  const filteredNews = selectedCategory === 'All'
    ? news
    : news.filter(n => n.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-500" />
            Financial News & Market Editorial
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curated market-moving updates, earnings catalysts and macroeconomic reporting
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Feed List + Featured Reader View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Feed Stream (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          {filteredNews.map(item => {
            const isSelected = selectedArticle?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.source}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.timeAgo}
                    </span>
                  </div>
                  <span
                    className={`font-semibold capitalize px-2 py-0.5 rounded text-[10px] ${
                      item.sentiment === 'bullish'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : item.sentiment === 'bearish'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] text-slate-400">Mentioned Tickers:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.relatedSymbols.map(sym => (
                      <button
                        key={sym}
                        onClick={e => {
                          e.stopPropagation();
                          const target = assets.find(a => a.symbol === sym || a.id === sym);
                          if (target) onSelectAsset(target);
                        }}
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:border-blue-500 transition-colors cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Story Inspector / Detail Panel */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-fit space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Story Analysis & Context
          </div>

          {selectedArticle ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-bold text-blue-500">{selectedArticle.source}</span>
                <span>·</span>
                <span>{selectedArticle.category}</span>
                <span>·</span>
                <span>{selectedArticle.timeAgo}</span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {selectedArticle.summary}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Impacted Instruments
                </div>
                <div className="space-y-2">
                  {selectedArticle.relatedSymbols.map(sym => {
                    const match = assets.find(a => a.symbol === sym || a.id === sym);
                    if (!match) return null;
                    const isUp = match.changePercent >= 0;

                    return (
                      <button
                        key={sym}
                        onClick={() => onSelectAsset(match)}
                        className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-white">{match.symbol}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{match.name}</div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            ${match.price >= 1000 ? match.price.toLocaleString() : match.price.toFixed(2)}
                          </div>
                          <div className={`font-mono text-[11px] font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isUp ? '+' : ''}{match.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select an article from the feed to view full context.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
