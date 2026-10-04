import React, { useEffect, useState } from 'react';
import { Search, Heart, Eye, Calendar, Sparkles, Filter, X } from 'lucide-react';
import { Memorial } from '../types';
import { memorialService } from '../services/memorialService';
import { MemorialCard } from '../components/MemorialCard';
import { ShareModal } from '../components/ShareModal';

export const SearchView: React.FC<{
  initialQuery?: string;
  onNavigate: (view: string, id?: string) => void;
}> = ({ initialQuery = '', onNavigate }) => {
  const [queryText, setQueryText] = useState(initialQuery);
  const [allMemorials, setAllMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareMemorial, setShareMemorial] = useState<Memorial | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await memorialService.getPublishedMemorials();
        setAllMemorials(data);
      } catch (e) {
        console.error('Error fetching memorials for search:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = allMemorials.filter(m => {
    const q = queryText.trim().toLowerCase();
    if (!q) return true;
    return (
      m.deceasedName.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      (m.summary && m.summary.toLowerCase().includes(q)) ||
      (m.cityOrCountry && m.cityOrCountry.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-quran">
          البحث في الصفحات التذكارية
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          ابحث باسم المتوفى أو معرّف الصفحة للوصول والدعاء له
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto">
        <div className="relative shadow-sm">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="اكتب اسم المتوفى، أو المدينة، أو معرّف الصفحة..."
            className="w-full py-4 pr-12 pl-12 rounded-2xl bg-white border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition-all placeholder:text-stone-400"
            autoFocus
          />
          <Search className="w-5 h-5 text-stone-400 absolute right-4 top-4 pointer-events-none" />
          {queryText && (
            <button
              onClick={() => setQueryText('')}
              className="absolute left-4 top-4 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 text-xs text-stone-500 font-medium">
        <span>نتائج البحث: ({filtered.length} صفحة تذكارية)</span>
        {queryText && <span>الكلمة المبحوث عنها: "{queryText}"</span>}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-stone-200 rounded-3xl"></div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <MemorialCard
              key={m.id}
              memorial={m}
              onOpen={(id) => onNavigate('memorial', id)}
              onShare={(mem, e) => {
                e.stopPropagation();
                setShareMemorial(mem);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
          <Search className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800 font-quran">لم يتم العثور على نتائج مطابقة</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            تأكد من كتابة الاسم بصورة صحيحة أو جرب البحث بجزء من الاسم.
          </p>
          <button
            onClick={() => onNavigate('create')}
            className="mt-3 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-700"
          >
            أنشئ صفحة جديدة لفقيدك الآن
          </button>
        </div>
      )}

      {shareMemorial && (
        <ShareModal
          memorial={shareMemorial}
          isOpen={!!shareMemorial}
          onClose={() => setShareMemorial(null)}
        />
      )}

    </div>
  );
};
