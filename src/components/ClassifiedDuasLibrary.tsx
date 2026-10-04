import React, { useState } from 'react';
import { BookOpen, Copy, Check, Share2, Heart, Sparkles, Filter } from 'lucide-react';
import { CLASSIFIED_DUAS } from '../data/classifiedDuasData';
import { ClassifiedDuaa } from '../types';

interface ClassifiedDuasLibraryProps {
  deceasedName: string;
  onSendDuaa?: (duaaText: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'كافة الأدعية' },
  { id: 'father', label: 'للأب المتوفى' },
  { id: 'mother', label: 'للأم المتوفاة' },
  { id: 'children', label: 'للأبناء والشباب' },
  { id: 'general', label: 'أدعية نبوية جامعة' },
  { id: 'graves', label: 'زيارة المقابر' },
  { id: 'virtues', label: 'ما ينفع الميت' }
];

export const ClassifiedDuasLibrary: React.FC<ClassifiedDuasLibraryProps> = ({ 
  deceasedName,
  onSendDuaa 
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dedicatedIds, setDedicatedIds] = useState<string[]>([]);

  const filteredDuas = activeCategory === 'all'
    ? CLASSIFIED_DUAS
    : CLASSIFIED_DUAS.filter(d => d.category === activeCategory);

  const handleCopy = (duaa: ClassifiedDuaa) => {
    navigator.clipboard.writeText(`${duaa.title}\n${duaa.text}\nالمصدر: ${duaa.source}`);
    setCopiedId(duaa.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDedicate = (duaa: ClassifiedDuaa) => {
    if (dedicatedIds.includes(duaa.id)) return;
    setDedicatedIds(prev => [...prev, duaa.id]);
    onSendDuaa?.(duaa.text);
  };

  const handleShareWhatsApp = (duaa: ClassifiedDuaa) => {
    const text = `دعاء مبارك لروح: ${deceasedName}\n\n«${duaa.text}»\n\nالمصدر: ${duaa.source}\nمنصة أثر طيب: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
          <span>موسوعة الأدعية المأثورة والسنن النبوية</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-quran">
          أدعية صحيحة مأثورة تُهدى لروح {deceasedName}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          أدعية محققة من الكتاب وصحيح السنة مصنفة بعناية، يمكنك قراءتها أو إهداؤها فوراً لصحيفة حسناته.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-700/50'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Duas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuas.map((duaa) => {
          const isCopied = copiedId === duaa.id;
          const isDedicated = dedicatedIds.includes(duaa.id);

          return (
            <div
              key={duaa.id}
              className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-900">
                    {duaa.categoryLabel}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {duaa.source}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-stone-900 font-quran">
                  {duaa.title}
                </h4>

                <p className="font-quran text-stone-800 text-sm sm:text-base leading-loose text-justify p-3 bg-white rounded-xl border border-stone-100 shadow-2xs">
                  {duaa.text}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDedicate(duaa)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isDedicated
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isDedicated ? 'text-white fill-current' : 'text-emerald-700'}`} />
                  <span>{isDedicated ? 'أُهديَ لروحه ✓' : 'أهْدِ هذا الدعاء للفقيد'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(duaa)}
                    title="نسخ الدعاء"
                    className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 transition-colors shadow-2xs"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleShareWhatsApp(duaa)}
                    title="مشاركة عبر واتساب"
                    className="p-2 rounded-xl bg-white hover:bg-stone-100 text-emerald-700 border border-stone-200 transition-colors shadow-2xs"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
