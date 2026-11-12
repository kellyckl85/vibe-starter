import React, { useState } from 'react';
import { AdCreative } from '../types/ad';
import { Copy, Check, Sparkles, Send, Tag, Share2 } from 'lucide-react';

interface AdCopyInspectorProps {
  creative: AdCreative;
}

export const AdCopyInspector: React.FC<AdCopyInspectorProps> = ({ creative }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Meta & TikTok Ads Copy Kit
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Production-ready ad copy formulated for Meta Ads Manager & TikTok Ads
          </p>
        </div>

        <button
          onClick={() =>
            copyToClipboard(
              `HEADLINE:\n${creative.headline}\n\nPRIMARY TEXT:\n${creative.primaryText}\n\nCALL TO ACTION:\n${creative.ctaLabel}\n\nPROMO CODE:\n${creative.promoCode}`,
              'all'
            )
          }
          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copiedField === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedField === 'all' ? 'Copied Full Kit!' : 'Copy Entire Ad Pack'}</span>
        </button>
      </div>

      {/* Field 1: Headline */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Ad Headline (Character limit: 40)
          </span>
          <button
            onClick={() => copyToClipboard(creative.headline, 'headline')}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
          >
            {copiedField === 'headline' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedField === 'headline' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white">
          {creative.headline}
        </div>
      </div>

      {/* Field 2: Primary Text */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Primary Text (Body Copy)
          </span>
          <button
            onClick={() => copyToClipboard(creative.primaryText, 'primary')}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
          >
            {copiedField === 'primary' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedField === 'primary' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
          {creative.primaryText}
        </div>
      </div>

      {/* Field 3: Recommended Targeting */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
          Recommended Audience Targeting (Singapore)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px] block">Location</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Singapore (All regions)</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px] block">Age & Gender</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Age 25 - 58, All</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px] block">Interest Match</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">HDB, BTO, Parenting, Airbnb</span>
          </div>
        </div>
      </div>
    </div>
  );
};
