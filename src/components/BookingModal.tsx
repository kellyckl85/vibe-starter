import React, { useState } from 'react';
import { BookingFormState } from '../types/ad';
import {
  X,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  Home,
  CheckCircle2,
  DollarSign,
  Tag,
  Phone,
  MapPin,
  Heart,
  MessageCircle,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPromoCode?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultPromoCode = 'SGCLEAN20',
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<BookingFormState>({
    housingType: 'HDB 4-Room',
    serviceType: 'Regular Weekly Clean',
    cleaningHours: 3.5,
    addOns: {
      ironing: false,
      sofaSteam: false,
      ovenFridge: false,
      balconyJet: false,
    },
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeslot: 'Morning (09:00 - 13:00)',
    customerName: '',
    customerPhone: '',
    postalCode: '',
    hasPets: true,
    promoCode: defaultPromoCode,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [promoApplied, setPromoApplied] = useState(true);

  // Price calculations in SGD based on Singapore market & canvas revenue model
  const calculatePricing = () => {
    let base = 0;
    if (form.serviceType === 'Regular Weekly Clean') {
      base = form.cleaningHours * 24; // S$24/hr
    } else if (form.serviceType === 'Bi-Weekly Clean') {
      base = form.cleaningHours * 26; // S$26/hr
    } else if (form.serviceType === 'One-Time Deep Clean') {
      base = 180;
    } else if (form.serviceType === 'Move-In / Move-Out Clean') {
      base = 260;
    } else if (form.serviceType === 'Airbnb Turnover') {
      base = 110;
    }

    let addOnsTotal = 0;
    if (form.addOns.ironing) addOnsTotal += 20;
    if (form.addOns.sofaSteam) addOnsTotal += 45;
    if (form.addOns.ovenFridge) addOnsTotal += 35;
    if (form.addOns.balconyJet) addOnsTotal += 25;

    const discount = promoApplied && form.promoCode.trim().toUpperCase() === 'SGCLEAN20' ? 20 : 0;
    const finalTotal = Math.max(0, base + addOnsTotal - discount);

    return { base, addOnsTotal, discount, finalTotal };
  };

  const { base, addOnsTotal, discount, finalTotal } = calculatePricing();

  const handleHousingChange = (type: BookingFormState['housingType']) => {
    let hours = 3;
    if (type === 'HDB 4-Room') hours = 3.5;
    if (type === 'HDB 5-Room / Exec') hours = 4;
    if (type === 'Condo (3+ Bed)') hours = 4;
    if (type === 'Landed Property') hours = 5;
    setForm(prev => ({ ...prev, housingType: type, cleaningHours: hours }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
              SC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  SparkClean SG Instant Booking
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  NEA Licensed
                </span>
              </div>
              <p className="text-xs text-slate-500">60-second quote & booking · Zero contracts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Promo Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-800 dark:text-slate-200">
                    Promo code <strong className="font-mono text-amber-600 dark:text-amber-400">{form.promoCode}</strong> applied (-S$20 OFF)
                  </span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">First-Time Trial</span>
              </div>

              {/* 1. Housing Type Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Select Housing Type (Singapore)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'HDB 3-Room',
                      'HDB 4-Room',
                      'HDB 5-Room / Exec',
                      'Condo (1-2 Bed)',
                      'Condo (3+ Bed)',
                      'Landed Property',
                    ] as const
                  ).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleHousingChange(type)}
                      className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                        form.housingType === type
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div>{type}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {type === 'HDB 3-Room' && '~65 sqm · 3 hrs'}
                        {type === 'HDB 4-Room' && '~90 sqm · 3.5 hrs'}
                        {type === 'HDB 5-Room / Exec' && '~115 sqm · 4 hrs'}
                        {type === 'Condo (1-2 Bed)' && '~60 sqm · 3 hrs'}
                        {type === 'Condo (3+ Bed)' && '~110 sqm · 4 hrs'}
                        {type === 'Landed Property' && 'Multi-storey · 5 hrs'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Service Tier */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Choose Service Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(
                    [
                      { id: 'Regular Weekly Clean', label: 'Regular Weekly Cleaning', note: 'S$24/hr (15% Savings)', badge: 'Most Popular' },
                      { id: 'Bi-Weekly Clean', label: 'Bi-Weekly Cleaning', note: 'S$26/hr (10% Savings)', badge: 'Flexible' },
                      { id: 'One-Time Deep Clean', label: 'Deep Steam Sanitization', note: 'From S$180 flat', badge: 'Intensive' },
                      { id: 'Move-In / Move-Out Clean', label: 'Tenancy Handover Clean', note: 'S$260 · Deposit Guarantee', badge: 'Handover Pass' },
                      { id: 'Airbnb Turnover', label: 'Airbnb Fast Turnover', note: 'S$110 · 3-Hour Rapid', badge: 'Host Special' },
                    ] as const
                  ).map(srv => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setForm({ ...form, serviceType: srv.id })}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        form.serviceType === srv.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{srv.label}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {srv.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">{srv.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Add-on Services (From Canvas Revenue Streams) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Popular Add-Ons (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.addOns.ironing}
                      onChange={e => setForm({ ...form, addOns: { ...form.addOns, ironing: e.target.checked } })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Clothes Ironing</div>
                      <div className="text-[10px] text-slate-400">+S$20 (up to 12 pieces)</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.addOns.sofaSteam}
                      onChange={e => setForm({ ...form, addOns: { ...form.addOns, sofaSteam: e.target.checked } })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Sofa & Mattress Steam</div>
                      <div className="text-[10px] text-slate-400">+S$45 (Anti-dust mite)</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.addOns.ovenFridge}
                      onChange={e => setForm({ ...form, addOns: { ...form.addOns, ovenFridge: e.target.checked } })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Oven & Fridge Interior</div>
                      <div className="text-[10px] text-slate-400">+S$35 (Degrease & deodorize)</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.addOns.balconyJet}
                      onChange={e => setForm({ ...form, addOns: { ...form.addOns, balconyJet: e.target.checked } })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Balcony High-Pressure Jet</div>
                      <div className="text-[10px] text-slate-400">+S$25 (Algae & dirt removal)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. Scheduling & Contact Info */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  4. Preferred Date & Contact Info
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={form.preferredDate}
                      onChange={e => setForm({ ...form, preferredDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Timeslot</label>
                    <select
                      value={form.timeslot}
                      onChange={e => setForm({ ...form, timeslot: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option>Morning (09:00 - 13:00)</option>
                      <option>Afternoon (14:00 - 18:00)</option>
                      <option>Evening (18:30 - 21:30)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kelvin Tan"
                      value={form.customerName}
                      onChange={e => setForm({ ...form, customerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Singapore Mobile (+65)</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9123 4567"
                      value={form.customerPhone}
                      onChange={e => setForm({ ...form, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 mb-1">Singapore Postal Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 828833 (Punggol) or 528523 (Tampines)"
                      value={form.postalCode}
                      onChange={e => setForm({ ...form, postalCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Pet Safe Checkbox */}
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasPets}
                    onChange={e => setForm({ ...form, hasPets: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    🐾 <strong>I have pets / infants at home:</strong> Assign a pet-friendly cleaner with 100% SimplyGood hypoallergenic plant sprays.
                  </span>
                </label>
              </div>

              {/* Price Calculation Summary Strip */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Base Cleaning Service:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">S${base.toFixed(2)}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Selected Add-ons:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">+S${addOnsTotal.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Promo Code ({form.promoCode}):</span>
                    <span className="font-mono">-S${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total Estimated SGD:</span>
                  <span className="font-mono text-xl text-blue-600 dark:text-blue-400">
                    S${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirm Booking & Reserve Cleaner</span>
              </button>
            </form>
          ) : (
            /* Booking Confirmation View */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Booking Reserved Successfully! 🎉
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reference ID: <strong className="font-mono text-blue-600">#SG-84291</strong> · A confirmation SMS has been sent to +65 {form.customerPhone || '9123 4567'}.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-bold">{form.serviceType} ({form.housingType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheduled Date:</span>
                  <span className="font-semibold">{form.preferredDate} ({form.timeslot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Postal Code:</span>
                  <span className="font-mono">{form.postalCode || 'Singapore'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Charged:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">
                    S${finalTotal.toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>NEA Licensed cleaner assigned · SimplyGood eco supplies included</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/6591234567?text=Hi%20SparkClean%20SG,%20I%20just%20booked%20reference%20SG-84291%20for%20${form.serviceType}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Hotline</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close & Back to Ad
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
