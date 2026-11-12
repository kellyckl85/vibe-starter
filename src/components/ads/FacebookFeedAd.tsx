import React, { useState } from 'react';
import { AdCreative } from '../../types/ad';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Globe,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface FacebookFeedAdProps {
  creative: AdCreative;
  onOpenBooking: () => void;
}

export const FacebookFeedAd: React.FC<FacebookFeedAdProps> = ({
  creative,
  onOpenBooking,
}) => {
  const [likes, setLikes] = useState(1420);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
      {/* 1. Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
            SC
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
              <span>SparkClean Singapore</span>
              <span className="text-blue-500 font-bold">✓</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Sponsored</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 cursor-pointer">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Primary Text */}
      <div className="px-4 pb-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
        {creative.primaryText}
      </div>

      {/* 3. Media Link Card with Real AI Image */}
      <div
        onClick={onOpenBooking}
        className="border-y border-slate-200 dark:border-slate-800 cursor-pointer group"
      >
        {/* Banner Graphic with Photography */}
        <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
          <img
            src="/src/assets/images/clean_living_room_1794457338958.jpg"
            alt="SparkClean Singapore Modern Home"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/45" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" /> NEA Accredited
            </span>
            <span className="text-xs font-mono font-bold text-amber-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              {creative.promoCode} (-{creative.discountValue})
            </span>
          </div>

          {/* Overlay Text */}
          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
              {creative.headline}
            </h3>
            <p className="text-xs text-slate-200 mt-0.5 drop-shadow">
              Singapore's eco home cleaning service with 100% SimplyGood non-toxic formulas.
            </p>
          </div>
        </div>

        {/* Link Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              SPARKCLEAN.SG
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {creative.headline}
            </div>
            <div className="text-xs text-slate-500 truncate">
              No contracts · 24/7 Hotline · Service recovery guarantee
            </div>
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              onOpenBooking();
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 transition-colors shadow-md cursor-pointer"
          >
            {creative.ctaLabel}
          </button>
        </div>
      </div>

      {/* 4. Social Engagement Counts & Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
              👍
            </span>
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>186 comments</span>
            <span>42 shares</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-3 pt-1 text-slate-600 dark:text-slate-400 font-semibold text-xs text-center">
          <button
            onClick={toggleLike}
            className={`py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? 'text-blue-600' : ''
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-blue-600' : ''}`} />
            <span>Like</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
