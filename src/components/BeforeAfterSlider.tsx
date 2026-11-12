import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, AlertCircle, ShieldCheck, CheckCircle2, Home, Utensils, Bath } from 'lucide-react';

interface BeforeAfterSliderProps {
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

type RoomScene = 'kitchen' | 'living' | 'bathroom';

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  className = '',
  beforeLabel = 'Before: Weekend Chores',
  afterLabel = 'After: SparkClean SG',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeScene, setActiveScene] = useState<RoomScene>('kitchen');
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const clampedPos = Math.max(8, Math.min(92, (x / width) * 100));
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

  const sceneDetails = {
    kitchen: {
      name: 'Kitchen & Cooker Hob',
      icon: Utensils,
      beforeDetails: ['Greasy range hood & yellowed oil stains', 'Sink piled with sticky pots & pans', 'Dusty cabinet edges & spice stains'],
      afterDetails: ['Gleaming degreased induction hob', 'Disinfected sink with stainless shine', 'SimplyGood plant-based degreaser used'],
      roomTag: '4-Room Punggol BTO',
    },
    living: {
      name: 'Living Room & Floor',
      icon: Home,
      beforeDetails: ['Sticky tile grout & pet hair tumbleweeds', 'Dusty ceiling fan blades & window sills', 'Unfolded laundry on sofa'],
      afterDetails: ['Squeaky-clean vacuumed & mopped tiles', 'Dust-mite sanitized sofa cushions', 'Fresh botanical scent, safe for toddlers'],
      roomTag: '3-Bed River Valley Condo',
    },
    bathroom: {
      name: 'Master Bath & Grout',
      icon: Bath,
      beforeDetails: ['Hard water glass stains & limescale', 'Black mold in silicone joints & tile edges', 'Cloudy mirrors & soap scum'],
      afterDetails: ['Crystal clear glass screen & polished chrome', '140°C high-pressure steam sanitized', 'Zero chlorine bleach fumes'],
      roomTag: '5-Room Tampines Exec',
    },
  };

  const currentScene = sceneDetails[activeScene];

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Room Selector for Consumers */}
      <div className="flex items-center justify-between gap-1 px-1 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">Tap to inspect room:</span>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(
            [
              { id: 'kitchen', label: 'Kitchen Hob', icon: Utensils },
              { id: 'living', label: 'Living Room', icon: Home },
              { id: 'bathroom', label: 'Bathroom', icon: Bath },
            ] as const
          ).map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveScene(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activeScene === tab.id
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Visual Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-800 shadow-md group"
      >
        {/* 1. AFTER STATE: Sparkling, Fresh, Hotel-Grade Clean (Right Base Layer) */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-teal-900 to-slate-950 flex flex-col justify-between p-5 text-white">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{afterLabel}</span>
            </div>

            <div className="text-[11px] font-mono text-emerald-200 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/30">
              {currentScene.roomTag}
            </div>
          </div>

          {/* Interactive Inspection Points */}
          <div className="relative z-10 max-w-xs ml-auto space-y-2 text-right my-auto">
            <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">
              ✨ 3-Hour Professional Clean
            </div>
            {currentScene.afterDetails.map((detail, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xs text-left text-xs text-slate-100 flex items-start gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{detail}</span>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-200 border-t border-white/10 pt-2.5">
            <span className="font-semibold text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> NEA Licensed Cleaners
            </span>
            <span className="font-mono text-amber-300 font-bold">100% Pet & Baby Safe</span>
          </div>
        </div>

        {/* 2. BEFORE STATE: Dusty, Stained, Sticky Chores (Left Clipped Layer) */}
        <div
          className="absolute inset-0 bg-linear-to-br from-amber-950 via-stone-900 to-slate-950 flex flex-col justify-between p-5 text-white overflow-hidden pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          {/* Top Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold backdrop-blur-xs">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{beforeLabel}</span>
            </div>

            <div className="text-[11px] font-mono text-amber-200 bg-black/40 px-2 py-0.5 rounded border border-white/10">
              Unfinished Chores
            </div>
          </div>

          {/* Pain Points */}
          <div className="relative z-10 max-w-xs space-y-2 my-auto">
            <div className="text-xs font-black text-rose-300 uppercase tracking-wider">
              😩 4 Hours of Weekend Lost
            </div>
            {currentScene.beforeDetails.map((detail, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-black/80 border border-rose-500/30 backdrop-blur-xs text-left text-xs text-slate-200 flex items-start gap-2 shadow-lg"
              >
                <span className="text-rose-400 text-sm leading-none shrink-0">•</span>
                <span className="leading-snug">{detail}</span>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 border-t border-white/10 pt-2.5">
            <span>Tired after 50h work week</span>
            <span className="text-rose-400 font-bold">Back-breaking scrubbing</span>
          </div>
        </div>

        {/* 3. Slider Handle Divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20 flex items-center justify-center -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex flex-col items-center justify-center shadow-xl font-black text-[10px] select-none border-2 border-slate-900 hover:scale-110 active:scale-95 transition-transform">
            <span>↔</span>
          </div>
        </div>

        {/* Floating Instruction Tooltip */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-black/75 text-[11px] text-white backdrop-blur-xs font-semibold shadow-lg">
          Slide left or right to see the magic
        </div>
      </div>
    </div>
  );
};
