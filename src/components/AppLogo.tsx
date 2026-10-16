import React, { useState } from 'react';
import sandeLogoImg from '../assets/images/sande_iq_logo_1791596664176.jpg';

interface AppLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  variant = 'compact',
  size = 'sm',
  className = '',
  showSubtitle = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Pixel sizing dictionary for the square emblem
  const iconPixelSize = {
    sm: 34,
    md: 42,
    lg: 56,
    xl: 84,
  }[size];

  // SVG Fallback representing the official Sand.E IQ Bulb & Brain emblem
  const FallbackEmblem = ({ pixelSize }: { pixelSize: number }) => (
    <svg
      style={{ width: pixelSize, height: pixelSize }}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="iqInnerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0369a1" stopOpacity="0.45" />
          <stop offset="75%" stopColor="#020617" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#000000" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="iqCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="45%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="iqGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>

      {/* Background Frame */}
      <rect width="100" height="100" rx="24" fill="url(#iqInnerGlow)" />
      <rect
        x="2.5"
        y="2.5"
        width="95"
        height="95"
        rx="22"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeDasharray="5 3"
        opacity="0.4"
      />

      {/* IQ Motif: 'I' with glowing lightbulb, 'Q' with brain */}
      <g transform="translate(18, 16)">
        {/* 'I' Lightbulb filament & stem */}
        <circle cx="16" cy="18" r="10" fill="url(#iqGoldGrad)" className="animate-pulse" />
        <path d="M12,25 L20,25 L18,30 L14,30 Z" fill="#eab308" />
        <rect x="13.5" y="32" width="5" height="24" rx="2.5" fill="url(#iqCyanGrad)" />

        {/* 'Q' Circular Ring with inner Brain */}
        <ellipse cx="48" cy="36" rx="20" ry="21" fill="none" stroke="url(#iqCyanGrad)" strokeWidth="6" />
        <path d="M58,48 L68,60" stroke="url(#iqCyanGrad)" strokeWidth="5.5" strokeLinecap="round" />

        {/* Brain Silhouette inside 'Q' */}
        <path
          d="M42,32 C40,28 45,26 48,28 C51,26 56,28 54,32 C57,35 56,41 52,43 C49,44 47,44 44,43 C40,41 39,35 42,32 Z"
          fill="#38bdf8"
          opacity="0.85"
        />
        <circle cx="48" cy="34" r="2" fill="#ffffff" />
      </g>
    </svg>
  );

  // Emblem renderer: Uses the official logo image with smooth SVG fallback
  const Emblem = ({ pixelSize }: { pixelSize: number }) => {
    if (imgError) {
      return <FallbackEmblem pixelSize={pixelSize} />;
    }
    return (
      <div
        style={{ width: pixelSize, height: pixelSize }}
        className="relative shrink-0 rounded-xl overflow-hidden bg-black border border-cyan-500/50 shadow-[0_0_15px_rgba(56,189,248,0.4)] flex items-center justify-center select-none"
      >
        <img
          src={sandeLogoImg}
          alt="Sand.E IQ Logo"
          className="w-full h-full object-cover rounded-xl"
          onError={() => setImgError(true)}
          loading="eager"
        />
      </div>
    );
  };

  // 1. Icon-only variant (App installs, buttons, favicons)
  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
        aria-label="Sand.E Logo"
      >
        <Emblem pixelSize={iconPixelSize} />
      </div>
    );
  }

  // 2. Large Badge Variant (Hero Banner, Website Portal & Intro)
  if (variant === 'badge' || size === 'xl') {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center bg-black/95 p-4 sm:p-6 rounded-3xl border-2 border-cyan-500/50 shadow-[0_0_45px_rgba(56,189,248,0.35)] select-none shrink-0 ${className}`}
      >
        {/* High-res Display of the official IQ Logo */}
        <div className="relative w-40 sm:w-48 aspect-square rounded-2xl overflow-hidden border border-cyan-400/40 shadow-[0_0_25px_rgba(56,189,248,0.5)] bg-black">
          <img
            src={sandeLogoImg}
            alt="Sand.E Official Logo"
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        </div>

        <div className="mt-3.5 flex flex-col items-center text-center">
          <div className="font-black text-2xl sm:text-3xl font-sans tracking-tight flex items-baseline leading-none">
            <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]">Sand</span>
            <span className="text-amber-400 text-3xl mx-0.5 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]">.</span>
            <span className="text-amber-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]">E</span>
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-cyan-400 font-mono font-bold mt-1.5 uppercase">
            IQ BRAIN & PUZZLE ARENA
          </span>
        </div>
      </div>
    );
  }

  // 3. Compact & Full Horizontal Lockup (Top Navbar Header & Modals)
  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2.5 px-1.5 sm:px-2.5 py-1 rounded-xl bg-black/90 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)] border border-cyan-500/40 select-none shrink-0 max-w-full ${className}`}
      aria-label="Sand.E Logo"
    >
      {/* Official IQ Emblem Thumbnail */}
      <Emblem pixelSize={iconPixelSize} />

      {/* Wordmark: "Sand.E IQ" */}
      <div className="flex flex-col text-left leading-none min-w-0">
        <div className="font-black tracking-tight text-xs sm:text-base font-sans text-white leading-tight flex items-baseline select-none">
          <span className="text-white font-extrabold tracking-normal">Sand</span>
          <span className="text-amber-400 font-black text-sm sm:text-lg leading-none mx-0.5 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">
            .
          </span>
          <span className="text-amber-400 font-extrabold tracking-normal drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">
            E
          </span>
          <span className="text-cyan-400 font-black ml-1 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]">
            IQ
          </span>
        </div>

        <span className="hidden sm:block text-[9px] tracking-wider text-cyan-400/90 font-mono font-bold mt-0.5 uppercase">
          CHALLENGE YOUR MIND
        </span>
      </div>
    </div>
  );
};
