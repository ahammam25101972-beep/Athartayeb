import React, { useState } from 'react';
import { Heart, Plus, CheckCircle, Award, Sparkles, Check, Bookmark } from 'lucide-react';
import { religiousFeaturesService } from '../services/religiousFeaturesService';
import { LegacyDeed } from '../types';

interface LivingLegacyProps {
  memorialId: string;
  deceasedName: string;
  onActionComplete?: () => void;
}

export const LivingLegacy: React.FC<LivingLegacyProps> = ({
  memorialId,
  deceasedName,
  onActionComplete
}) => {
  const [deeds, setDeeds] = useState<LegacyDeed[]>(() => 
    religiousFeaturesService.getLegacyDeeds(memorialId)
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'charity' | 'kindness' | 'worship' | 'family'>('charity');
  const [userDoneIds, setUserDoneIds] = useState<string[]>([]);

  const handlePracticeDeed = (deedId: string) => {
    if (userDoneIds.includes(deedId)) return;
    const updated = religiousFeaturesService.recordDeedPractice(memorialId, deedId);
    setDeeds(updated);
    setUserDoneIds(prev => [...prev, deedId]);
    onActionComplete?.();
  };

  const handleAddCustomDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const updated = religiousFeaturesService.addCustomLegacyDeed(
      memorialId,
      newTitle,
      newDesc,
      newCategory
    );
    setDeeds(updated);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const totalDeedsDone = deeds.reduce((acc, curr) => acc + curr.completedCount, 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5 text-emerald-800" />
            <span>سجل أثر الفقيد ووصاياه وأعمال البر</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-quran">
            أعمال وأخلاق كان يحبها {deceasedName}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            اقتدِ بأثره الصالح واعمل بعمل كان يحبه ليكون صدقة جارية ونوراً في ميزان حسناته وحسناتك.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="block text-[11px] font-bold text-amber-800">أعمال صالحة أُنجزت</span>
            <span className="text-xl font-extrabold text-amber-950 font-sans">{totalDeedsDone}</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة وصية أو خُلق</span>
          </button>
        </div>
      </div>

      {/* Deeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deeds.map((deed) => {
          const isDone = userDoneIds.includes(deed.id);

          return (
            <div
              key={deed.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isDone 
                  ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs' 
                  : 'bg-stone-50/60 hover:bg-white border-stone-200 hover:border-emerald-200'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-stone-900 font-quran flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{deed.title}</span>
                  </h4>
                  <span className="text-[11px] font-sans font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                    أُنجز {deed.completedCount} مرة
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {deed.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/50 flex justify-end">
                <button
                  onClick={() => handlePracticeDeed(deed.id)}
                  disabled={isDone}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isDone
                      ? 'bg-emerald-700 text-white cursor-default'
                      : 'bg-white hover:bg-emerald-800 hover:text-white text-emerald-900 border border-emerald-300 shadow-2xs'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>عملتُ به اليوم برّاً به ✓</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3.5 h-3.5 text-amber-600" />
                      <span>عملتُ به اليوم برّاً بفقيدنا</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Legacy Deed Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-lg font-extrabold text-stone-900 font-quran">
                إضافة عمل أو خُلق كان يحبه الفقيد
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomDeed} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  عنوان العمل أو الخُلق:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: كان يحرص على تفقد جيرانه الضعفاء"
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  الوصف أو القصة والتوجيه:
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="اكتب كيف يمكن للمحبين الاقتداء به في هذا الأمر..."
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-700 outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  حفظ في سجل أثر الفقيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
