import React, { useState } from 'react';
import { canvasStrategicAlignment } from '../data/adCampaignData';
import {
  X,
  FileText,
  DollarSign,
  Users,
  Target,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CanvasInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CanvasInsightsModal: React.FC<CanvasInsightsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'mapping' | 'canvas_image' | 'revenue'>('mapping');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Business Model Canvas Alignment
              </h2>
              <p className="text-xs text-slate-500">
                How every ad element and funnel directly executes the uploaded canvas strategy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('mapping')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'mapping'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Strategy Breakdown
              </button>
              <button
                onClick={() => setActiveTab('canvas_image')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'canvas_image'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Original Canvas Photo
              </button>
              <button
                onClick={() => setActiveTab('revenue')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'revenue'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Revenue Goals (S$22K)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'canvas_image' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Source Image: Strategyzer Business Model Canvas (Uploaded Attachment)</span>
                <a
                  href="/assets/aistudio/House_Cleaning_Services_in_Singapore_1fd86a57.png"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  Open Full Resolution <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center p-2">
                <img
                  src="/assets/aistudio/House_Cleaning_Services_in_Singapore_1fd86a57.png"
                  alt="Business Model Canvas for House Cleaning Services in Singapore"
                  className="w-full h-auto max-h-[65vh] object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {activeTab === 'mapping' && (
            <div className="space-y-6">
              {/* Value Propositions to Ad Execution */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Key Propositions Translated into High-Converting Ad Hooks
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {canvasStrategicAlignment.propositions.map((prop, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {prop.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                          Canvas Note
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] italic">
                        "{prop.canvasNote}"
                      </div>
                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Ad Execution: {prop.adExecution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Segments & Targeting */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Target Customer Segments & Media Angles
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {canvasStrategicAlignment.customerSegments.map((seg, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">
                        {seg.name}
                      </span>
                      <div className="text-[11px] text-slate-500 italic">
                        "{seg.canvasNote}"
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Targeting: {seg.target}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Partnerships & Trust Stems */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2 text-xs">
                <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Key Partners from Canvas Leveraged for Social Trust
                </div>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  <li>• <strong>NEA (National Environment Agency):</strong> Displayed as the core trust stamp ("NEA Licensed Cleaners") to eliminate scam fears.</li>
                  <li>• <strong>Sustainable Eco-Suppliers (SimplyGood, 3M):</strong> Differentiator for families with toddlers and fur-babies ("100% plant-derived formulas, zero harsh fumes").</li>
                  <li>• <strong>Property Agents & IDs:</strong> Dedicated Handover Pass Guarantee for security deposit protection on move-out cleanings.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Monthly Revenue Target</div>
                  <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    S$22,000 / month
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>Capacity: 5 full-time cleaners</div>
                  <div className="font-mono text-slate-700 dark:text-slate-300">Cost: S$10.3K - S$20.3K / mo</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Revenue Streams Breakdown (from Canvas)
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  {canvasStrategicAlignment.revenueModel.streams.map((stream, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{stream.name}</div>
                        <div className="text-[11px] text-slate-400">Target unit pricing: {stream.unitRate}</div>
                      </div>
                      <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                        {stream.share}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing Projections */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500">Target Ad CAC</div>
                  <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">S$28.50</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500">Customer Lifetime Value</div>
                  <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">S$860.00</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500">Estimated ROAS</div>
                  <div className="text-base font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">4.8x</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
