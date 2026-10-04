import React from 'react';

interface SiteLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false
}) => {
  // Dimension mapping
  let pixelSize = 48;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'xs': pixelSize = 28; break;
      case 'sm': pixelSize = 38; break;
      case 'md': pixelSize = 48; break;
      case 'lg': pixelSize = 64; break;
      case 'xl': pixelSize = 96; break;
    }
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm select-none"
        aria-label="شعار أثر طيب - صدقة جارية لروح الفقيد"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="parchmentBg" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="70%" stopColor="#F9F4EB" />
            <stop offset="100%" stopColor="#ECE3D2" />
          </radialGradient>

          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C99738" />
            <stop offset="35%" stopColor="#F5D77F" />
            <stop offset="70%" stopColor="#C28E2E" />
            <stop offset="100%" stopColor="#8C6019" />
          </linearGradient>

          <linearGradient id="navyBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#152B34" />
            <stop offset="50%" stopColor="#0B1A20" />
            <stop offset="100%" stopColor="#173541" />
          </linearGradient>

          <linearGradient id="streamBlue" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#96C8E0" />
            <stop offset="50%" stopColor="#629CB9" />
            <stop offset="100%" stopColor="#BCE2F3" />
          </linearGradient>

          <linearGradient id="treeTrunkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#193B32" />
            <stop offset="100%" stopColor="#0D221D" />
          </linearGradient>

          {/* Curved Text Paths */}
          <path id="topCurveText" d="M 38 100 A 62 62 0 0 1 162 100" fill="none" />
          <path id="bottomOuterCurve" d="M 166 100 A 66 66 0 0 1 34 100" fill="none" />
          <path id="bottomInnerCurve" d="M 148 100 A 48 48 0 0 1 52 100" fill="none" />
        </defs>

        {/* Outer Shadow Ring */}
        <circle cx="100" cy="100" r="97" fill="#E6DCCB" opacity="0.4" />

        {/* 1. Outer Navy & Gold Circular Medallion Rings */}
        <circle cx="100" cy="100" r="94" fill="url(#parchmentBg)" stroke="url(#navyBorder)" strokeWidth="3.5" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#goldRim)" strokeWidth="1.8" />
        <circle cx="100" cy="100" r="87" fill="none" stroke="#D8C7A5" strokeWidth="0.8" strokeDasharray="1.5 2" />

        {/* Inner Medallion Border */}
        <circle cx="100" cy="100" r="74" fill="none" stroke="url(#goldRim)" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="71" fill="none" stroke="url(#navyBorder)" strokeWidth="1.2" />

        {/* 2. Top Title: أثر طيب */}
        <g fill="#8C5E1A" textAnchor="middle">
          {/* Calligraphic style rendering for top title */}
          <text 
            x="100" 
            y="42" 
            fontSize="21" 
            fontWeight="bold" 
            fontFamily="'Amiri', 'Traditional Arabic', serif"
            letterSpacing="0.5"
            fill="#875817"
          >
            أَثَـرٌ طَـيِّـب
          </text>
          {/* Decorative Harakat flourish */}
          <path d="M 88 23 Q 92 19 96 23" stroke="#C99738" strokeWidth="1.2" fill="none" />
          <path d="M 104 22 Q 108 18 112 22" stroke="#C99738" strokeWidth="1.2" fill="none" />
        </g>

        {/* 3. The Tree of Life (شجرة مباركة) & Flowing Water (سقيا ماء) */}
        <g id="treeAndStream">
          
          {/* Flowing Water Stream (سقيا ماء) flowing under the tree */}
          <path
            d="M 94 116 
               C 88 123, 76 128, 70 134 
               C 62 142, 68 152, 90 152 
               C 112 152, 126 144, 134 136 
               C 128 130, 114 126, 106 116 
               Z"
            fill="url(#streamBlue)"
            opacity="0.95"
          />
          {/* Water rippling streams */}
          <path d="M 75 138 C 85 132, 112 134, 128 140" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M 82 144 C 92 140, 108 141, 120 146" stroke="#E3F4FC" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M 88 148 C 95 146, 103 146, 112 149" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.9" />

          {/* Grassy banks with golden blossoms */}
          <path d="M 62 134 C 67 131, 72 133, 74 137 C 69 138, 64 137, 62 134 Z" fill="#2D6A4F" />
          <path d="M 125 136 C 128 132, 134 131, 137 134 C 135 137, 130 138, 125 136 Z" fill="#2D6A4F" />
          {/* Golden Flowers */}
          <circle cx="68" cy="130" r="2.2" fill="#E5A93C" />
          <circle cx="65" cy="128" r="1.2" fill="#C28E2E" />
          <circle cx="132" cy="130" r="2.2" fill="#E5A93C" />
          <circle cx="135" cy="128" r="1.2" fill="#C28E2E" />

          {/* Tree Trunk & Roots */}
          <path
            d="M 97 122 
               C 96 115, 93 108, 89 104 
               C 85 100, 83 95, 87 91
               C 89 89, 93 92, 95 96
               C 97 93, 99 87, 100 84
               C 101 87, 103 93, 105 96
               C 107 92, 111 89, 113 91
               C 117 95, 115 100, 111 104
               C 107 108, 104 115, 103 122
               Z"
            fill="url(#treeTrunkGrad)"
          />
          {/* Trunk Root details spreading into water */}
          <path d="M 94 115 C 88 120, 81 123, 78 127" stroke="#132A24" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 106 115 C 112 120, 119 123, 122 127" stroke="#132A24" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 97 118 C 95 124, 91 128, 88 132" stroke="#132A24" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 103 118 C 105 124, 109 128, 112 132" stroke="#132A24" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Tree Foliage (Canopy) - Rich multi-tone leaves */}
          {/* Central Top Leaves */}
          <path d="M 100 60 C 97 66, 97 73, 100 78 C 103 73, 103 66, 100 60 Z" fill="#2D6A4F" />
          <path d="M 95 64 C 91 69, 92 76, 96 80 C 99 76, 98 69, 95 64 Z" fill="#1B4332" />
          <path d="M 105 64 C 109 69, 108 76, 104 80 C 101 76, 102 69, 105 64 Z" fill="#1B4332" />

          {/* Left Branches & Leaves */}
          <path d="M 87 68 C 82 72, 82 79, 87 84 C 91 80, 90 73, 87 68 Z" fill="#40916C" />
          <path d="M 79 73 C 73 76, 73 83, 77 88 C 82 85, 82 78, 79 73 Z" fill="#2D6A4F" />
          <path d="M 72 80 C 66 82, 65 89, 69 94 C 74 92, 75 85, 72 80 Z" fill="#1B4332" />
          <path d="M 68 89 C 62 90, 61 97, 65 102 C 70 100, 71 93, 68 89 Z" fill="#40916C" />
          <path d="M 68 100 C 63 103, 63 110, 68 114 C 72 111, 72 104, 68 100 Z" fill="#2D6A4F" />
          <path d="M 76 106 C 72 110, 73 117, 78 120 C 82 116, 81 109, 76 106 Z" fill="#1B4332" />

          {/* Right Branches & Leaves */}
          <path d="M 113 68 C 118 72, 118 79, 113 84 C 109 80, 110 73, 113 68 Z" fill="#40916C" />
          <path d="M 121 73 C 127 76, 127 83, 123 88 C 118 85, 118 78, 121 73 Z" fill="#2D6A4F" />
          <path d="M 128 80 C 134 82, 135 89, 131 94 C 126 92, 125 85, 128 80 Z" fill="#1B4332" />
          <path d="M 132 89 C 138 90, 139 97, 135 102 C 130 100, 129 93, 132 89 Z" fill="#40916C" />
          <path d="M 132 100 C 137 103, 137 110, 132 114 C 128 111, 128 104, 132 100 Z" fill="#2D6A4F" />
          <path d="M 124 106 C 128 110, 127 117, 122 120 C 118 116, 119 109, 124 106 Z" fill="#1B4332" />

          {/* Inner Cluster Fill */}
          <circle cx="88" cy="85" r="4" fill="#52B788" opacity="0.9" />
          <circle cx="112" cy="85" r="4" fill="#52B788" opacity="0.9" />
          <circle cx="100" cy="74" r="4.5" fill="#74C69D" opacity="0.9" />
          <circle cx="82" cy="94" r="3.5" fill="#52B788" opacity="0.9" />
          <circle cx="118" cy="94" r="3.5" fill="#52B788" opacity="0.9" />
        </g>

        {/* 4. Bottom Inner Calligraphy: لِصَدَقَةٍ جَارِيَةٍ */}
        <text
          fontSize="10"
          fontFamily="'Amiri', 'Traditional Arabic', serif"
          fontWeight="bold"
          fill="#875817"
          letterSpacing="1"
        >
          <textPath href="#bottomInnerCurve" startOffset="50%" textAnchor="middle">
            لِـصَـدَقَـةٍ جَـارِيَـةٍ
          </textPath>
        </text>

        {/* 5. Bottom Outer Arc: صَدَقَةٌ جَارِيَةٌ لِرُوحِ الفَقِيد */}
        <text
          fontSize="10.5"
          fontFamily="'Amiri', 'Traditional Arabic', 'Noto Naskh Arabic', serif"
          fontWeight="bold"
          fill="#132B33"
          letterSpacing="0.8"
        >
          <textPath href="#bottomOuterCurve" startOffset="50%" textAnchor="middle">
            صَدَقَةٌ جَارِيَةٌ لِرُوحِ الفَقِيدِ
          </textPath>
        </text>

        {/* Side decorative star motifs */}
        <circle cx="28" cy="98" r="2" fill="#C99738" />
        <circle cx="172" cy="98" r="2" fill="#C99738" />
      </svg>

      {/* Brand Text if requested */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-extrabold text-stone-900 font-quran tracking-tight flex items-center gap-1.5">
            أثر طيب
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
          </span>
          <span className="text-[11px] text-stone-500 font-medium -mt-0.5">
            صدقة جارية لروح الفقيد
          </span>
        </div>
      )}
    </div>
  );
};
