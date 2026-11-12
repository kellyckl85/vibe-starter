import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, AlertCircle, ShieldCheck, CheckCircle2, Home, Utensils, Bath } from 'lucide-react';

interface BeforeAfterSliderProps {
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

type RoomScene = 'living' | 'kitchen';

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  className = '',
  beforeLabel = 'Before: Weekend Chores',
  afterLabel = 'After: SparkClean SG',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeScene, setActiveScene] = useState<RoomScene>('living');
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

  const scenes = {
    living: {
      name: 'Living Room Transformation',
      roomTag: 'Singapore Condo · River Valley',
      beforeImg: '/src/assets/images/messy_living_room_1794457339909.jpg',
      afterImg: '/src/assets/images/clean_living_room_1794457338958.jpg',
      beforePain: 'Cluttered toys, dusty floor & exhausted parents',
      afterBenefit: 'Pristine parquet, fresh botanical air & zero chores',
    },
    kitchen: {
      name: 'Kitchen Hob & Marble Island',
      roomTag: '4-Room HDB BTO · Punggol',
      beforeImg: '/src/assets/images/messy_living_room_1794457339909.jpg',
      afterImg: '/src/assets/images/clean_kitchen_hob_1794457340008.jpg',
      beforePain: 'Sticky cooking grease, watermarks & dirty hob',
      afterBenefit: 'Degreased induction cooktop & SimplyGood shine',
    },
  };

  const current = scenes[activeScene];

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Room Toggle */}
      <div className="flex items-center justify-between gap-1 px-1 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">Compare Real Results:</span>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveScene('living')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              activeScene === 'living'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-3 h-3" />
            <span>Living Room</span>
          </button>
          <button
            onClick={() => setActiveScene('kitchen')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              activeScene === 'kitchen'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Utensils className="w-3 h-3" />
            <span>Kitchen & Hob</span>
          </button>
        </div>
      </div>

      {/* Main Before/After Frame with Real Images */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-4/3 rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-800 shadow-lg group bg-slate-950"
      >
        {/* 1. AFTER IMAGE: Crisp, Sunlit Clean Home (Base Layer) */}
        <div className="absolute inset-0">
          <img
            src={current.afterImg}
            alt="SparkClean SG After Clean"
            className="w-full h-full object-cover"
          />
          {/* Subtle vignette scrim so badges pop */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/40" />

          {/* Top After Badge */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-extrabold backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{afterLabel}</span>
          </div>

          {/* Bottom After Caption */}
          <div className="absolute bottom-3 right-3 z-10 text-right max-w-xs">
            <span className="text-emerald-400 font-extrabold text-xs block drop-shadow-md">
              ✨ 3-Hour Professional Clean
            </span>
            <p className="text-[11px] text-white/95 drop-shadow-md font-medium leading-tight">
              {current.afterBenefit}
            </p>
          </div>
        </div>

        {/* 2. BEFORE IMAGE: Real Messy / Lived-in Apartment (Clipped Left Layer) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <img
            src={current.beforeImg}
            alt="Before Cleaning"
            className="w-full h-full object-cover filter brightness-95"
          />
          {/* Scrim for Before layer */}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/45" />

          {/* Top Before Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-extrabold backdrop-blur-md shadow-lg">
            <AlertCircle className="w-3.5 h-3.5 text-rose-200" />
            <span>{beforeLabel}</span>
          </div>

          {/* Bottom Before Caption */}
          <div className="absolute bottom-3 left-3 z-10 text-left max-w-xs">
            <span className="text-rose-400 font-extrabold text-xs block drop-shadow-md">
              😩 4 Hours of Weekend Lost
            </span>
            <p className="text-[11px] text-white/95 drop-shadow-md font-medium leading-tight">
              {current.beforePain}
            </p>
          </div>
        </div>

        {/* 3. Slider Divider Line & Glow Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] cursor-ew-resize z-20 flex items-center justify-center -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl font-black text-xs select-none border-2 border-slate-900 hover:scale-110 active:scale-95 transition-transform">
            <span>↔</span>
          </div>
        </div>

        {/* Floating Instruction Tooltip */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-black/75 text-[10px] text-white/90 backdrop-blur-xs font-semibold shadow-md border border-white/10">
          Drag ↔ to Compare
        </div>
      </div>
    </div>
  );
};
