import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, HeartHandshake, Eye, Volume2 } from 'lucide-react';
import { FEATURED_SURAHS, SURAH_INDEX } from '../data/quranData';

export const QuranView: React.FC<{ onNavigate: (view: string, id?: string) => void }> = ({ onNavigate }) => {
  const [selectedSurahIndex, setSelectedSurahIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [searchSurah, setSearchSurah] = useState('');

  const currentSurah = FEATURED_SURAHS[selectedSurahIndex];

  const fontClasses = {
    normal: 'text-lg leading-loose',
    large: 'text-2xl leading-[2.6]',
    xlarge: 'text-3xl leading-[3]'
  };

  const filteredSurahs = FEATURED_SURAHS.filter(s => 
    s.name.includes(searchSurah) || s.englishName.toLowerCase().includes(searchSurah.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>كتاب الله المبارك</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-quran">
          القرآن الكريم للقراءة والذكر
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          اقرأ ما تيسر من آيات الذكر الحكيم بنية الأجر والثواب لموتانا وموتى المسلمين، نسأل الله أن يجعله نوراً وضياءً في قبورهم.
        </p>
      </div>

      {/* Surah Selector & Controls Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quick Filter */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchSurah}
              onChange={(e) => setSearchSurah(e.target.value)}
              placeholder="ابحث عن السورة..."
              className="w-full pr-9 pl-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold text-stone-600">
            <span>حجم الخط:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 rounded-lg border ${fontSize === 'normal' ? 'bg-emerald-800 text-white border-emerald-900' : 'bg-stone-50 border-stone-300'}`}
            >
              عادي
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 rounded-lg border ${fontSize === 'large' ? 'bg-emerald-800 text-white border-emerald-900' : 'bg-stone-50 border-stone-300'}`}
            >
              كبير
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2.5 py-1 rounded-lg border ${fontSize === 'xlarge' ? 'bg-emerald-800 text-white border-emerald-900' : 'bg-stone-50 border-stone-300'}`}
            >
              كبير جداً
            </button>
          </div>
        </div>

        {/* Buttons List */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          {filteredSurahs.map((surah) => {
            const originalIndex = FEATURED_SURAHS.findIndex(s => s.number === surah.number);
            const isSelected = selectedSurahIndex === originalIndex;
            return (
              <button
                key={surah.number}
                onClick={() => setSelectedSurahIndex(originalIndex)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {surah.name} ({surah.revelationType})
              </button>
            );
          })}
        </div>

      </div>

      {/* Surah Recitation Card */}
      {currentSurah ? (
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200 shadow-sm text-center space-y-8 relative overflow-hidden">
          
          {/* Islamic Frame Top Header */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
              {currentSurah.revelationType} • {currentSurah.ayahsCount} آيات
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-quran pt-1">
              {currentSurah.name}
            </h2>
            {currentSurah.virtue && (
              <p className="text-xs text-amber-900 font-medium">
                {currentSurah.virtue}
              </p>
            )}
          </div>

          {/* Basmalah (unless Al-Fatihah, which already starts with it) */}
          {currentSurah.number !== 1 && currentSurah.number !== 255 && (
            <div className="text-center font-quran text-2xl sm:text-3xl text-stone-800 py-2">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}

          {/* Ayahs Flow */}
          <div className={`font-quran ${fontClasses[fontSize]} text-stone-800 text-justify sm:text-center max-w-3xl mx-auto space-y-4`}>
            {currentSurah.verses.map((ayah) => (
              <span key={ayah.number} className="inline">
                {ayah.text}{' '}
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs text-amber-700 border border-amber-300 font-sans mx-1 font-bold">
                  {ayah.number}
                </span>{' '}
              </span>
            ))}
          </div>

          {/* Sincere Intention Note */}
          <div className="pt-8 border-t border-stone-100 text-xs text-stone-500 max-w-md mx-auto space-y-1">
            <p className="font-semibold text-stone-700">اللهم اجعل ثواب ما قرأنا نوراً لجميع موتى المسلمين</p>
            <p>قال رسول الله ﷺ: «مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالحَسَنَةُ بِعَشْرِ أَمْثَالِهَا».</p>
          </div>

        </div>
      ) : null}

      {/* Complete Index Reference */}
      <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200">
        <h3 className="text-base font-bold text-stone-900 font-quran mb-3">
          فهرس السور القرآنية
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {SURAH_INDEX.map((s) => (
            <div key={s.number} className="p-2.5 rounded-xl bg-white border border-stone-200 text-center text-xs">
              <span className="text-[10px] text-stone-400 font-sans block">{s.number}</span>
              <span className="font-bold text-stone-800 block mt-0.5">{s.name}</span>
              <span className="text-[10px] text-emerald-800 block">{s.ayahsCount} آية</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
