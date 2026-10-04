import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, User, Clock, Sparkles, Share2, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { QURAN_JUZ_LIST, KHATMAH_DUAA_TEXT } from '../data/quranJuzData';
import { religiousFeaturesService } from '../services/religiousFeaturesService';
import { KhatmahProgress, KhatmahJuzClaim } from '../types';

interface KhatmahTrackerProps {
  memorialId: string;
  deceasedName: string;
  onActionComplete?: () => void;
}

export const KhatmahTracker: React.FC<KhatmahTrackerProps> = ({ 
  memorialId, 
  deceasedName,
  onActionComplete
}) => {
  const [progress, setProgress] = useState<KhatmahProgress>(() => 
    religiousFeaturesService.getKhatmahProgress(memorialId)
  );

  const [selectedJuzNumber, setSelectedJuzNumber] = useState<number | null>(null);
  const [readerNameInput, setReaderNameInput] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDuaaModal, setShowDuaaModal] = useState(false);

  useEffect(() => {
    setProgress(religiousFeaturesService.getKhatmahProgress(memorialId));
  }, [memorialId]);

  const completedCount = Object.values(progress.claims).filter(c => c.isCompleted).length;
  const percentage = Math.round((completedCount / 30) * 100);

  const handleClaimOrComplete = (juzNumber: number) => {
    setSelectedJuzNumber(juzNumber);
    const existing = progress.claims[juzNumber];
    setReaderNameInput(existing?.readerName || '');
  };

  const handleConfirmClaim = () => {
    if (!selectedJuzNumber) return;
    const updated = religiousFeaturesService.claimJuz(memorialId, selectedJuzNumber, readerNameInput);
    setProgress({ ...updated });
    setSelectedJuzNumber(null);
    onActionComplete?.();
  };

  const handleConfirmComplete = () => {
    if (!selectedJuzNumber) return;
    const { progress: updated, justFinishedKhatmah } = religiousFeaturesService.completeJuz(
      memorialId, 
      selectedJuzNumber, 
      readerNameInput
    );
    setProgress({ ...updated });
    setSelectedJuzNumber(null);
    onActionComplete?.();

    if (justFinishedKhatmah) {
      setShowCelebration(true);
    }
  };

  const handleShareKhatmah = () => {
    const text = `انضم إلينا في ختم القرآن الكريم لروح فقيدنا: ${deceasedName}\nتم إنجاز ${completedCount} من أصل ٣٠ جزءاً (الختمة رقم ${progress.khatmahNumber}).\nاختر جزءاً وشارِكنا الأجر عبر الرابط: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
      
      {/* Header and Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
            <span>ختمة القرآن الجماعية لروح الفقيد</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>الختمة رقم ({progress.khatmahNumber})</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-quran">
            شارك في ختم القرآن الكريم ثواباً لـ {deceasedName}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            اختر أي جزء لم يُقرأ بعد لقراءته، واضغط لتأكيد القراءة ليُسجل في ميزان حسناته بإذن الله.
          </p>
        </div>

        {/* Khatmah stats badge */}
        <div className="flex items-center gap-3 shrink-0">
          {progress.totalCompletedKhatmahs > 0 && (
            <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-center">
              <span className="block text-xs font-bold text-amber-800">ختمات مكتملة</span>
              <span className="text-lg font-extrabold font-sans text-amber-900">
                {progress.totalCompletedKhatmahs} 🏆
              </span>
            </div>
          )}
          <button
            onClick={handleShareKhatmah}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>دعوة الأهل للختمة</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Counter */}
      <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-stone-700">
            تمت قراءة <strong className="text-emerald-800 font-sans text-sm">{completedCount}</strong> من أصل ٣٠ جزءاً
          </span>
          <span className="text-emerald-900 font-sans font-extrabold">{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span>مكتمل ({completedCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span>قيد القراءة ({Object.values(progress.claims).filter(c => !c.isCompleted && c.readerName).length})</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-300 inline-block"></span>
            <span>متاح للاختيار ({30 - Object.values(progress.claims).filter(c => c.isCompleted || c.readerName).length})</span>
          </span>
        </div>
      </div>

      {/* 30 Juz Visual Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
        {QURAN_JUZ_LIST.map((juz) => {
          const claim = progress.claims[juz.juzNumber];
          const isCompleted = claim?.isCompleted;
          const isClaimed = !isCompleted && Boolean(claim?.readerName);

          let bgClass = "bg-white hover:border-emerald-600 border-stone-200 text-stone-800";
          let badgeText = "متاح للقراءة";
          let badgeClass = "bg-stone-100 text-stone-600";

          if (isCompleted) {
            bgClass = "bg-emerald-50/90 border-emerald-400 text-emerald-950";
            badgeText = "تمت قراءته ✓";
            badgeClass = "bg-emerald-600 text-white";
          } else if (isClaimed) {
            bgClass = "bg-amber-50/90 border-amber-300 text-amber-950";
            badgeText = "قيد القراءة";
            badgeClass = "bg-amber-400 text-stone-900";
          }

          return (
            <button
              key={juz.juzNumber}
              onClick={() => handleClaimOrComplete(juz.juzNumber)}
              className={`p-3 rounded-2xl border text-right transition-all duration-200 hover:shadow-sm flex flex-col justify-between h-28 relative group cursor-pointer ${bgClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold font-sans px-1.5 py-0.5 rounded-md bg-stone-200/60 text-stone-800">
                    جزء {juz.juzNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${badgeClass}`}>
                    {badgeText}
                  </span>
                </div>
                <div className="font-quran text-xs sm:text-sm font-bold truncate text-stone-900">
                  {juz.name.replace(/الجزء (الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|الحادي|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العشرون|الثلاثون)[^]*/, '') || juz.name}
                </div>
                <div className="text-[10px] text-stone-500 truncate mt-0.5">
                  {juz.surahRange}
                </div>
              </div>

              {claim?.readerName && (
                <div className="text-[10px] text-stone-600 font-medium truncate flex items-center gap-1 border-t border-stone-200/50 pt-1">
                  <User className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                  <span className="truncate">{claim.readerName}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Button to view Khatmah Duaa */}
      <div className="text-center pt-2">
        <button
          onClick={() => setShowDuaaModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm border border-amber-300 transition-colors shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>عرض نص «دعاء ختم القرآن الكريم» كاملاً</span>
        </button>
      </div>

      {/* Modal to Claim / Complete a specific Juz */}
      {selectedJuzNumber && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {(() => {
              const currentJuz = QURAN_JUZ_LIST.find(j => j.juzNumber === selectedJuzNumber);
              const claim = progress.claims[selectedJuzNumber];
              const isCompleted = claim?.isCompleted;

              return (
                <>
                  <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-800">ختمة القرآن الكريم</span>
                      <h4 className="text-xl font-extrabold text-stone-900 font-quran">
                        {currentJuz?.name}
                      </h4>
                      <p className="text-xs text-stone-500">{currentJuz?.surahRange}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedJuzNumber(null)}
                      className="text-stone-400 hover:text-stone-700 p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1">
                    <span className="font-bold text-stone-900 block">بداية الجزء:</span>
                    <p className="font-quran text-sm text-emerald-950 font-bold leading-relaxed">
                      «{currentJuz?.startAyah}»
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-stone-800">
                      اسم القارئ أو فاعل الخير (اختياري):
                    </label>
                    <input
                      type="text"
                      value={readerNameInput}
                      onChange={(e) => setReaderNameInput(e.target.value)}
                      placeholder="مثال: ابن الفقيد / فاعل خير / أحمد محمود"
                      className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    {!isCompleted && (
                      <button
                        onClick={handleConfirmComplete}
                        className="flex-1 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>قرأتُه وأُهدي ثوابه للفقيد ✓</span>
                      </button>
                    )}

                    <button
                      onClick={handleConfirmClaim}
                      className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      <span>سأقرأه إن شاء الله (حجز)</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Khatmah Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center space-y-5 border-2 border-amber-400 shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-3xl shadow-inner">
              🏆
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">مبارك ومقبول بإذن الله</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-quran">
                تمت بحمد الله الختمة كاملة لروح {deceasedName}!
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                تقبل الله من كل من تلا حرفاً وشارك في هذا العمل المبارك، وجعل نوره في صحيفة حسنات فقيدنا ونوراً في قبره إلى يوم القيامة.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowCelebration(false);
                  setShowDuaaModal(true);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-colors shadow-sm"
              >
                قراءة دعاء الختم كاملاً
              </button>
              <button
                onClick={() => setShowCelebration(false)}
                className="py-3 px-6 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-colors"
              >
                إغلاق والبدء في الختمة التالية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Khatmah Duaa Modal */}
      {showDuaaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="text-xl font-extrabold text-stone-900 font-quran">
                  دعاء ختم القرآن الكريم
                </h4>
              </div>
              <button onClick={() => setShowDuaaModal(false)} className="text-stone-400 hover:text-stone-700 p-1">
                ✕
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 font-quran text-base sm:text-lg text-stone-800 leading-loose whitespace-pre-line text-justify">
              {KHATMAH_DUAA_TEXT}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowDuaaModal(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-colors"
              >
                اللهم آمين وتقبل منا
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
