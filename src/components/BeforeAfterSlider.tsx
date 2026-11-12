import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface BeforeAfterSliderProps {
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  className = '',
  beforeLabel = 'Before: Weekend Stress',
  afterLabel = 'After: SparkClean SG',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const clampedPos = Math.max(5, Math.min(95, (x / width) * 100));
    setSliderPosition(clampedPos);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      className={`relative w-full aspect-square sm:aspect-4/3 rounded-xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-800 shadow-inner group ${className}`}
    >
      {/* 1. AFTER State: Sparkling, Eco-Clean, Bright Modern Singapore Condo/HDB */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-slate-900 to-sky-950 flex flex-col justify-between p-6 text-white">
        {/* Subtle decorative background pattern / clean interior visual */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-tight backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{afterLabel}</span>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-slate-900/60 border border-white/10 text-[11px] font-medium text-slate-300">
            SimplyGood & 3M Eco Safe
          </div>
        </div>

        {/* Visual Clean Features Showcase */}
        <div className="relative z-10 grid grid-cols-2 gap-3 my-auto max-w-sm ml-auto text-right">
          <div className="p-3 rounded-lg bg-slate-900/70 border border-emerald-500/30 backdrop-blur-xs text-left">
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Gleaming Grout & Tiles</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">Zero mildew, steam sanitized at 140°C</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/70 border border-emerald-500/30 backdrop-blur-xs text-left">
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pet & Toddler Safe</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">100% plant-derived formulas, no fumes</p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 border-t border-white/10 pt-3">
          <span className="font-semibold text-emerald-300">Fresh Linen & Hotel-Grade Clean</span>
          <span className="font-mono text-xs text-white font-bold">S$20 OFF Trial</span>
        </div>
      </div>

      {/* 2. BEFORE State (Clipped by Slider Position): Cluttered, Dusty, Sticky, Grimy */}
      <div
        className="absolute inset-0 bg-linear-to-br from-amber-950 via-stone-900 to-slate-950 flex flex-col justify-between p-6 text-white overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold tracking-tight backdrop-blur-xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>{beforeLabel}</span>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-slate-900/60 border border-white/10 text-[11px] font-medium text-amber-200">
            4+ Hours Weekend Lost
          </div>
        </div>

        {/* Visual Pain Points */}
        <div className="relative z-10 space-y-2 my-auto max-w-xs text-left">
          <div className="p-2.5 rounded-lg bg-black/60 border border-rose-500/30 backdrop-blur-xs">
            <span className="text-xs font-bold text-rose-300">Sticky kitchen grease & dust</span>
            <p className="text-[10px] text-slate-300 mt-0.5">Heavy cooking oil residue on hobs & tiles</p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-rose-500/30 backdrop-blur-xs">
            <span className="text-xs font-bold text-rose-300">Stubborn bathroom limescale</span>
            <p className="text-[10px] text-slate-300 mt-0.5">Scrubbing tiles until back hurts</p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3">
          <span>Tired after a long 50-hr work week</span>
          <span className="text-rose-400 font-bold">Unfinished Chores</span>
        </div>
      </div>

      {/* 3. Draggable Slider Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20 flex items-center justify-center -translate-x-1/2"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Glow pill handle */}
        <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg font-black text-[10px] select-none border-2 border-slate-900 hover:scale-110 active:scale-95 transition-transform">
          ↔
        </div>
      </div>

      {/* Helper text tooltip at bottom */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white/90 backdrop-blur-xs font-medium">
        Drag slider to compare Before & After
      </div>
    </div>
  );
};
