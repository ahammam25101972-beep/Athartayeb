import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Bed, Heart, RotateCcw, Check, BookOpen } from 'lucide-react';
import { ADHKAR_LIST, DECEASED_DUAAS } from '../data/adhkarData';

export const AdhkarView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'sabah' | 'masaa' | 'nawm' | 'dead' | 'general'>('sabah');
  const [counts, setCounts] = useState<Record<string, number>>({});

  const handleIncrement = (id: string, max: number) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      if (current < max) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const handleReset = (id: string) => {
    setCounts(prev => ({ ...prev, [id]: 0 }));
  };

  const currentAdhkar = ADHKAR_LIST.filter(a => a.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>حصن المسلم والذكر المبارك</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-quran">
          الأذكار والتسبيح والأدعية
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          محتوى ديني موثوق من صحيح السنة النبوية الشريفة مع سبحة إلكترونية تفاعلية
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-stone-100 p-1.5 rounded-2xl max-w-2xl mx-auto">
        <button
          onClick={() => setActiveCategory('sabah')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'sabah'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span>أذكار الصباح</span>
        </button>

        <button
          onClick={() => setActiveCategory('masaa')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'masaa'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Moon className="w-4 h-4 text-indigo-500" />
          <span>أذكار المساء</span>
        </button>

        <button
          onClick={() => setActiveCategory('nawm')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'nawm'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Bed className="w-4 h-4 text-purple-500" />
          <span>أذكار النوم</span>
        </button>

        <button
          onClick={() => setActiveCategory('dead')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'dead'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Heart className="w-4 h-4 text-emerald-700" />
          <span>أدعية للمتوفى</span>
        </button>

        <button
          onClick={() => setActiveCategory('general')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
            activeCategory === 'general'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>تسبيح وذكر عام</span>
        </button>
      </div>

      {/* Content Section */}
      {activeCategory === 'dead' ? (
        /* Deceased Prophetic Prayers */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 text-center font-medium">
            أدعية مأثورة وصحيحة من السنة النبوية الشريفة يُستحب الدعاء بها للمتوفى في كل حين.
          </div>

          <div className="grid grid-cols-1 gap-4">
            {DECEASED_DUAAS.map((duaa) => (
              <div key={duaa.id} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 font-quran">{duaa.title}</h3>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    {duaa.source}
                  </span>
                </div>
                <p className="font-quran text-lg sm:text-xl text-stone-800 leading-loose">
                  «{duaa.text}»
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Interactive Adhkar Cards with Counters */
        <div className="space-y-4">
          {currentAdhkar.map((item) => {
            const currentCount = counts[item.id] || 0;
            const isCompleted = currentCount >= item.targetCount;

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-white border-stone-200 shadow-xs'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                  <span className="font-semibold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-md">
                    المصدر: {item.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-sans">التكرار المطلوب: {item.targetCount}</span>
                    {currentCount > 0 && (
                      <button
                        onClick={() => handleReset(item.id)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                        title="إعادة ضبط العداد"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Text */}
                <p className="font-quran text-lg sm:text-xl text-stone-900 leading-loose mb-3">
                  {item.text}
                </p>

                {/* Note / Virtue */}
                {item.translationOrNote && (
                  <p className="text-xs text-stone-500 mb-4 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    {item.translationOrNote}
                  </p>
                )}

                {/* Counter & Action */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 font-semibold">المتبقي:</span>
                    <span className="font-sans text-sm font-bold text-stone-800">
                      {Math.max(0, item.targetCount - currentCount)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleIncrement(item.id, item.targetCount)}
                    disabled={isCompleted}
                    className={`py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-700 text-white cursor-default'
                        : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="w-4 h-4 text-amber-300" />
                        <span>اكتمل بحمد الله</span>
                      </>
                    ) : (
                      <>
                        <span>تسبيح ({currentCount} / {item.targetCount})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
