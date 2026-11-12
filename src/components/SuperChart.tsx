import React, { useEffect, useRef, useState } from 'react';
import { Asset, CandleData } from '../types/market';
import { BarChart2, TrendingUp, Eye, Sliders } from 'lucide-react';

interface SuperChartProps {
  asset: Asset;
  height?: number;
  showIndicatorsToggle?: boolean;
}

type Timeframe = '1D' | '5D' | '1M' | '3M' | '1Y' | 'ALL';
type ChartStyle = 'candles' | 'area';

export const SuperChart: React.FC<SuperChartProps> = ({
  asset,
  height = 360,
  showIndicatorsToggle = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [showVolume, setShowVolume] = useState(true);
  const [showSMA20, setShowSMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(false);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);

  // Generate sliced candle data based on timeframe
  const candles: CandleData[] = React.useMemo(() => {
    const base = asset.candles || [];
    if (base.length === 0) return [];

    switch (timeframe) {
      case '1D':
        return base.slice(-10);
      case '5D':
        return base.slice(-15);
      case '1M':
        return base.slice(-25);
      case '3M':
      case '1Y':
      case 'ALL':
      default:
        return base;
    }
  }, [asset.candles, timeframe]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const canvasHeight = height;

    canvas.width = width * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(dpr, dpr);

    // Margins
    const rightAxisWidth = 65;
    const bottomAxisHeight = 24;
    const chartW = width - rightAxisWidth;
    const chartH = canvasHeight - bottomAxisHeight;

    // Detect dark mode from document
    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? '#131722' : '#ffffff';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
    const textColor = isDark ? '#787b86' : '#64748b';
    const upColor = '#22c55e';
    const downColor = '#ef4444';

    // Clear background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, canvasHeight);

    // Min and Max prices
    let minPrice = Math.min(...candles.map(c => c.low));
    let maxPrice = Math.max(...candles.map(c => c.high));
    const pricePadding = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    // Max volume for volume bars
    const maxVolume = Math.max(...candles.map(c => c.volume)) || 1;
    const volumeHeightMax = chartH * 0.22;

    // Draw horizontal grid lines & price labels
    const gridSteps = 5;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= gridSteps; i++) {
      const y = (chartH / gridSteps) * i;
      const priceVal = maxPrice - (i / gridSteps) * priceRange;

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartW, y);
      ctx.stroke();

      const priceLabel = asset.category === 'forex'
        ? priceVal.toFixed(4)
        : asset.category === 'bonds'
        ? `${priceVal.toFixed(2)}%`
        : priceVal >= 1000
        ? priceVal.toFixed(1)
        : priceVal.toFixed(2);

      ctx.fillText(priceLabel, chartW + 6, y);
    }

    // Candle metrics
    const candleCount = candles.length;
    const candleSlotWidth = chartW / candleCount;
    const candleBodyWidth = Math.max(3, candleSlotWidth * 0.68);

    // Draw Volume Bars
    if (showVolume) {
      candles.forEach((c, i) => {
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const volH = (c.volume / maxVolume) * volumeHeightMax;
        const volY = chartH - volH;
        const isUp = c.close >= c.open;

        ctx.fillStyle = isUp
          ? isDark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.3)'
          : isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.3)';

        ctx.fillRect(x - candleBodyWidth / 2, volY, candleBodyWidth, volH);
      });
    }

    // Draw Chart based on style
    if (chartStyle === 'candles') {
      candles.forEach((c, i) => {
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const openY = chartH - ((c.open - minPrice) / priceRange) * chartH;
        const closeY = chartH - ((c.close - minPrice) / priceRange) * chartH;
        const highY = chartH - ((c.high - minPrice) / priceRange) * chartH;
        const lowY = chartH - ((c.low - minPrice) / priceRange) * chartH;

        const isUp = c.close >= c.open;
        const color = isUp ? upColor : downColor;

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Candle Body
        ctx.fillStyle = color;
        const topY = Math.min(openY, closeY);
        const bodyH = Math.max(1.5, Math.abs(openY - closeY));
        ctx.fillRect(x - candleBodyWidth / 2, topY, candleBodyWidth, bodyH);
      });
    } else {
      // Area / Line style
      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const y = chartH - ((c.close - minPrice) / priceRange) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Gradient Fill
      const lastX = (candles.length - 1) * candleSlotWidth + candleSlotWidth / 2;
      const firstX = candleSlotWidth / 2;
      ctx.lineTo(lastX, chartH);
      ctx.lineTo(firstX, chartH);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, chartH);
      grad.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
      grad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Line Stroke
      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const y = chartH - ((c.close - minPrice) / priceRange) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Moving Average SMA 20
    if (showSMA20 && candles.length >= 5) {
      const period = Math.min(20, Math.floor(candles.length / 2));
      ctx.beginPath();
      let started = false;

      for (let i = period - 1; i < candles.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += candles[i - j].close;
        }
        const ma = sum / period;
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const y = chartH - ((ma - minPrice) / priceRange) * chartH;

        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#f59e0b'; // Amber
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    // EMA 50
    if (showEMA50 && candles.length >= 10) {
      const period = Math.min(30, candles.length);
      const k = 2 / (period + 1);
      let ema = candles[0].close;
      ctx.beginPath();
      ctx.moveTo(candleSlotWidth / 2, chartH - ((ema - minPrice) / priceRange) * chartH);

      for (let i = 1; i < candles.length; i++) {
        ema = candles[i].close * k + ema * (1 - k);
        const x = i * candleSlotWidth + candleSlotWidth / 2;
        const y = chartH - ((ema - minPrice) / priceRange) * chartH;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#a855f7'; // Purple
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    // Draw bottom date labels
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const dateStep = Math.max(1, Math.floor(candleCount / 5));

    for (let i = 0; i < candleCount; i += dateStep) {
      const x = i * candleSlotWidth + candleSlotWidth / 2;
      ctx.fillText(candles[i].time, x, chartH + 6);
    }

    // Draw Crosshair & Price Tag if active
    if (crosshairPos && crosshairPos.x < chartW && crosshairPos.y < chartH) {
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crosshairPos.x, 0);
      ctx.lineTo(crosshairPos.x, chartH);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, crosshairPos.y);
      ctx.lineTo(chartW, crosshairPos.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Right axis price badge
      const crossPrice = maxPrice - (crosshairPos.y / chartH) * priceRange;
      const badgeY = Math.max(10, Math.min(chartH - 10, crosshairPos.y));
      ctx.fillStyle = isDark ? '#2962ff' : '#2563eb';
      ctx.fillRect(chartW + 2, badgeY - 9, rightAxisWidth - 4, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const crossPriceLabel = asset.category === 'forex'
        ? crossPrice.toFixed(4)
        : asset.category === 'bonds'
        ? `${crossPrice.toFixed(2)}%`
        : crossPrice >= 1000
        ? crossPrice.toFixed(1)
        : crossPrice.toFixed(2);
      ctx.fillText(crossPriceLabel, chartW + 6, badgeY);
    }
  }, [candles, height, chartStyle, showVolume, showSMA20, showEMA50, crosshairPos, asset.category]);

  // Handle mouse move for crosshair and OHLC tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chartW = canvas.clientWidth - 65;
    if (x >= 0 && x <= chartW && y >= 0 && y <= canvas.clientHeight - 24) {
      setCrosshairPos({ x, y });
      const candleSlotWidth = chartW / candles.length;
      const index = Math.min(candles.length - 1, Math.max(0, Math.floor(x / candleSlotWidth)));
      setHoveredCandle(candles[index]);
    } else {
      setCrosshairPos(null);
      setHoveredCandle(null);
    }
  };

  const handleMouseLeave = () => {
    setCrosshairPos(null);
    setHoveredCandle(null);
  };

  const activeCandle = hoveredCandle || candles[candles.length - 1] || null;
  const isUp = activeCandle ? activeCandle.close >= activeCandle.open : true;

  return (
    <div ref={containerRef} className="w-full flex flex-col select-none">
      {/* Top Toolbar: Timeframes, Style, Indicators, and Live OHLC */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs">
        {/* Left: Timeframe selectors & Chart Style */}
        <div className="flex items-center gap-1">
          {(['1D', '5D', '1M', '3M', '1Y', 'ALL'] as Timeframe[]).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1.5" />

          <button
            onClick={() => setChartStyle(chartStyle === 'candles' ? 'area' : 'candles')}
            title={`Switch to ${chartStyle === 'candles' ? 'Area' : 'Candles'}`}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            {chartStyle === 'candles' ? <BarChart2 className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
            <span className="capitalize">{chartStyle}</span>
          </button>
        </div>

        {/* Center/Right: OHLC Display */}
        {activeCandle && (
          <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums">
            <span className="text-slate-400">{activeCandle.time}</span>
            <span>
              <span className="text-slate-400 mr-0.5">O</span>
              <span className={isUp ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>
                {activeCandle.open}
              </span>
            </span>
            <span>
              <span className="text-slate-400 mr-0.5">H</span>
              <span className={isUp ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>
                {activeCandle.high}
              </span>
            </span>
            <span>
              <span className="text-slate-400 mr-0.5">L</span>
              <span className={isUp ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>
                {activeCandle.low}
              </span>
            </span>
            <span>
              <span className="text-slate-400 mr-0.5">C</span>
              <span className={isUp ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                {activeCandle.close}
              </span>
            </span>
          </div>
        )}

        {/* Right: Technical Indicator Toggles */}
        {showIndicatorsToggle && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                showVolume
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              Vol
            </button>
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                showSMA20
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowEMA50(!showEMA50)}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                showEMA50
                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 font-medium'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              EMA 50
            </button>
          </div>
        )}
      </div>

      {/* Canvas Chart Area */}
      <div className="relative w-full bg-white dark:bg-[#131722] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="block w-full"
        />
      </div>
    </div>
  );
};
