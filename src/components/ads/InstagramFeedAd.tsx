import React, { useState } from 'react';
import { AdCreative } from '../../types/ad';
import { BeforeAfterSlider } from '../BeforeAfterSlider';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Tag,
} from 'lucide-react';

interface InstagramFeedAdProps {
  creative: AdCreative;
  onOpenBooking: () => void;
}

export const InstagramFeedAd: React.FC<InstagramFeedAdProps> = ({
  creative,
  onOpenBooking,
}) => {
  const [likes, setLikes] = useState(2481);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    setToastMessage('Link copied! Ready to share with family.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-all">
      {/* 1. Instagram Post Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative p-0.5 rounded-full bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
              SC
            </div>
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
              <span>sparkclean.sg</span>
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Sponsored · Singapore
            </div>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 cursor-pointer">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Catchy Consumer Headline Banner */}
      <div className="px-4 py-3 bg-linear-to-r from-blue-50 via-teal-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Singapore Home Cleaning
          </span>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            From S$22 / hour
          </span>
        </div>
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
          {creative.headline}
        </h3>
      </div>

      {/* 3. Primary Media: Interactive Before/After Visualizer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950">
        <BeforeAfterSlider />
      </div>

      {/* 4. Consumer 3-Step "How It Works" Bar */}
      <div className="grid grid-cols-3 gap-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800 text-center">
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">1. Book in 60s</div>
          <div className="text-[10px] text-slate-500">Pick date & time</div>
        </div>
        <div className="space-y-0.5 border-x border-slate-200 dark:border-slate-700 px-1">
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">2. Pro Arrives</div>
          <div className="text-[10px] text-slate-500">NEA staff + eco supplies</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400">3. Relax & Rest</div>
          <div className="text-[10px] text-slate-500">100% clean guarantee</div>
        </div>
      </div>

      {/* 5. Big High-Converting CTA Button */}
      <div className="p-3.5 bg-white dark:bg-slate-900">
        <button
          onClick={onOpenBooking}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer shadow-lg shadow-blue-500/25 group"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-300" />
            <span>Book Now · S$20 OFF First Clean</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs text-amber-300 bg-blue-700/60 px-2 py-0.5 rounded-md group-hover:translate-x-0.5 transition-transform">
            <span>SGCLEAN20</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Reassurance points below CTA */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 mt-2 font-medium">
          <span>✓ No Contracts</span>
          <span>✓ Pay with PayNow/Card</span>
          <span>✓ Free Re-Clean if Unhappy</span>
        </div>
      </div>

      {/* 6. Social Engagement Icons & Caption */}
      <div className="px-4 pb-4 space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`transition-transform active:scale-125 cursor-pointer flex items-center gap-1.5 ${
                isLiked ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
              <span className="text-xs font-mono tabular-nums">{likes.toLocaleString()}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-mono">48 reviews</span>
            </button>

            <button
              onClick={handleShare}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Send className="w-5 h-5 -rotate-12" />
            </button>
          </div>

          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`transition-colors cursor-pointer ${
              isSaved ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Clear, Readable Consumer Caption */}
        <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
          <div className="whitespace-pre-line">
            {isCaptionExpanded ? creative.primaryText : `${creative.primaryText.slice(0, 150)}...`}
          </div>

          <button
            onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
            className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer text-xs mt-1 block"
          >
            {isCaptionExpanded ? 'Read less' : 'Read full details & promo'}
          </button>
        </div>

        {/* Customer Testimonial Accordion */}
        {showComments && (
          <div className="mt-2 space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 animate-in fade-in">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Verified Singapore Customer Reviews (4.9 / 5.0)
            </div>
            {creative.testimonials.map((test, i) => (
              <div key={i} className="text-xs space-y-0.5 pb-2 border-b border-slate-200/60 dark:border-slate-700 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{test.author}</span>
                  <span className="text-amber-400 text-xs">★★★★★</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                  "{test.quote}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
