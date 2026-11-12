import React, { useState } from 'react';

interface AssetLogoProps {
  symbol: string;
  logoSlug?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AssetLogo: React.FC<AssetLogoProps> = ({
  symbol,
  logoSlug,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-5 h-5 text-[9px]',
    md: 'w-7 h-7 text-[11px]',
    lg: 'w-10 h-10 text-xs',
    xl: 'w-12 h-12 text-sm',
  };

  const cleanSymbol = symbol.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase();

  const primaryUrl = logoUrl || (logoSlug ? `https://s3-symbol-logo.tradingview.com/${logoSlug}.svg` : '');

  // Deterministic color generation based on symbol for nice fallback avatar
  const getFallbackBg = (sym: string) => {
    const colors = [
      'bg-blue-600 text-white',
      'bg-indigo-600 text-white',
      'bg-emerald-600 text-white',
      'bg-amber-600 text-white',
      'bg-violet-600 text-white',
      'bg-cyan-600 text-white',
      'bg-rose-600 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < sym.length; i++) {
      hash = sym.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (!primaryUrl || hasError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold tracking-tight shrink-0 shadow-xs ${getFallbackBg(symbol)} ${className}`}
        title={symbol}
      >
        {cleanSymbol}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 p-0.5 shadow-xs ${className}`}
    >
      <img
        src={primaryUrl}
        alt={symbol}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-contain rounded-full"
        loading="lazy"
      />
    </div>
  );
};
