import React, { useState, useEffect } from 'react';
import { customerSegments, adCreatives, canvasStrategicAlignment } from './data/adCampaignData';
import { CustomerSegmentKey, SocialPlatform } from './types/ad';
import { Header } from './components/Header';
import { InstagramFeedAd } from './components/ads/InstagramFeedAd';
import { StoryReelsAd } from './components/ads/StoryReelsAd';
import { CarouselAd } from './components/ads/CarouselAd';
import { FacebookFeedAd } from './components/ads/FacebookFeedAd';
import { BookingModal } from './components/BookingModal';
import { CanvasInsightsModal } from './components/CanvasInsightsModal';
import { AdCopyInspector } from './components/AdCopyInspector';
import {
  Sparkles,
  ShieldCheck,
  Target,
  Smartphone,
  Layers,
  Facebook,
  Instagram,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Heart,
  Eye,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function App() {
  const [selectedSegmentKey, setSelectedSegmentKey] = useState<CustomerSegmentKey>('families');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram_feed');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const [currentHeaderTab, setCurrentHeaderTab] = useState('ad_preview');

  // Dark mode handling with system / user preferences
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clean_theme');
      if (saved) return saved === 'dark';
    }
    return false; // crisp modern light canvas default, togglable to dark
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('clean_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('clean_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const currentSegment = customerSegments.find(s => s.key === selectedSegmentKey) || customerSegments[0];
  const creative = adCreatives[selectedSegmentKey] || adCreatives.families;

  const handleSelectTab = (tab: string) => {
    setCurrentHeaderTab(tab);
    if (tab === 'canvas_audit') {
      setIsCanvasModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* 1. Top Bar */}
      <Header
        currentTab={currentHeaderTab}
        onSelectTab={handleSelectTab}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenCanvas={() => setIsCanvasModalOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Strategy Context Banner */}
      <div className="bg-blue-600 text-white px-4 py-2.5 text-xs shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-extrabold bg-blue-800 text-[10px] tracking-wide uppercase">
              Business Model Canvas
            </span>
            <span className="font-semibold">
              Live Social Media Campaign for <strong>"House Cleaning Services in Singapore"</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-blue-100">
            <span>NEA Licensed Cleaners</span>
            <span>·</span>
            <span>SimplyGood Eco & Pet-Safe</span>
            <span>·</span>
            <button
              onClick={() => setIsCanvasModalOpen(true)}
              className="underline hover:text-white font-bold cursor-pointer"
            >
              View Canvas Source
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Customer Segment Switcher (Canvas Customer Segments) */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Select Target Customer Segment (From Canvas)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Switching segments updates the ad hook, copy, pain points, and recommended ad format
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              5 Canvas Audiences Defined
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {customerSegments.map(seg => {
              const isSelected = selectedSegmentKey === seg.key;
              return (
                <button
                  key={seg.key}
                  onClick={() => {
                    setSelectedSegmentKey(seg.key);
                    setSelectedPlatform(seg.recommendedFormat);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {seg.badge}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                      {seg.label}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {seg.adHook}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Ad Platform / Format Controls */}
        <section className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ad Format:
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setSelectedPlatform('instagram_feed')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedPlatform === 'instagram_feed'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram / FB Feed (1:1)</span>
              </button>

              <button
                onClick={() => setSelectedPlatform('instagram_story')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedPlatform === 'instagram_story'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>TikTok / Story Reel (9:16)</span>
              </button>

              <button
                onClick={() => setSelectedPlatform('carousel')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedPlatform === 'carousel'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Swipeable Carousel</span>
              </button>

              <button
                onClick={() => setSelectedPlatform('facebook_feed')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedPlatform === 'facebook_feed'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook Link Card</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Ad Click & Booking</span>
            </button>
          </div>
        </section>

        {/* 4. Split View: Live Ad Preview (Left) vs Ad Strategy & Copy Kit (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Phone / Feed Canvas Mockup (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
              <span className="font-semibold flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-500" /> Live Interactive Ad Preview
              </span>
              <span className="font-mono text-[11px]">Click CTA to test conversion funnel</span>
            </div>

            {selectedPlatform === 'instagram_feed' && (
              <InstagramFeedAd
                creative={creative}
                onOpenBooking={() => setIsBookingOpen(true)}
              />
            )}

            {selectedPlatform === 'instagram_story' && (
              <StoryReelsAd
                creative={creative}
                onOpenBooking={() => setIsBookingOpen(true)}
              />
            )}

            {selectedPlatform === 'carousel' && (
              <CarouselAd
                creative={creative}
                onOpenBooking={() => setIsBookingOpen(true)}
              />
            )}

            {selectedPlatform === 'facebook_feed' && (
              <FacebookFeedAd
                creative={creative}
                onOpenBooking={() => setIsBookingOpen(true)}
              />
            )}
          </div>

          {/* Right Column: Strategic Analysis & Copy Kit (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Copy & Meta Ads Manager Exporter */}
            <AdCopyInspector creative={creative} />

            {/* Canvas Building Block Alignment Summary Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Strategyzer Canvas Elements Reflected in this Ad
                </h3>
                <button
                  onClick={() => setIsCanvasModalOpen(true)}
                  className="text-blue-500 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  View Canvas Matrix <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Value Proposition</span>
                  <div className="font-bold text-slate-900 dark:text-white">Reliable, Trusted, Trained Cleaners</div>
                  <p className="text-[11px] text-slate-500">
                    Highlighted with NEA licensing badge, police background check, and 24/7 hotline.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Key Partners</span>
                  <div className="font-bold text-slate-900 dark:text-white">SimplyGood & 3M Eco Supplies</div>
                  <p className="text-[11px] text-slate-500">
                    100% plant-derived formulas tailored for Singapore homes with toddlers & pets.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Customer Relationship</span>
                  <div className="font-bold text-slate-900 dark:text-white">Service Recovery Guarantee</div>
                  <p className="text-[11px] text-slate-500">
                    Free 48-hour re-clean if landlord or homeowner is not 100% satisfied with the session.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Revenue Alignment</span>
                  <div className="font-bold text-slate-900 dark:text-white">S$22K / Month Funnel</div>
                  <p className="text-[11px] text-slate-500">
                    Drives recurring weekly cleaning (S$12k stream) with add-on options (ironing, sofa, oven).
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign Performance & Ad Benchmarks */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                Singapore Paid Social Ad Benchmarks
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400">Estimated CTR</div>
                  <div className="text-base font-black font-mono text-blue-600 dark:text-blue-400 mt-1">3.85%</div>
                  <div className="text-[9px] text-emerald-500 font-semibold">+1.2% above SG avg</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400">Target CPC (SGD)</div>
                  <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">S$1.15</div>
                  <div className="text-[9px] text-slate-400 font-medium">Meta / IG Feed</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400">Customer Acq. Cost</div>
                  <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">S$28.50</div>
                  <div className="text-[9px] text-emerald-500 font-semibold">Payback in 2 cleans</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400">Monthly Target</div>
                  <div className="text-base font-black font-mono text-amber-500 mt-1">S$22,000</div>
                  <div className="text-[9px] text-slate-400 font-medium">Full capacity (5 staff)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultPromoCode={creative.promoCode}
      />

      <CanvasInsightsModal
        isOpen={isCanvasModalOpen}
        onClose={() => setIsCanvasModalOpen(false)}
      />

      {/* 6. Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">SparkClean SG</span>
            <span>·</span>
            <span>House Cleaning Services in Singapore — Social Media Ad Campaign & Creative Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCanvasModalOpen(true)}
              className="hover:text-blue-500 transition-colors cursor-pointer"
            >
              Canvas Strategy
            </button>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="hover:text-blue-500 transition-colors cursor-pointer"
            >
              Test Booking Flow
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
