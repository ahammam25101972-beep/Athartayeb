import React, { useState } from 'react';
import { Sparkles, Heart, Check, Share2, Award, RotateCcw } from 'lucide-react';
import { religiousFeaturesService } from '../services/religiousFeaturesService';
import { CollectiveTasbihItem } from '../types';

interface CollectiveTasbihProps {
  memorialId: string;
  deceasedName: string;
  onActionComplete?: () => void;
}

export const CollectiveTasbih: React.FC<CollectiveTasbihProps> = ({ 
  memorialId, 
  deceasedName,
  onActionComplete
}) => {
  const [items, setItems] = useState<CollectiveTasbihItem[]>(() => 
    religiousFeaturesService.getTasbihItems(memorialId)
  );

  const [activeItemId, setActiveItemId] = useState<string>(items[0]?.id || 't-1');
  const [sessionTaps, setSessionTaps] = useState<Record<string, number>>({});
  const [pulse, setPulse] = useState(false);

  const activeItem = items.find(i => i.id === activeItemId) || items[0];

  const handleIncrement = (amount: number = 1) => {
    // Visual pulse
    setPulse(true);
    setTimeout(() => setPulse(false), 200);

    // Haptic feedback if supported on mobile
    if (navigator.vibrate) {
      try { navigator.vibrate(25); } catch {}
    }

    const updated = religiousFeaturesService.incrementTasbih(memorialId, activeItemId, amount);
    setItems(updated);
    setSessionTaps(prev => ({
      ...prev,
      [activeItemId]: (prev[activeItemId] || 0) + amount
    }));
    onActionComplete?.();
  };

  const totalCollectiveDhikr = items.reduce((acc, curr) => acc + curr.currentCount, 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>السبحة والاستغفار الجماعي لروح الفقيد</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-quran">
            أهدِ تسبيحة واستغفاراً لروح {deceasedName}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            كل ضغطة تُضاف مباشرة إلى الرصيد التراكمي وتُهدى ثواباً في صحيفة حسناته.
          </p>
        </div>

        {/* Total Grand Count Badge */}
        <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center shrink-0">
          <span className="block text-[11px] font-bold text-emerald-800">مجموع الأذكار المُهداة</span>
          <span className="text-2xl font-extrabold text-emerald-950 font-sans">
            {totalCollectiveDhikr.toLocaleString('ar-EG')}
          </span>
        </div>
      </div>

      {/* Dhikr Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItemId(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-700/50'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Tasbih Counter Board */}
      <div className="bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-50 rounded-3xl p-6 sm:p-8 border border-emerald-100 text-center space-y-6 relative overflow-hidden">
        
        {/* Active Dhikr Title and Virtue */}
        <div className="space-y-2 max-w-xl mx-auto">
          <h4 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-quran leading-normal">
            «{activeItem.title}»
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 font-normal italic">
            {activeItem.virtue}
          </p>
        </div>

        {/* Large Counter & Goal Progress */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
            <span>الهدف المشترك: {activeItem.targetCount.toLocaleString('ar-EG')}</span>
            <span className="text-emerald-900 font-sans font-bold">
              {Math.min(100, Math.round((activeItem.currentCount / activeItem.targetCount) * 100))}%
            </span>
          </div>

          <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (activeItem.currentCount / activeItem.targetCount) * 100)}%` }}
            ></div>
          </div>

          <div className="text-4xl sm:text-5xl font-black text-emerald-950 font-sans tracking-tight pt-2">
            {activeItem.currentCount.toLocaleString('ar-EG')}
          </div>
          <span className="text-xs text-stone-500 block">
            مرة مسجلة حتى الآن
          </span>
        </div>

        {/* The Big Tap Button */}
        <div className="pt-2 flex flex-col items-center justify-center">
          <button
            onClick={() => handleIncrement(1)}
            className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white shadow-xl hover:shadow-2xl border-4 border-amber-300/80 flex flex-col items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 ${
              pulse ? 'scale-105 ring-8 ring-emerald-300/50' : 'hover:scale-102'
            }`}
          >
            <Sparkles className="w-8 h-8 text-amber-300 mb-1 animate-pulse" />
            <span className="text-base sm:text-lg font-extrabold font-quran">
              سَبِّـحْ الآن
            </span>
            <span className="text-[11px] text-emerald-200 font-sans font-bold mt-0.5">
              +١ لروح الفقيد
            </span>
          </button>

          {/* Quick Increment Multipliers */}
          <div className="flex items-center gap-2.5 mt-5">
            {[10, 33, 100].map((num) => (
              <button
                key={num}
                onClick={() => handleIncrement(num)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold font-sans shadow-2xs transition-colors"
              >
                +{num} دفعة واحدة
              </button>
            ))}
          </div>

          {/* Session Contribution */}
          {sessionTaps[activeItemId] ? (
            <div className="text-xs text-emerald-900 font-bold mt-4 flex items-center gap-1.5 bg-emerald-100/80 px-3.5 py-1 rounded-full">
              <Check className="w-3.5 h-3.5 text-emerald-800" />
              <span>مساهمتك في هذه الجلسة: {sessionTaps[activeItemId]} تسبيحة أُهديت لـ {deceasedName}</span>
            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
};
