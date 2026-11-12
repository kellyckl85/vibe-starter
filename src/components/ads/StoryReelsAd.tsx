import React, { useState, useEffect } from 'react';
import { AdCreative } from '../../types/ad';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ChevronUp,
  ShieldCheck,
  Star,
  CheckCircle2,
  Share2,
  Heart,
  MessageCircle,
} from 'lucide-react';

interface StoryReelsAdProps {
  creative: AdCreative;
  onOpenBooking: () => void;
}

export const StoryReelsAd: React.FC<StoryReelsAdProps> = ({
  creative,
  onOpenBooking,
}) => {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(4820);
  const [isLiked, setIsLiked] = useState(false);

  // Auto-advance story timer segments
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStoryIdx(prev => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const storySlides = [
    {
      title: 'Transformation in Progress ✨',
      subtitle: 'Living Room & Kitchen Grout Deep Steam Clean',
      highlight: 'Before & After: Grease-free in 3 hours',
      tag: 'Punggol 4-Room HDB',
    },
    {
      title: '100% Pet & Toddler Safe 🐾',
      subtitle: 'Powered by SimplyGood & 3M Non-Toxic Eco Formuals',
      highlight: 'Zero toxic fumes or harsh chemicals',
      tag: 'Eco Certified',
    },
    {
      title: 'Claim Your S$20 Voucher 🇸🇬',
      subtitle: '60-Second Instant Mobile Booking',
      highlight: 'Use Code [SGCLEAN20] · No contracts',
      tag: 'Limited Trial Offer',
    },
  ];

  const currentStory = storySlides[activeStoryIdx];

  return (
    <div className="w-full max-w-[340px] mx-auto aspect-[9/16] bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden relative text-white flex flex-col justify-between p-4 select-none">
      {/* 1. Top Story Progress Bars */}
      <div className="absolute top-3 left-4 right-4 z-40 flex items-center gap-1.5">
        {[0, 1, 2].map(idx => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className={`h-full bg-white transition-all duration-300 ${
                idx < activeStoryIdx
                  ? 'w-full'
                  : idx === activeStoryIdx
                  ? 'w-full animate-[progress_4.5s_linear]'
                  : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* 2. Top Account Header */}
      <div className="relative z-30 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-xs border border-white/20 shadow-md">
            SC
          </div>
          <div className="leading-tight text-left">
            <div className="flex items-center gap-1 font-bold text-xs">
              <span>sparkclean.sg</span>
              <span className="text-[10px] bg-blue-500 rounded-full px-1">Sponsored</span>
            </div>
            <div className="text-[10px] text-white/70">Singapore · House Cleaning</div>
          </div>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-xs text-white/90 hover:bg-black/60 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3. Center Creative & Dynamic Visual Motion */}
      <div className="relative z-20 my-auto space-y-4 text-center">
        {/* Floating Trust Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>NEA Licensed & Police Vetted</span>
        </div>

        {/* Video Simulation Graphic */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-left space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-400 font-mono tracking-wider">
              {currentStory.tag}
            </span>
            <div className="flex items-center text-amber-400 text-xs">
              ★★★★★ <span className="text-[10px] text-white/80 ml-1">(4.9/5)</span>
            </div>
          </div>

          <h3 className="text-base font-extrabold text-white leading-snug">
            {currentStory.title}
          </h3>

          <p className="text-xs text-slate-300">
            {currentStory.subtitle}
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {currentStory.highlight}
            </span>
          </div>
        </div>

        {/* Floating Customer Review Sticker */}
        <div className="p-3 rounded-xl bg-white/95 text-slate-900 shadow-2xl text-left transform -rotate-1 border border-slate-200">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-extrabold">Rachel T. (Punggol)</span>
            <span className="text-emerald-600 font-bold">Verified Clean</span>
          </div>
          <p className="text-xs text-slate-700 italic mt-1 leading-snug">
            "Finally took our Saturdays back! Floors are squeaky clean and safe for our baby."
          </p>
        </div>
      </div>

      {/* 4. Right Side Social Action Pills (Reels / TikTok Style) */}
      <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
        <button
          onClick={() => {
            setIsLiked(!isLiked);
            setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
          }}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <div className={`p-2.5 rounded-full bg-black/40 backdrop-blur-xs ${isLiked ? 'text-rose-500' : 'text-white'}`}>
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
          </div>
          <span className="text-[10px] font-bold font-mono">{likesCount.toLocaleString()}</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-xs text-white">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold font-mono">184</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-xs text-white">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold font-mono">Share</span>
        </button>
      </div>

      {/* 5. Bottom Swipe Up / Tap Up Interactive CTA Card */}
      <button
        onClick={onOpenBooking}
        className="relative z-30 w-full py-3 px-4 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-2xl transition-all cursor-pointer active:scale-95 group"
      >
        <ChevronUp className="w-4 h-4 animate-bounce text-white" />
        <span className="text-sm font-extrabold tracking-tight">Tap to Book with S$20 OFF</span>
        <span className="text-[10px] font-mono text-amber-300 font-semibold tracking-wider">
          PROMO CODE: {creative.promoCode}
        </span>
      </button>

      {/* Decorative gradient scrim overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
    </div>
  );
};
