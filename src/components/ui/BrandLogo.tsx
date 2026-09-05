import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  subtitle?: string
}

export function BrandLogo({
  className,
  size = 'md',
  showText = true,
  subtitle,
}: BrandLogoProps) {
  const rawId = useId()
  const uniqueId = rawId.replace(/[^a-zA-Z0-9]/g, '')

  const pillarLeftId = `ha-pillar-left-${uniqueId}`
  const pillarRightId = `ha-pillar-right-${uniqueId}`
  const chevronId = `ha-chevron-${uniqueId}`
  const glowId = `apex-glow-${uniqueId}`

  const iconSizes = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-10 w-10 rounded-xl',
  }

  return (
    <div className={cn('group flex items-center gap-2.5 sm:gap-3 select-none', className)}>
      {/* Brand Icon Mark */}
      <div
        className={cn(
          'relative flex items-center justify-center bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-background border border-border/80 group-hover:border-primary/60 transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_-2px_rgba(56,189,248,0.35)] overflow-hidden shrink-0',
          iconSizes[size]
        )}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

        {/* Custom Precision SVG Monogram: HA Fusion + AI Neural Apex */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Left pillar gradient (Deep tech blue to electric sky) */}
            <linearGradient id={pillarLeftId} x1="8" y1="6" x2="8" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Right pillar gradient (Electric indigo to vibrant cyan) */}
            <linearGradient id={pillarRightId} x1="24" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Chevron apex gradient (AI Intelligence Beam) */}
            <linearGradient id={chevronId} x1="8" y1="19" x2="16" y2="9" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>

            {/* Glowing apex filter */}
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Pillar of 'H' */}
          <rect
            x="6"
            y="6"
            width="3.5"
            height="20"
            rx="1.75"
            fill={`url(#${pillarLeftId})`}
          />

          {/* Right Pillar of 'H' */}
          <rect
            x="22.5"
            y="6"
            width="3.5"
            height="20"
            rx="1.75"
            fill={`url(#${pillarRightId})`}
          />

          {/* Upward Chevron forming 'A' and connecting the 'H' */}
          <path
            d="M 7.75 18.5 L 16 9 L 24.25 18.5"
            stroke={`url(#${chevronId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Horizontal crossbar bridge for 'H' & 'A' */}
          <path
            d="M 9.5 18.5 L 22.5 18.5"
            stroke="#38BDF8"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* Glowing Neural Apex Node (Intelligence point at top of A) */}
          <circle
            cx="16"
            cy="9"
            r="2.2"
            fill="#38BDF8"
            filter={`url(#${glowId})`}
          />
          <circle
            cx="16"
            cy="9"
            r="1.2"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-foreground transition-colors group-hover:text-foreground">
              Hassan
            </span>
            <span className="font-heading font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
              Akram
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground/80 mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
