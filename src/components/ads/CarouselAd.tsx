import React, { useState } from 'react';
import { AdCreative } from '../../types/ad';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MoreHorizontal,
} from 'lucide-react';

interface CarouselAdProps {
  creative: AdCreative;
  onOpenBooking: () => void;
}

export const CarouselAd: React.FC<CarouselAdProps> = ({
  creative,
  onOpenBooking,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = creative.carouselSlides || [];
  const totalSlides = slides.length || 1;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const slide = slides[currentSlide] || {
    title: 'Professional House Cleaning',
    subtitle: 'Trained, NEA Licensed Cleaners in Singapore',
    pricing: 'From S$22/hr',
    features: ['Living room, bedrooms, bathrooms', '100% eco safe supplies', 'Service recovery guarantee'],
    tag: 'Popular',
    bgGradient: 'from-blue-600 to-indigo-700',
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
            SC
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1 font-bold text-xs text-slate-900 dark:text-white">
              <span>sparkclean.sg</span>
              <span className="text-blue-500 font-bold">✓</span>
            </div>
            <div className="text-[11px] text-slate-500">Sponsored · Swipe to explore services</div>
          </div>
        </div>

        <button className="text-slate-400 p-1 cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Interactive Carousel Card Container */}
      <div className="relative w-full aspect-square bg-slate-950 overflow-hidden">
        {/* Active Card Body */}
        <div
          className={`w-full h-full p-6 bg-linear-to-br ${slide.bgGradient} text-white flex flex-col justify-between transition-all duration-300 relative`}
        >
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Tag & Slide Counter */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white border border-white/20">
              {slide.tag}
            </span>

            <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[11px] font-mono text-white/90">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 space-y-3 my-auto">
            <div className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              {slide.subtitle}
            </div>
            <h3 className="text-2xl font-black text-white leading-tight">
              {slide.title}
            </h3>

            {/* Features checkmarks */}
            <div className="space-y-1.5 pt-2">
              {slide.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/90 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <span className="text-xs text-white/70">Pricing:</span>
              <div className="text-lg font-black font-mono text-amber-300">
                {slide.pricing}
              </div>
            </div>
          </div>

          {/* Bottom Trust Stamp */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/80 border-t border-white/10 pt-3">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> NEA Licensed & Insured
            </span>
            <span className="font-mono text-amber-300 font-bold">Promo: SGCLEAN20</span>
          </div>
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-4 bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. CTA Bar */}
      <button
        onClick={onOpenBooking}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer group shadow-md"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Book This Service · Claim S$20 Off</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-100 group-hover:translate-x-1 transition-transform">
          <span>Instant Quote</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      {/* 4. Action Row & Caption */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
            <Heart className="w-6 h-6 hover:text-rose-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-6 h-6 hover:text-slate-900 dark:hover:text-white cursor-pointer" />
            <Send className="w-5 h-5 -rotate-12 cursor-pointer" />
          </div>
          <Bookmark className="w-6 h-6 text-slate-700 dark:text-slate-300 hover:text-blue-500 cursor-pointer" />
        </div>

        <div className="text-xs text-slate-800 dark:text-slate-200">
          <span className="font-bold text-slate-900 dark:text-white mr-1.5">sparkclean.sg</span>
          <span>From regular weekly upkeep to deep move-in cleans, we've got your Singapore home covered. 🇸🇬 All cleaners are NEA certified and background checked.</span>
        </div>
      </div>
    </div>
  );
};
