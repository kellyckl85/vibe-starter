export type SocialPlatform = 'instagram_feed' | 'instagram_story' | 'tiktok_story' | 'facebook_feed' | 'carousel';

export type CustomerSegmentKey = 'families' | 'dinks' | 'airbnb' | 'expats' | 'movein';

export interface CustomerSegment {
  key: CustomerSegmentKey;
  label: string;
  badge: string;
  description: string;
  painPoint: string;
  adHook: string;
  headline: string;
  primaryText: string;
  ctaText: string;
  recommendedFormat: SocialPlatform;
}

export interface AdCreative {
  id: string;
  segmentKey: CustomerSegmentKey;
  platform: SocialPlatform;
  headline: string;
  primaryText: string;
  secondaryText: string;
  ctaLabel: string;
  promoCode: string;
  discountValue: string;
  trustBadges: string[];
  testimonials: {
    author: string;
    location: string;
    rating: number;
    quote: string;
    avatar: string;
  }[];
  carouselSlides?: {
    title: string;
    subtitle: string;
    pricing: string;
    features: string[];
    tag: string;
    bgGradient: string;
  }[];
}

export interface BookingFormState {
  housingType: 'HDB 3-Room' | 'HDB 4-Room' | 'HDB 5-Room / Exec' | 'Condo (1-2 Bed)' | 'Condo (3+ Bed)' | 'Landed Property';
  serviceType: 'Regular Weekly Clean' | 'Bi-Weekly Clean' | 'One-Time Deep Clean' | 'Move-In / Move-Out Clean' | 'Airbnb Turnover';
  cleaningHours: number;
  addOns: {
    ironing: boolean;
    sofaSteam: boolean;
    ovenFridge: boolean;
    balconyJet: boolean;
  };
  preferredDate: string;
  timeslot: 'Morning (09:00 - 13:00)' | 'Afternoon (14:00 - 18:00)' | 'Evening (18:30 - 21:30)';
  customerName: string;
  customerPhone: string;
  postalCode: string;
  hasPets: boolean;
  promoCode: string;
}
