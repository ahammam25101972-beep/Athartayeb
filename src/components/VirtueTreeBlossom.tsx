import React from 'react';
import { Sparkles, Heart, BookOpen, Award, CheckCircle } from 'lucide-react';
import { SiteLogo } from './SiteLogo';

interface VirtueTreeBlossomProps {
  deceasedName: string;
  totalScore: number;
  prayerCount: number;
  completedJuzCount: number;
  totalTasbihCount: number;
}

export const VirtueTreeBlossom: React.FC<VirtueTreeBlossomProps> = ({
  deceasedName,
  totalScore,
  prayerCount,
  completedJuzCount,
  totalTasbihCount
}) => {
  // Determine blossom level (1 to 5)
  let level = 1;
  let levelTitle = "غرسة الخير الأولى";
  if (totalScore > 500) { level = 5; levelTitle = "شجرة وارفة الظلال بالخيرات والبركات"; }
  else if (totalScore > 250) { level = 4; levelTitle = "شجرة مزهرة ومثمرة بالدعاء"; }
  else if (totalScore > 100) { level = 3; levelTitle = "شجرة متفرعة بالصدقات الجارية"; }
  else if (totalScore > 30) { level = 2; levelTitle = "شجرة نامية ببر الأهل والمحبين"; }

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border-2 border-amber-400/40 shadow-xl relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
        
        {/* Visual Medallion Logo & Level */}
        <div className="flex flex-col items-center text-center shrink-0">
          <div className="relative group">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-amber-300/40 shadow-2xl hover:scale-105 transition-transform duration-300">
              <SiteLogo size={120} />
            </div>
            <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold font-sans shadow-md border border-amber-300">
              المستوى {level}
            </div>
          </div>
          <span className="text-xs text-amber-300 font-bold font-quran mt-3 block">
            {levelTitle}
          </span>
        </div>

        {/* Narrative & Stats */}
        <div className="flex-1 text-center md:text-right space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>شجرة الأثر الطيب لروح {deceasedName}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold font-quran text-white leading-snug">
            «أَصْلُهَا ثَابِتٌ وَفَرْعُهَا فِي السَّمَاءِ»
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            كل دعوة صادقة، وآية قرآن تُتلى، وتسبيحة تُقال، وصدقة جارية تُبذل؛ تنمي هذه الشجرة المباركة ويزداد أثرها نوراً في صحيفة حسناته بإذن الله تعالى.
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-stone-400 font-bold">دعوات مسجلة</span>
              <span className="text-base sm:text-lg font-black font-sans text-amber-400">
                {prayerCount.toLocaleString('ar-EG')}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-stone-400 font-bold">أجزاء قرآن</span>
              <span className="text-base sm:text-lg font-black font-sans text-emerald-400">
                {completedJuzCount.toLocaleString('ar-EG')}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-stone-400 font-bold">تسبيحات مُهداة</span>
              <span className="text-base sm:text-lg font-black font-sans text-cyan-300">
                {totalTasbihCount.toLocaleString('ar-EG')}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-stone-400 font-bold">نقاط الأثر</span>
              <span className="text-base sm:text-lg font-black font-sans text-white">
                {totalScore.toLocaleString('ar-EG')} 🌿
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
