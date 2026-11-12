import React, { useState, useEffect } from 'react';
import { initialAssets, mockNews, mockEconomicCalendar } from './data/mockMarketData';
import { Asset, PortfolioPosition } from './types/market';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { IndicesScreen } from './components/screens/IndicesScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { FuturesScreen } from './components/screens/FuturesScreen';
import { HeatmapScreen } from './components/screens/HeatmapScreen';
import { NewsScreen } from './components/screens/NewsScreen';
import { AssetDetailModal } from './components/AssetDetailModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { MarketSearchModal } from './components/MarketSearchModal';

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [currentScreen, setCurrentScreen] = useState<string>('overview');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [flashingAssetIds, setFlashingAssetIds] = useState<Record<string, 'up' | 'down'>>({});

  // Theme setup: Default to TradingView's iconic dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tv_theme');
      if (saved) return saved === 'dark';
    }
    return true; // TradingView default
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tv_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tv_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Watchlist persistence
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', 'BTC/USD', 'SPX', 'GOLD (GC1!)'];
    } catch {
      return ['NVDA', 'AAPL', 'BTC/USD', 'SPX', 'GOLD (GC1!)'];
    }
  });

  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  // Paper Trading Simulator state
  const [paperBalance, setPaperBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tv_paper_balance');
      return saved ? parseFloat(saved) : 100000.0;
    } catch {
      return 100000.0;
    }
  });

  const [positions, setPositions] = useState<PortfolioPosition[]>(() => {
    try {
      const saved = localStorage.getItem('tv_positions');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'pos-1',
              symbol: 'NVDA',
              name: 'NVIDIA Corporation',
              side: 'BUY',
              quantity: 20,
              entryPrice: 138.5,
              currentPrice: 142.65,
              totalCost: 2770,
              pnl: 83,
              pnlPercent: 3.0,
              openedAt: 'Today',
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tv_paper_balance', paperBalance.toString());
  }, [paperBalance]);

  useEffect(() => {
    localStorage.setItem('tv_positions', JSON.stringify(positions));
  }, [positions]);

  const handleExecuteTrade = (
    order: Omit<PortfolioPosition, 'id' | 'pnl' | 'pnlPercent' | 'openedAt'>
  ): boolean => {
    if (order.side === 'BUY') {
      if (order.totalCost > paperBalance) return false;
      setPaperBalance(prev => prev - order.totalCost);
    } else {
      setPaperBalance(prev => prev + order.totalCost);
    }

    const newPosition: PortfolioPosition = {
      ...order,
      id: `pos-${Date.now()}`,
      pnl: 0,
      pnlPercent: 0,
      openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setPositions(prev => [newPosition, ...prev]);
    return true;
  };

  const handleClosePosition = (positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return;

    const returnAmount = pos.quantity * pos.currentPrice;
    setPaperBalance(prev => prev + returnAmount);
    setPositions(prev => prev.filter(p => p.id !== positionId));
  };

  // Live market tick simulator (Subtle random fluctuations every 2.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => {
        // Randomly pick 1 to 3 assets to update
        const numUpdates = Math.floor(Math.random() * 2) + 1;
        const next = [...prevAssets];
        const newFlashes: Record<string, 'up' | 'down'> = {};

        for (let i = 0; i < numUpdates; i++) {
          const randomIndex = Math.floor(Math.random() * next.length);
          const target = next[randomIndex];
          const pctDelta = (Math.random() - 0.49) * 0.003; // ~0.15% shift
          const newPrice = Math.max(0.01, target.price * (1 + pctDelta));
          const netChange = target.change + (newPrice - target.price);
          const changePercent = ((newPrice - (target.price - target.change)) / (target.price - target.change)) * 100;
          const direction = newPrice >= target.price ? 'up' : 'down';

          newFlashes[target.id] = direction;

          next[randomIndex] = {
            ...target,
            price: target.category === 'forex' ? Number(newPrice.toFixed(4)) : Number(newPrice.toFixed(2)),
            change: Number(netChange.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            high24h: Math.max(target.high24h, newPrice),
            low24h: Math.min(target.low24h, newPrice),
            sparkline: [...target.sparkline.slice(1), newPrice],
          };
        }

        setFlashingAssetIds(newFlashes);
        setTimeout(() => setFlashingAssetIds({}), 1200);

        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Update open positions currentPrice and pnl when asset prices change
  useEffect(() => {
    setPositions(prevPositions =>
      prevPositions.map(pos => {
        const liveAsset = assets.find(a => a.symbol === pos.symbol);
        if (!liveAsset) return pos;

        const currentPrice = liveAsset.price;
        const currentVal = pos.quantity * currentPrice;
        const pnl = pos.side === 'BUY' ? currentVal - pos.totalCost : pos.totalCost - currentVal;
        const pnlPercent = (pnl / pos.totalCost) * 100;

        return {
          ...pos,
          currentPrice,
          pnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(pnlPercent.toFixed(2)),
        };
      })
    );
  }, [assets]);

  // Keep selectedAsset synced with live asset updates if modal is open
  useEffect(() => {
    if (selectedAsset) {
      const updated = assets.find(a => a.id === selectedAsset.id);
      if (updated && updated.price !== selectedAsset.price) {
        setSelectedAsset(updated);
      }
    }
  }, [assets, selectedAsset]);

  // Keyboard shortcut: Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailOpen(true);
  };

  const handleSelectAssetBySymbol = (symbol: string) => {
    const target = assets.find(a => a.symbol === symbol || a.symbol.startsWith(symbol));
    if (target) {
      handleSelectAsset(target);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0c0e14] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors">
      {/* Top Header Bar */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        positionsCount={positions.length}
        paperBalance={paperBalance}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Real-time Ticker Tape Marquee */}
      <TickerTape
        assets={assets}
        onSelectAsset={handleSelectAsset}
        flashingAssetIds={flashingAssetIds}
      />

      {/* Main Viewport Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentScreen === 'overview' && (
          <OverviewScreen
            assets={assets}
            news={mockNews}
            economicEvents={mockEconomicCalendar}
            onSelectAsset={handleSelectAsset}
            onNavigateToScreen={setCurrentScreen}
          />
        )}

        {currentScreen === 'stocks' && (
          <StocksScreen
            assets={assets}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onSelectAsset={handleSelectAsset}
            onOpenTrade={handleSelectAsset}
          />
        )}

        {currentScreen === 'crypto' && (
          <CryptoScreen
            assets={assets}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onSelectAsset={handleSelectAsset}
            onOpenTrade={handleSelectAsset}
          />
        )}

        {currentScreen === 'indices' && (
          <IndicesScreen
            assets={assets}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onSelectAsset={handleSelectAsset}
          />
        )}

        {currentScreen === 'forex' && (
          <ForexScreen
            assets={assets}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onSelectAsset={handleSelectAsset}
            onOpenTrade={handleSelectAsset}
          />
        )}

        {currentScreen === 'futures' && (
          <FuturesScreen
            assets={assets}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onSelectAsset={handleSelectAsset}
            onOpenTrade={handleSelectAsset}
          />
        )}

        {currentScreen === 'heatmap' && (
          <HeatmapScreen onSelectAssetBySymbol={handleSelectAssetBySymbol} />
        )}

        {currentScreen === 'news' && (
          <NewsScreen
            news={mockNews}
            assets={assets}
            onSelectAsset={handleSelectAsset}
          />
        )}
      </main>

      {/* Asset Detail & Superchart Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
        paperBalance={paperBalance}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* Watchlist & Simulator Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlist}
        assets={assets}
        onToggleWatchlist={toggleWatchlist}
        onSelectAsset={handleSelectAsset}
        positions={positions}
        paperBalance={paperBalance}
        onClosePosition={handleClosePosition}
      />

      {/* Global Cmd+K Search Modal */}
      <MarketSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        onSelectAsset={handleSelectAsset}
      />

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#131722] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">TradingView Markets</span>
            <span>·</span>
            <span>Global Market Quotes, Heatmaps & Supercharts</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentScreen('overview')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentScreen('heatmap')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Heatmap
            </button>
            <button
              onClick={() => setCurrentScreen('stocks')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Stocks Screener
            </button>
            <button
              onClick={() => setCurrentScreen('crypto')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Crypto
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
