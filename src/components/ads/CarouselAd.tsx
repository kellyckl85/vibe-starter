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

  const carouselCards = [
    {
      title: 'Weekly Home Cleaning',
      subtitle: 'From S$22/hr · Dedicated helper every week',
      pricing: 'From S$88 / session',
      features: ['Living room, bedrooms & bathrooms', 'Vacuum, mop, kitchen degreasing & trash', 'Same vetted helper assigned'],
      tag: 'Most Popular in SG',
      bgImg: '/src/assets/images/clean_living_room_1794457338958.jpg',
    },
    {
      title: '100% Pet & Baby Safe Eco Clean',
      subtitle: 'SimplyGood & 3M Plant-based formulas',
      pricing: 'Complimentary on all cleans',
      features: ['Zero toxic ammonia or chlorine bleach', 'Hypoallergenic surfaces for crawling infants', 'Safe for curious cats and dogs'],
      tag: 'Eco Certified',
      bgImg: '/src/assets/images/happy_singapore_family_1794457340622.jpg',
    },
    {
      title: 'Deep Kitchen & Hob Degreasing',
      subtitle: 'Heavy grease, oven & tile grout removal',
      pricing: 'From S$160 flat',
      features: ['Induction and gas hob carbon removal', '140°C high-pressure steam sanitization', 'Range hood oil filter detailing'],
      tag: 'Intensive Clean',
      bgImg: '/src/assets/images/clean_kitchen_hob_1794457340008.jpg',
    },
    {
      title: 'Instant 60-Sec Mobile Booking',
      subtitle: 'No contracts · Pay with PayNow or Card',
      pricing: 'Use code SGCLEAN20 for S$20 OFF',
      features: ['Pick exact morning or afternoon slot', 'Free cancellation up to 24h before', '24/7 WhatsApp customer service support'],
      tag: 'S$20 OFF Trial',
      bgImg: '/src/assets/images/clean_living_room_1794457338958.jpg',
    },
  ];

  const totalSlides = carouselCards.length;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const slide = carouselCards[currentSlide];

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
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

      {/* 2. Interactive Carousel Card with AI Photography */}
      <div className="relative w-full aspect-square bg-slate-950 overflow-hidden">
        {/* Real AI Image Background */}
        <img
          src={slide.bgImg}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
        />

        {/* Contrast Scrim Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/50" />

        {/* Card Content */}
        <div className="relative z-10 w-full h-full p-6 text-white flex flex-col justify-between">
          {/* Top Tag & Slide Counter */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-xs font-bold text-white shadow-md">
              {slide.tag}
            </span>

            <div className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono text-white/90">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>

          {/* Center Info */}
          <div className="space-y-2.5 my-auto max-w-sm">
            <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              {slide.subtitle}
            </div>
            <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md">
              {slide.title}
            </h3>

            {/* Features checkmarks */}
            <div className="space-y-1.5 pt-1">
              {slide.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white drop-shadow font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-300">Pricing:</span>
              <div className="text-lg font-black font-mono text-amber-300 drop-shadow">
                {slide.pricing}
              </div>
            </div>
          </div>

          {/* Bottom Trust Stamp */}
          <div className="flex items-center justify-between text-xs text-white/90 border-t border-white/20 pt-3">
            <span className="flex items-center gap-1 font-semibold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" /> NEA Licensed & Insured
            </span>
            <span className="font-mono text-amber-300 font-bold">Code: SGCLEAN20</span>
          </div>
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {carouselCards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. CTA Bar */}
      <button
        onClick={onOpenBooking}
        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-between transition-colors cursor-pointer group shadow-md"
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
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-5 h-5 hover:text-slate-900 dark:hover:text-white cursor-pointer" />
            <Send className="w-5 h-5 -rotate-12 cursor-pointer" />
          </div>
          <Bookmark className="w-5 h-5 text-slate-700 dark:text-slate-300 hover:text-blue-500 cursor-pointer" />
        </div>

        <div className="text-xs text-slate-800 dark:text-slate-200">
          <span className="font-bold text-slate-900 dark:text-white mr-1.5">sparkclean.sg</span>
          <span>From regular weekly upkeep to deep move-in cleans, we've got your Singapore home covered. 🇸🇬 All cleaners are NEA certified and background checked.</span>
        </div>
      </div>
    </div>
  );
};
