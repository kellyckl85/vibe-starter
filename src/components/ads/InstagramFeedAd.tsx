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
  Share2,
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
    setToastMessage('Ad Link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-all">
      {/* 1. Instagram Post Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          {/* Brand Avatar with Instagram Story Gradient Ring */}
          <div className="relative p-0.5 rounded-full bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
              SC
            </div>
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-1 font-bold text-xs text-slate-900 dark:text-white">
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
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Primary Media: Interactive Before/After Visualizer */}
      <div className="relative w-full bg-slate-950">
        <BeforeAfterSlider />

        {/* Floating Trust Stamp Overlay */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>NEA Licensed Cleaners</span>
        </div>
      </div>

      {/* 3. High-Converting Call To Action Strip */}
      <button
        onClick={onOpenBooking}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer group shadow-md"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{creative.ctaLabel} · Use Code <strong className="text-amber-300 font-mono tracking-wider">{creative.promoCode}</strong></span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-100 group-hover:translate-x-1 transition-transform">
          <span>{creative.discountValue}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      {/* 4. Action Buttons (Like, Comment, Share, Bookmark) */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`transition-transform active:scale-125 cursor-pointer ${
                isLiked ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <MessageCircle className="w-6 h-6" />
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
              isSaved ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-bold text-xs text-slate-900 dark:text-white">
          {likes.toLocaleString()} likes
        </div>

        {/* Ad Caption Area */}
        <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
          <span className="font-bold text-slate-900 dark:text-white mr-1.5">sparkclean.sg</span>
          <span>{creative.headline}</span>

          <div className="mt-1.5 whitespace-pre-line text-slate-600 dark:text-slate-300">
            {isCaptionExpanded ? creative.primaryText : `${creative.primaryText.slice(0, 160)}...`}
          </div>

          <button
            onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
            className="text-slate-400 dark:text-slate-500 hover:text-blue-500 font-semibold cursor-pointer text-[11px] mt-1"
          >
            {isCaptionExpanded ? 'Show less' : 'more'}
          </button>
        </div>

        {/* Singapore Local Hashtags */}
        <div className="flex flex-wrap gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-1">
          <span>#singaporecleaning</span>
          <span>#sghomes</span>
          <span>#hdbrenovation</span>
          <span>#sgexpats</span>
          <span>#sparkcleansg</span>
        </div>

        {/* Customer Testimonial Preview */}
        {creative.testimonials.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium cursor-pointer"
            >
              View all 48 verified customer reviews...
            </button>

            {showComments && (
              <div className="mt-2 space-y-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 animate-in fade-in">
                {creative.testimonials.map((test, i) => (
                  <div key={i} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{test.author}</span>
                      <span className="text-amber-400 text-[10px]">★★★★★</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      "{test.quote}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-[10px] text-slate-400 pt-1 font-mono">
          2 HOURS AGO · SPONSORED CAMPAIGN
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
