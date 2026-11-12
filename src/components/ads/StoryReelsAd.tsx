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
      title: 'Real Singapore Family Weekend ❤️',
      subtitle: 'Zero chores. Just pure family relaxation.',
      highlight: 'Toddler & Puppy safe with SimplyGood Eco Sprays',
      tag: 'Verified Singapore Clean',
      bgImg: '/src/assets/images/happy_singapore_family_1794457340622.jpg',
    },
    {
      title: 'Pristine Living Room & Floors ✨',
      subtitle: '140°C steam disinfection kill 99.9% germs',
      highlight: 'Spotless parquet floors in under 3 hours',
      tag: 'River Valley Condo',
      bgImg: '/src/assets/images/clean_living_room_1794457338958.jpg',
    },
    {
      title: 'Gleaming Marble Kitchen Hob 🍳',
      subtitle: 'Heavy grease & oil stains completely removed',
      highlight: 'Ready for family weekend cooking',
      tag: 'Punggol BTO',
      bgImg: '/src/assets/images/clean_kitchen_hob_1794457340008.jpg',
    },
  ];

  const currentStory = storySlides[activeStoryIdx];

  return (
    <div className="w-full max-w-[340px] mx-auto aspect-[9/16] bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden relative text-white flex flex-col justify-between p-4 select-none">
      {/* Background High Resolution AI Image */}
      <img
        src={currentStory.bgImg}
        alt={currentStory.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/30 to-black/90 pointer-events-none" />

      {/* 1. Top Story Progress Bars */}
      <div className="relative z-40 flex items-center gap-1.5 pt-1">
        {[0, 1, 2].map(idx => (
          <div key={idx} className="flex-1 h-1 bg-white/35 rounded-full overflow-hidden">
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
      <div className="relative z-30 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-xs border border-white/20 shadow-md">
            SC
          </div>
          <div className="leading-tight text-left">
            <div className="flex items-center gap-1 font-bold text-xs">
              <span>sparkclean.sg</span>
              <span className="text-[10px] bg-blue-500 rounded-full px-1.5 py-0.2">Sponsored</span>
            </div>
            <div className="text-[10px] text-white/80">Singapore · House Cleaning</div>
          </div>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:bg-black/70 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3. Center Creative & Customer Story Card */}
      <div className="relative z-20 my-auto space-y-3 text-center">
        {/* Floating Trust Stamp */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 border border-emerald-400/40 text-white text-xs font-bold backdrop-blur-md shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
          <ShieldCheck className="w-4 h-4 text-emerald-200" />
          <span>NEA Licensed & Police Background Vetted</span>
        </div>

        {/* Story Overlay Glass Card */}
        <div className="p-4 rounded-2xl bg-black/65 border border-white/20 backdrop-blur-md text-left space-y-1.5 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-300 font-mono tracking-wider">
              {currentStory.tag}
            </span>
            <div className="flex items-center text-amber-400 text-xs font-bold">
              ★★★★★ <span className="text-[10px] text-white/90 ml-1">(4.9/5)</span>
            </div>
          </div>

          <h3 className="text-base font-black text-white leading-tight">
            {currentStory.title}
          </h3>

          <p className="text-xs text-slate-200 leading-snug">
            {currentStory.subtitle}
          </p>

          <div className="pt-2 border-t border-white/15 flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{currentStory.highlight}</span>
          </div>
        </div>

        {/* Authentic Customer Testimonial Sticker */}
        <div className="p-3 rounded-xl bg-white/95 text-slate-900 shadow-2xl text-left transform -rotate-1 border border-slate-200 backdrop-blur-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-extrabold text-slate-900">Rachel & Darren (Punggol)</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Verified Clean</span>
          </div>
          <p className="text-xs text-slate-700 italic mt-1 leading-snug font-medium">
            "Finally took our Saturdays back! Our toddler and golden retriever can crawl safely on clean floors."
          </p>
        </div>
      </div>

      {/* 4. Right Side Social Action Pills */}
      <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
        <button
          onClick={() => {
            setIsLiked(!isLiked);
            setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
          }}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <div className={`p-2.5 rounded-full bg-black/50 backdrop-blur-md ${isLiked ? 'text-rose-500' : 'text-white'}`}>
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
          </div>
          <span className="text-[10px] font-bold font-mono drop-shadow">{likesCount.toLocaleString()}</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold font-mono drop-shadow">184</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold font-mono drop-shadow">Share</span>
        </button>
      </div>

      {/* 5. Bottom Swipe Up / Tap Up Interactive CTA Card */}
      <button
        onClick={onOpenBooking}
        className="relative z-30 w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-2xl transition-all cursor-pointer active:scale-95 group"
      >
        <ChevronUp className="w-4 h-4 animate-bounce text-white" />
        <span className="text-sm font-extrabold tracking-tight">Tap to Book with S$20 OFF</span>
        <span className="text-[10px] font-mono text-amber-300 font-semibold tracking-wider">
          PROMO CODE: {creative.promoCode}
        </span>
      </button>
    </div>
  );
};
