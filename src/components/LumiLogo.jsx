export default function LumiLogo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-sm', gap: 'gap-1.5' },
    md: { icon: 'w-8 h-8', text: 'text-lg', gap: 'gap-2' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', gap: 'gap-3' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${s.gap}`}>
      <div className={`${s.icon} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="lumi-grad"
              x1="0"
              y1="0"
              x2="40"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="20" fill="url(#lumi-grad)" />
          <path
            d="M20 7l2.4 8a3.5 3.5 0 002.6 2.6L33 20l-8 2.4a3.5 3.5 0 00-2.6 2.6L20 33l-2.4-8a3.5 3.5 0 00-2.6-2.6L7 20l8-2.4a3.5 3.5 0 002.6-2.6L20 7z"
            fill="white"
          />
        </svg>
      </div>
      {showText && (
        <span
          className={`${s.text} font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent`}
        >
          Lumi
        </span>
      )}
    </div>
  );
}
