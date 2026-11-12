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
  Clock,
  Award,
  Users,
  MessageCircle,
} from 'lucide-react';

export default function App() {
  const [selectedSegmentKey, setSelectedSegmentKey] = useState<CustomerSegmentKey>('families');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram_feed');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'consumer' | 'marketer'>('consumer');

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* 1. Header Bar */}
      <Header
        currentTab={viewMode === 'consumer' ? 'ad_preview' : 'canvas_audit'}
        onSelectTab={tab => {
          if (tab === 'canvas_audit') setIsCanvasModalOpen(true);
          else if (tab === 'copy_kit') setViewMode('marketer');
          else setViewMode('consumer');
        }}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenCanvas={() => setIsCanvasModalOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Top Reassurance Strip for Consumers */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-teal-700 text-white px-4 py-2.5 text-xs shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">
              Singapore’s Trusted House Cleaning · <strong>NEA Licensed & Police Background Checked</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-blue-100 text-[11px] font-medium">
            <span>🌿 100% SimplyGood Eco-Safe</span>
            <span>·</span>
            <span>⚡ 60-Sec Mobile Booking</span>
            <span>·</span>
            <span className="text-amber-300 font-bold">Use Code SGCLEAN20 (S$20 OFF)</span>
          </div>
        </div>
      </div>

      {/* 3. Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* View Mode Toggle: Consumer View vs Marketer View */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
              App Mode:
            </span>
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode('consumer')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'consumer'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Consumer View (Live Ads)</span>
              </button>
              <button
                onClick={() => setViewMode('marketer')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'marketer'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Marketer Copy & Strategy</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCanvasModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span>Inspect Business Model Canvas</span>
            </button>
          </div>
        </div>

        {/* Audience Selector Pills (Consumer Friendly) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Who is this ad for? (Customer Segment)
            </span>
            <span className="text-[11px]">Click to customize ad hook & copy</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { key: 'families', label: 'Busy Families & Kids', icon: '👨‍👩‍👧', hook: 'Reclaim Saturdays' },
              { key: 'dinks', label: 'Working Couples (DINKs)', icon: '🍸', hook: 'Hotel-clean Friday' },
              { key: 'airbnb', label: 'Airbnb Hosts & Landlords', icon: '🔑', hook: '3-Hour Turnovers' },
              { key: 'expats', label: 'Expats & Condos', icon: '🌏', hook: 'No Maid Levy/Hassle' },
              { key: 'movein', label: 'Move-In / Handover', icon: '📦', hook: '100% Deposit Pass' },
            ].map(item => {
              const isSelected = selectedSegmentKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedSegmentKey(item.key as CustomerSegmentKey)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.hook}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Format Tabs */}
        <div className="flex items-center justify-between gap-3 p-2 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedPlatform('instagram_feed')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedPlatform === 'instagram_feed'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram & Facebook Feed</span>
            </button>

            <button
              onClick={() => setSelectedPlatform('instagram_story')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedPlatform === 'instagram_story'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>TikTok & Reels Video (9:16)</span>
            </button>

            <button
              onClick={() => setSelectedPlatform('carousel')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedPlatform === 'carousel'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Swipeable Carousel (4 Cards)</span>
            </button>

            <button
              onClick={() => setSelectedPlatform('facebook_feed')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedPlatform === 'facebook_feed'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook Link Post</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500">
            <span>Interactive: Slide, Like & Click CTA</span>
          </div>
        </div>

        {/* Main Two-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Ad Creative in Realistic Mobile Preview (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
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

          {/* Right Column: Consumer Value Proposition & Quick Instant Calculator (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Consumer Reassurance Hero Card */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Why Singapore Homes Choose SparkClean SG
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Rated 4.9/5 (1,400+ Homes)
                </span>
              </div>

              {/* 4 Pillars Grid (Direct from Canvas) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>NEA Licensed & Police Vetted</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Trained local cleaning professionals. Fully insured against accidental damages.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>SimplyGood Eco & Pet Safe</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    100% plant-based non-toxic formulas. Zero chlorine fumes. Safe for babies and pets.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Instant 60-Second Booking</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    No waiting for quotes. Pick your date and slot instantly with zero contract lock-ins.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>100% Free Re-Clean Guarantee</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Not completely thrilled with the clean? Our supervisor will return to re-clean for free.
                  </p>
                </div>
              </div>

              {/* Instant Call To Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs text-slate-500">First-Time Trial Offer:</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>S$20 OFF with code</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                      SGCLEAN20
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Book in 60 Secs</span>
                  </button>

                  <a
                    href="https://wa.me/6591234567?text=Hi%20SparkClean%20SG,%20I'd%20like%20to%20enquire%20about%20house%20cleaning%20with%20promo%20code%20SGCLEAN20."
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* If Marketer Mode is Active, show the Copy Kit & Meta Ads Manager tools */}
            {viewMode === 'marketer' ? (
              <AdCopyInspector creative={creative} />
            ) : (
              /* Consumer Reviews & Pricing Snapshot */
              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Transparent Singapore Pricing Guide
                  </span>
                  <span className="text-slate-400">Zero Hidden Surcharges</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Regular Weekly Cleaning</div>
                      <div className="text-[11px] text-slate-500">Dedicated helper every week (3 to 4 hours)</div>
                    </div>
                    <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      S$24 / hr
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Every 2 Weeks (Bi-Weekly)</div>
                      <div className="text-[11px] text-slate-500">Twice-monthly general maintenance clean</div>
                    </div>
                    <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      S$26 / hr
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">One-Time Deep Clean</div>
                      <div className="text-[11px] text-slate-500">Steam sanitization + grout & kitchen degreasing</div>
                    </div>
                    <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      From S$180 flat
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Tenancy Move-Out / Handover</div>
                      <div className="text-[11px] text-slate-500">100% Landlord Inspection Deposit Pass Guarantee</div>
                    </div>
                    <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      From S$260 flat
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 text-[11px] flex items-center justify-between">
                  <span>✨ SimplyGood eco supplies, equipment, and travel fees are all included!</span>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="font-bold underline cursor-pointer hover:text-blue-600"
                  >
                    Calculate for my home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultPromoCode={creative.promoCode}
      />

      <CanvasInsightsModal
        isOpen={isCanvasModalOpen}
        onClose={() => setIsCanvasModalOpen(false)}
      />

      {/* 5. Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">SparkClean SG</span>
            <span> — NEA Licensed House Cleaning Services in Singapore.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsCanvasModalOpen(true)}
              className="hover:text-blue-500 transition-colors cursor-pointer"
            >
              View Canvas Source
            </button>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Book with S$20 Off
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
