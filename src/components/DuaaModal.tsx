import React, { useState } from 'react';
import { X, Heart, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { DECEASED_DUAAS } from '../data/adhkarData';
import { memorialService } from '../services/memorialService';
import { Prayer } from '../types';

interface DuaaModalProps {
  memorialId: string;
  deceasedName: string;
  isOpen: boolean;
  onClose: () => void;
  onPrayerAdded: (newPrayer: Prayer) => void;
}

export const DuaaModal: React.FC<DuaaModalProps> = ({
  memorialId,
  deceasedName,
  isOpen,
  onClose,
  onPrayerAdded
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [customDuaaText, setCustomDuaaText] = useState(DECEASED_DUAAS[0].text);
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setCustomDuaaText(DECEASED_DUAAS[index].text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDuaaText.trim()) {
      setErrorMsg('يرجى اختيار أو كتابة دعاء طيب');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const newPrayer = await memorialService.addPrayer(
        memorialId,
        authorName.trim() || 'محب للخير',
        customDuaaText.trim()
      );
      setSuccess(true);
      onPrayerAdded(newPrayer);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err: unknown) {
      console.error('Error adding prayer:', err);
      setErrorMsg('تعذر تسجيل الدعاء في الوقت الحالي، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center mb-3 border border-emerald-100 shadow-xs">
            <Heart className="w-6 h-6 fill-emerald-800/10 text-emerald-800" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-quran">
            الدعاء للمغفور له بإذن الله
          </h3>
          <p className="text-sm font-semibold text-emerald-800 mt-0.5">
            {deceasedName}
          </p>
          <div className="mt-2 p-2 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900">
            تنبيه: عداد التفاعلات هو لبيان مشاركة الزوار بالدعاء، ولا يُعد مقياساً لقبول الدعاء أو منزلة المتوفى عند الله سبحانه.
          </div>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-stone-900 font-quran">جزاك الله خيراً وتقبل دعاءك</h4>
            <p className="text-xs text-stone-500">تم تسجيل دعائك الطيب وإضافته لعداد الدعوات بالصفحة.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Quick Presets Carousel / List */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                اختر من الأدعية المأثورة الموثوقة أو اكتب دعاءك الخاص:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-stone-200 rounded-2xl bg-stone-50">
                {DECEASED_DUAAS.map((duaa, idx) => (
                  <button
                    type="button"
                    key={duaa.id}
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-2.5 rounded-xl text-right text-xs transition-all border ${
                      selectedPresetIndex === idx
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <p className="font-bold line-clamp-1 mb-1">{duaa.title}</p>
                    <p className={`text-[11px] line-clamp-2 ${selectedPresetIndex === idx ? 'text-amber-200' : 'text-stone-500'}`}>
                      {duaa.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prayer Text */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                نص الدعاء:
              </label>
              <textarea
                rows={4}
                value={customDuaaText}
                onChange={(e) => {
                  setCustomDuaaText(e.target.value);
                  setSelectedPresetIndex(null);
                }}
                maxLength={800}
                required
                className="w-full p-3.5 rounded-2xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-sm leading-relaxed resize-none font-quran text-stone-800"
                placeholder="اكتب دعاءك الصادق للمتوفى..."
              />
              <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                <span>أدعية الرحمة والمغفرة والتثبيت</span>
                <span>{customDuaaText.length} / 800</span>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                اسم الداعي (اختياري):
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={60}
                placeholder="مثال: فاعل خير، أو قريب، أو صديق..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-sm"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جاري تسجيل الدعاء...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300 -rotate-90" />
                    <span>إرسال الدعاء والمشاركة</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
