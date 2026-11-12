export type AssetCategory = 'stocks' | 'crypto' | 'indices' | 'forex' | 'futures' | 'bonds';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  sector?: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  volumeNumeric: number;
  marketCap?: string;
  marketCapNumeric?: number;
  peRatio?: number;
  dividendYield?: number;
  sparkline: number[];
  candles: CandleData[];
  logoSlug?: string;
  logoUrl?: string;
  flagUrl?: string;
  description: string;
  technicalRating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  technicalScore: number; // 0 to 100 (50 is neutral)
  oscillators: { buy: number; neutral: number; sell: number };
  movingAverages: { buy: number; neutral: number; sell: number };
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  url: string;
  relatedSymbols: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  summary: string;
  category: 'Stocks' | 'Crypto' | 'Economy' | 'Forex' | 'Commodities';
}

export interface EconomicEvent {
  id: string;
  country: string;
  flag: string;
  time: string;
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  actual?: string;
  forecast?: string;
  previous: string;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  name: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  totalCost: number;
  pnl: number;
  pnlPercent: number;
  openedAt: string;
}

export interface HeatmapNode {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  marketCap: number;
  changePercent: number;
  price: number;
  logoSlug?: string;
}
