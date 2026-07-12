interface MadsjeezLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function MadsjeezLogo({ size = 40, className = '', showText = true }: MadsjeezLogoProps) {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#8A2BE2" />
          </linearGradient>
        </defs>
        <path
          d="M 50 10 A 40 40 0 1 0 90 50"
          stroke="url(#logoGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M 25 75 L 35 35 L 50 55 L 65 35 L 75 25"
          stroke="url(#logoGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 60 25 L 75 25 L 75 40"
          stroke="url(#logoGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg tracking-[0.2em] text-white leading-tight">
            MADSJEEZ
          </span>
          <span className="font-display text-[9px] tracking-[0.3em] text-brand-cyan/80">BROWSER</span>
        </div>
      )}
    </div>
  );
}
