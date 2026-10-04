import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Calendar, 
  MapPin, 
  Eye, 
  Heart, 
  Share2, 
  BookOpen, 
  Sparkles, 
  HeartHandshake, 
  AlertTriangle, 
  Edit, 
  Check, 
  Copy, 
  Download, 
  MessageCircle, 
  EyeOff, 
  Send, 
  Volume2, 
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Globe,
  Upload,
  Camera,
  Edit3
} from 'lucide-react';
import { compressImage } from '../lib/imageCompressor';
import { Memorial, Prayer, CharityProject } from '../types';
import { memorialService, cleanDeceasedName } from '../services/memorialService';
import { useAuth } from '../context/AuthContext';
import { DuaaModal } from '../components/DuaaModal';
import { ShareModal } from '../components/ShareModal';
import { ReportModal } from '../components/ReportModal';
import { FEATURED_SURAHS } from '../data/quranData';
import { ADHKAR_LIST } from '../data/adhkarData';
import { DedicatedQrSection } from '../components/DedicatedQrSection';
import { KhatmahTracker } from '../components/KhatmahTracker';
import { CollectiveTasbih } from '../components/CollectiveTasbih';
import { BlessingCardGenerator } from '../components/BlessingCardGenerator';
import { LivingLegacy } from '../components/LivingLegacy';
import { ClassifiedDuasLibrary } from '../components/ClassifiedDuasLibrary';
import { VirtueTreeBlossom } from '../components/VirtueTreeBlossom';
import { religiousFeaturesService } from '../services/religiousFeaturesService';

interface MemorialDetailViewProps {
  memorialId: string;
  onNavigate: (view: string, id?: string) => void;
}

export const MemorialDetailView: React.FC<MemorialDetailViewProps> = ({ memorialId, onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  type TabType = 'overview' | 'khatmah' | 'tasbih' | 'duas_library' | 'card_generator' | 'legacy' | 'prayers' | 'quran' | 'adhkar' | 'charity';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [virtueTick, setVirtueTick] = useState(0);

  // Modals
  const [showDuaaModal, setShowDuaaModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Embedded Adhkar Counters
  const [dhikrCounts, setDhikrCounts] = useState<Record<string, number>>({});

  // Quick Surah reader
  const [selectedSurahIndex, setSelectedSurahIndex] = useState(0);

  // Gallery viewer
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function loadMemorial() {
      try {
        setLoading(true);
        const data = await memorialService.getMemorialById(memorialId);
        if (data) {
          const cleanedMemorial = {
            ...data,
            deceasedName: cleanDeceasedName(data.deceasedName)
          };
          setMemorial(cleanedMemorial);
          // Set dynamic page title
          document.title = `صدقة جارية عن روح ${cleanedMemorial.deceasedName} | أثر طيب`;
          // Increment visit count once per mount
          memorialService.incrementVisit(memorialId);
        }
        const prayersList = await memorialService.getPrayers(memorialId);
        setPrayers(prayersList);
      } catch (err) {
        console.error('Error fetching memorial:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMemorial();
  }, [memorialId]);

  const isOwner = user && memorial && user.uid === memorial.userId;
  const canModerate = isOwner || isAdmin;

  const handleTogglePrayerHide = async (prayerId: string, currentHidden: boolean) => {
    try {
      await memorialService.togglePrayerVisibility(memorialId, prayerId, !currentHidden);
      setPrayers(prayers.map(p => p.id === prayerId ? { ...p, isHidden: !currentHidden } : p));
    } catch (e) {
      console.error('Failed to toggle prayer visibility:', e);
    }
  };

  const handleDuaaAdded = (newPrayer: Prayer) => {
    setPrayers([newPrayer, ...prayers]);
    if (memorial) {
      setMemorial({ ...memorial, prayerCount: (memorial.prayerCount || 0) + 1 });
      setVirtueTick(t => t + 1);
    }
  };

  const handleSendClassifiedDuaa = async (duaaText: string) => {
    if (!memorial) return;
    try {
      const newPrayer = await memorialService.addPrayer(
        memorial.id,
        'محب للفقيد',
        duaaText
      );
      handleDuaaAdded(newPrayer);
    } catch (e) {
      console.error(e);
    }
  };

  const handleIncrementDhikr = (id: string, target: number) => {
    setDhikrCounts(prev => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current + 1 };
    });
  };

  const handleDirectPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !memorial) return;
    try {
      const compressed = await compressImage(file);
      await memorialService.updateMemorial(memorial.id, { photoUrl: compressed });
      setMemorial({ ...memorial, photoUrl: compressed });
      alert('تم تحديث صورة الفقيد بنجاح!');
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء رفع الصورة');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="w-24 h-24 rounded-full bg-stone-200 mx-auto"></div>
        <div className="h-8 w-64 bg-stone-200 rounded-xl mx-auto"></div>
        <div className="h-4 w-96 bg-stone-200 rounded-lg mx-auto"></div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-white rounded-3xl border border-stone-200 mt-10 shadow-xs">
        <HeartHandshake className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-stone-900 font-quran">الصفحة غير موجودة</h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 mb-6">
          ربما تم نقل الصفحة أو حذفها، أو أن الرابط غير صحيح.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-700"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  if (memorial.isSuspended && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-white rounded-3xl border border-amber-200 mt-10 shadow-xs">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-stone-900 font-quran">الصفحة قيد المراجعة</h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 mb-6">
          تم إيقاف هذه الصفحة مؤقتاً لمراجعة محتواها من قبل فريق الإشراف.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-stone-800 text-white font-medium text-xs"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const khatmahProgress = religiousFeaturesService.getKhatmahProgress(memorial.id);
  const completedJuzCount = khatmahProgress.completedCount + (khatmahProgress.totalCompletedKhatmahs * 30);
  const tasbihItems = religiousFeaturesService.getTasbihItems(memorial.id);
  const totalTasbihCount = tasbihItems.reduce((acc, curr) => acc + curr.currentCount, 0);
  const totalVirtueScore = religiousFeaturesService.getTotalVirtueScore(memorial.id, memorial.prayerCount || 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Main Memorial Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden relative">
        
        {/* Banner Top Strip */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Action buttons on header (Owner Edit & Report) */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            {isOwner && (
              <button
                onClick={() => onNavigate('create', memorial.id)}
                className="px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-stone-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-emerald-800" />
                <span>تعديل الصفحة</span>
              </button>
            )}
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white text-xs transition-colors"
              title="إبلاغ عن محتوى"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Avatar / Photo */}
        <div className="px-6 sm:px-10 pb-8 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-right">
          
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-stone-900 shrink-0 relative group">
              {memorial.photoUrl ? (
                <img 
                  src={memorial.photoUrl} 
                  alt={memorial.deceasedName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center text-amber-300 p-2">
                  <BookOpen className="w-12 h-12 mb-1 opacity-80" />
                  <span className="text-[10px] font-quran text-stone-300">أثر طيب</span>
                </div>
              )}

              {/* Hover overlay to change/upload photo */}
              <label className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer transition-opacity backdrop-blur-2xs p-2 text-center">
                <Camera className="w-6 h-6 mb-1 text-amber-300" />
                <span>تغيير الصورة</span>
                <span className="text-[10px] text-stone-300">رفع من جهازك</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleDirectPhotoUpload} 
                />
              </label>
            </div>

            {/* Quick upload button under photo */}
            <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 hover:bg-white border border-stone-200 hover:border-emerald-600 text-stone-700 hover:text-emerald-800 text-[11px] font-semibold cursor-pointer shadow-2xs transition-colors mt-2">
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              <span>تغيير الصورة من جهازك</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleDirectPhotoUpload} 
              />
            </label>
          </div>

          {/* Name & Dates */}
          <div className="flex-1 space-y-1.5">
            <span className="text-xs sm:text-sm font-semibold text-emerald-800 font-quran bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
              {memorial.titlePrefix || 'المغفور له بإذن الله'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-quran tracking-tight">
              {memorial.deceasedName}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-xs text-stone-500 pt-1">
              {memorial.dateOfDeath && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>توفي بتاريخ: {memorial.dateOfDeath}</span>
                  {memorial.hijriDate && <span>({memorial.hijriDate})</span>}
                </div>
              )}
              {memorial.cityOrCountry && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{memorial.cityOrCountry}</span>
                </div>
              )}
            </div>

            {/* Registered Domain Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs mt-1 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-mono font-bold" dir="ltr">
                {memorial.customDomain || `www.${memorial.id}-4digital.net`}
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                دومين خاص (السعر ٢٠٠ ج)
              </span>
            </div>
          </div>

          {/* Counters (Visits & Prayers) */}
          <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="block text-xl font-bold text-emerald-900 font-sans">
                {memorial.prayerCount || 0}
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 fill-emerald-800" />
                دعوة
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="block text-xl font-bold text-stone-800 font-sans">
                {memorial.visitCount || 0}
              </span>
              <span className="text-[11px] font-medium text-stone-500 flex items-center justify-center gap-1">
                <Eye className="w-3 h-3 text-stone-400" />
                زيارة
              </span>
            </div>
          </div>

        </div>

        {/* Counter Disclaimer Note (Required in brief) */}
        <div className="mx-6 sm:mx-10 mb-6 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-center text-[11px] text-amber-900">
          تنبيه وقور: عدد الدعوات والزيارات يعبر عن تفاعل ومشاركة الأحبة بالدعاء والذكر، ولا يعد مقياساً لقبول الدعاء أو منزلة المتوفى عند الله سبحانه وتعالى.
        </div>

        {/* Highlighted Prayer Box */}
        {memorial.customDuaa && (
          <div className="mx-6 sm:mx-10 mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-stone-900 text-white text-center relative overflow-hidden shadow-sm">
            <span className="text-xs text-amber-300 font-bold block mb-2 font-quran">
              دعاء مأثور للمتوفى
            </span>
            <p className="font-quran text-lg sm:text-xl leading-relaxed text-stone-100 max-w-2xl mx-auto">
              «{memorial.customDuaa}»
            </p>
          </div>
        )}

        {/* 6 Primary Clear Action Buttons (Spiritual & Memorial) */}
        <div className="px-6 sm:px-10 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 sm:gap-3">
            
            {/* 1. "ادعُ له" Button */}
            <button
              onClick={() => setShowDuaaModal(true)}
              className="py-3 px-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>ادعُ له</span>
            </button>

            {/* 2. "ختمة القرآن" Button */}
            <button
              onClick={() => setActiveTab('khatmah')}
              className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'khatmah'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>ختمة القرآن</span>
            </button>

            {/* 3. "السبحة الجماعية" Button */}
            <button
              onClick={() => setActiveTab('tasbih')}
              className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tasbih'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>السبحة</span>
            </button>

            {/* 4. "بطاقة دعاء" Button */}
            <button
              onClick={() => setActiveTab('card_generator')}
              className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'card_generator'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <span>بطاقة دعاء</span>
            </button>

            {/* 5. "تعديل الصفحة" Button */}
            <button
              onClick={() => onNavigate('create', memorial.id)}
              className="py-3 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-emerald-700" />
              <span>تعديل</span>
            </button>

            {/* 6. "شارك واطبع QR" Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="col-span-2 sm:col-span-1 py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة وQR</span>
            </button>

          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="border-t border-stone-200 bg-stone-50 px-4 sm:px-6 flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'overview'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            النبذة والأثر
          </button>

          <button
            onClick={() => setActiveTab('khatmah')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'khatmah'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ختمة القرآن</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
              ٣٠ جزء
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tasbih')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'tasbih'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>السبحة والاستغفار</span>
          </button>

          <button
            onClick={() => setActiveTab('duas_library')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'duas_library'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            موسوعة الأدعية
          </button>

          <button
            onClick={() => setActiveTab('card_generator')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'card_generator'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            تصميم بطاقة دعاء
          </button>

          <button
            onClick={() => setActiveTab('legacy')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'legacy'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            سجل وصايا وأثر الفقيد
          </button>

          <button
            onClick={() => setActiveTab('prayers')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'prayers'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>دعوات الزوار</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-sans">
              {prayers.filter(p => !p.isHidden).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quran')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'quran'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            قراءة السور
          </button>

          <button
            onClick={() => setActiveTab('adhkar')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'adhkar'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            الأذكار
          </button>

          <button
            onClick={() => setActiveTab('charity')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 ${
              activeTab === 'charity'
                ? 'border-emerald-800 text-emerald-800 font-extrabold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            الصدقات الجارية ({memorial.charityProjects?.length || 0})
          </button>
        </div>

      </div>

      {/* TAB 1: OVERVIEW & BIOGRAPHY */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* 1. Virtue Tree Blossom (شجرة الأثر الطيب) */}
          <VirtueTreeBlossom
            deceasedName={memorial.deceasedName}
            totalScore={totalVirtueScore}
            prayerCount={memorial.prayerCount || 0}
            completedJuzCount={completedJuzCount}
            totalTasbihCount={totalTasbihCount}
          />

          {/* 2. Dedicated QR Code Section (مكان رمز QR المباشر الواضح) */}
          <DedicatedQrSection 
            memorial={memorial}
            onOpenShareModal={() => setShowShareModal(true)}
          />

          {/* 3. Quick Spiritual Actions Hub */}
          <div className="bg-gradient-to-r from-emerald-50 via-white to-amber-50 rounded-3xl p-6 border border-emerald-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-stone-900 text-sm font-quran">
                  أبواب الخير والصدقة الجارية لروح الفقيد:
                </h4>
              </div>
              <span className="text-xs text-emerald-800 font-bold">اختر عملاً للمشاركة</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <button
                onClick={() => setActiveTab('khatmah')}
                className="p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-right transition-colors cursor-pointer space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1 rounded font-bold font-sans">
                    {completedJuzCount}/30
                  </span>
                </div>
                <div className="font-bold text-xs text-stone-900 font-quran">ختمة القرآن</div>
                <div className="text-[10px] text-stone-500">شارك بقراءة جزء</div>
              </button>

              <button
                onClick={() => setActiveTab('tasbih')}
                className="p-3 rounded-2xl bg-white hover:bg-amber-50 border border-amber-200 text-right transition-colors cursor-pointer space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1 rounded font-bold font-sans">
                    {totalTasbihCount.toLocaleString('ar-EG')}
                  </span>
                </div>
                <div className="font-bold text-xs text-stone-900 font-quran">السبحة الجماعية</div>
                <div className="text-[10px] text-stone-500">أهدِ تسبيحة فورية</div>
              </button>

              <button
                onClick={() => setActiveTab('duas_library')}
                className="p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-right transition-colors cursor-pointer space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-1 rounded font-bold">محققة</span>
                </div>
                <div className="font-bold text-xs text-stone-900 font-quran">موسوعة الأدعية</div>
                <div className="text-[10px] text-stone-500">أدعية صحيحة مصنفة</div>
              </button>

              <button
                onClick={() => setActiveTab('card_generator')}
                className="p-3 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-right transition-colors cursor-pointer space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1 rounded font-bold">صورة</span>
                </div>
                <div className="font-bold text-xs text-stone-900 font-quran">بطاقة دعاء</div>
                <div className="text-[10px] text-stone-500">للواتساب وفيسبوك</div>
              </button>

              <button
                onClick={() => setActiveTab('legacy')}
                className="p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-right transition-colors cursor-pointer space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Heart className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1 rounded font-bold">أثر</span>
                </div>
                <div className="font-bold text-xs text-stone-900 font-quran">سجل الوصايا</div>
                <div className="text-[10px] text-stone-500">أعمال كان يحبها</div>
              </button>
            </div>
          </div>
          
          {/* Summary / Bio */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-stone-900 font-quran flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>سيرة ومناقب الفقيد</span>
            </h3>
            <p className="text-stone-700 text-sm sm:text-base leading-loose whitespace-pre-line font-normal">
              {memorial.summary || 'رحم الله الفقيد وأسكنه فسيح جناته وألهم أهله وذويه الصبر والسلوان. نسألكم الدعاء له بالمغفرة والرحمة وقراءة ما تيسر من كتاب الله تعالى.'}
            </p>
          </div>

          {/* Additional Gallery Images */}
          {memorial.galleryImages && memorial.galleryImages.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-stone-900 font-quran flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-700" />
                <span>صور وذكريات طيبة</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {memorial.galleryImages.map((imgUrl, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="h-32 sm:h-40 rounded-2xl overflow-hidden border border-stone-200 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img src={imgUrl} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Charity Showcase in Overview */}
          {memorial.charityProjects && memorial.charityProjects.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900 font-quran flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-amber-600" />
                  <span>أعمال الخير والصدقة الجارية المرتبطة</span>
                </h3>
                <button
                  onClick={() => setActiveTab('charity')}
                  className="text-xs text-emerald-800 font-semibold hover:underline"
                >
                  عرض التفاصيل
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memorial.charityProjects.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      {p.organizationName}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">{p.title}</h4>
                    {p.description && <p className="text-xs text-stone-600 line-clamp-2">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB: KHATMAH TRACKER (ختمة القرآن ٣٠ جزء) */}
      {activeTab === 'khatmah' && (
        <div className="animate-in fade-in duration-200">
          <KhatmahTracker 
            memorialId={memorial.id}
            deceasedName={memorial.deceasedName}
            onActionComplete={() => setVirtueTick(t => t + 1)}
          />
        </div>
      )}

      {/* TAB: COLLECTIVE TASBIH (السبحة والاستغفار الجماعي) */}
      {activeTab === 'tasbih' && (
        <div className="animate-in fade-in duration-200">
          <CollectiveTasbih 
            memorialId={memorial.id}
            deceasedName={memorial.deceasedName}
            onActionComplete={() => setVirtueTick(t => t + 1)}
          />
        </div>
      )}

      {/* TAB: CLASSIFIED DUAS LIBRARY (موسوعة الأدعية المأثورة) */}
      {activeTab === 'duas_library' && (
        <div className="animate-in fade-in duration-200">
          <ClassifiedDuasLibrary 
            deceasedName={memorial.deceasedName}
            onSendDuaa={handleSendClassifiedDuaa}
          />
        </div>
      )}

      {/* TAB: BLESSING CARD GENERATOR (تصميم بطاقة دعاء) */}
      {activeTab === 'card_generator' && (
        <div className="animate-in fade-in duration-200">
          <BlessingCardGenerator 
            memorial={memorial}
          />
        </div>
      )}

      {/* TAB: LIVING LEGACY DEEDS (سجل وصايا وأثر الفقيد) */}
      {activeTab === 'legacy' && (
        <div className="animate-in fade-in duration-200">
          <LivingLegacy 
            memorialId={memorial.id}
            deceasedName={memorial.deceasedName}
            onActionComplete={() => setVirtueTick(t => t + 1)}
          />
        </div>
      )}

      {/* TAB 2: PRAYERS SECTION (قسم الدعوات) */}
      {activeTab === 'prayers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header & Add Button */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-quran">
                دعوات وأدعية الزوار والمحبين
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                اكتب دعاءً للمتوفى ليظهر في هذه الصفحة المباركة
              </p>
            </div>

            <button
              onClick={() => setShowDuaaModal(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Heart className="w-4 h-4 text-amber-300" />
              <span>إضافة دعاء الآن</span>
            </button>
          </div>

          {/* Prayers List */}
          {prayers.length > 0 ? (
            <div className="space-y-3">
              {prayers.map((prayer) => {
                if (prayer.isHidden && !canModerate) return null;

                return (
                  <div 
                    key={prayer.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      prayer.isHidden 
                        ? 'bg-stone-100 border-dashed border-stone-300 opacity-60' 
                        : 'bg-white border-stone-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                          {prayer.authorName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-stone-800">{prayer.authorName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-stone-400">
                        <span>{new Date(prayer.createdAt).toLocaleDateString('ar-SA')}</span>

                        {/* Owner moderation button to hide/unhide */}
                        {canModerate && (
                          <button
                            onClick={() => handleTogglePrayerHide(prayer.id, !!prayer.isHidden)}
                            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                              prayer.isHidden
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                : 'bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-700'
                            }`}
                            title={prayer.isHidden ? 'إظهار الدعاء' : 'إخفاء هذا الدعاء'}
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{prayer.isHidden ? 'مخفي (إظهار)' : 'إخفاء'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-quran pr-9">
                      «{prayer.duaaText}»
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-700 font-semibold text-sm">كن أول من يدعو للمتوفى</p>
              <p className="text-xs text-stone-400 mt-1">دعاؤك في ظهر الغيب مستجاب وصدقة جارية</p>
              <button
                onClick={() => setShowDuaaModal(true)}
                className="mt-4 px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-medium"
              >
                اكتب دعاءك الآن
              </button>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: QURAN SECTION (قسم القرآن) */}
      {activeTab === 'quran' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              بنية الأجر والثواب للمتوفى
            </span>
            <h3 className="text-2xl font-bold text-stone-900 font-quran pt-2">
              قراءة القرآن الكريم
            </h3>
            <p className="text-xs text-stone-500">
              اختر السورة الكريمة لقراءتها بالخط العثماني الواضح
            </p>
          </div>

          {/* Surah Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-100 pb-4">
            {FEATURED_SURAHS.map((surah, idx) => (
              <button
                key={surah.number}
                onClick={() => setSelectedSurahIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedSurahIndex === idx
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {surah.name} ({surah.ayahsCount} آيات)
              </button>
            ))}
          </div>

          {/* Active Surah Presentation */}
          <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-amber-50/30 border border-amber-200/50 text-center space-y-6">
            <div>
              <h4 className="text-2xl sm:text-3xl font-bold font-quran text-stone-900 mb-1">
                {FEATURED_SURAHS[selectedSurahIndex].name}
              </h4>
              {FEATURED_SURAHS[selectedSurahIndex].virtue && (
                <p className="text-xs text-emerald-800 font-medium">
                  {FEATURED_SURAHS[selectedSurahIndex].virtue}
                </p>
              )}
            </div>

            {/* Verses */}
            <div className="font-quran text-lg sm:text-2xl leading-loose text-stone-800 text-justify sm:text-center space-y-4">
              {FEATURED_SURAHS[selectedSurahIndex].verses.map((v) => (
                <span key={v.number} className="inline">
                  {v.text}{' '}
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs text-amber-700 border border-amber-300 font-sans mx-1">
                    {v.number}
                  </span>{' '}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-amber-200/60">
              <span className="text-xs text-stone-500">
                تقبل الله تلاوتك وجعل ثوابها نوراً في قبر {memorial.deceasedName}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ADHKAR SECTION (قسم الأذكار) */}
      {activeTab === 'adhkar' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center space-y-1">
            <h3 className="text-xl font-bold text-stone-900 font-quran">
              الأذكار والتسبيح بنية الأجر للمتوفى
            </h3>
            <p className="text-xs text-stone-500">
              اضغط على بطاقة الذكر لاحتساب التكرار
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADHKAR_LIST.slice(0, 6).map((item) => {
              const count = dhikrCounts[item.id] || 0;
              const isFinished = count >= item.targetCount;

              return (
                <div
                  key={item.id}
                  onClick={() => handleIncrementDhikr(item.id, item.targetCount)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isFinished
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-white hover:bg-stone-50 border-stone-200 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <span className="text-emerald-800 font-semibold">{item.source}</span>
                      <span className="text-stone-400 font-sans">الهدف: {item.targetCount}</span>
                    </div>

                    <p className="font-quran text-base sm:text-lg leading-relaxed text-stone-900 mb-3">
                      {item.text}
                    </p>

                    {item.translationOrNote && (
                      <p className="text-[11px] text-stone-500 mb-4 bg-stone-50 p-2 rounded-xl">
                        {item.translationOrNote}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-600">
                      تم التكرار: <strong className="text-emerald-800 font-sans text-sm">{count}</strong>
                    </span>

                    <button 
                      type="button"
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isFinished
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {isFinished ? 'اكتمل الذكر ✓' : 'تسبيح +1'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 5: CHARITY WORKS (أعمال الخير المرتبطة) */}
      {activeTab === 'charity' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-quran">
                أعمال الخير والصدقة الجارية
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                مشاريع خيرية مستمرة موثقة عن روح {memorial.deceasedName}
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => onNavigate('create', memorial.id)}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold"
              >
                إضافة أو تعديل مشاريع الخير
              </button>
            )}
          </div>

          {memorial.charityProjects && memorial.charityProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memorial.charityProjects.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {p.organizationName}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900">{p.title}</h4>
                    {p.description && (
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        {p.description}
                      </p>
                    )}
                  </div>

                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-emerald-800 border border-stone-300 text-xs font-semibold transition-colors text-center"
                    >
                      <span>زيارة الموقع الرسمي للجهة ({p.organizationName})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <HeartHandshake className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <p className="text-stone-700 font-semibold text-sm">لم يتم ربط مشاريع خيرية محددة حتى الآن</p>
              <p className="text-xs text-stone-500 mt-1">يمكن لصاحب الصفحة إضافة مشاريع الصدقة الجارية (سقيا ماء، كفالة أيتام، طباعة مصاحف) من لوحة التحكم.</p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>تنويه شرعي وأمني:</strong> لا يستقبل التطبيق أي أموال أو تبرعات مباشرة، والروابط المدرجة توجه حصراً إلى الجهات والمنصات الخيرية الرسمية والمرخصة. ويتم الدفع نظير إيصال الدفع الذي يُقدَّم.
          </div>

        </div>
      )}

      {/* Floating Action Bar on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 sm:hidden z-30 flex items-center gap-2 shadow-lg no-print">
        <button
          onClick={() => setShowDuaaModal(true)}
          className="flex-1 py-3 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>ادعُ له ({memorial.prayerCount || 0})</span>
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="px-4 py-3 rounded-xl bg-amber-500 text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-4 h-4" />
          <span>مشاركة</span>
        </button>
      </div>

      {/* MODALS */}
      {showDuaaModal && (
        <DuaaModal
          memorialId={memorial.id}
          deceasedName={memorial.deceasedName}
          isOpen={showDuaaModal}
          onClose={() => setShowDuaaModal(false)}
          onPrayerAdded={handleDuaaAdded}
        />
      )}

      {showShareModal && (
        <ShareModal
          memorial={memorial}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showReportModal && (
        <ReportModal
          memorialId={memorial.id}
          memorialName={memorial.deceasedName}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <img src={selectedImage} alt="عرض الصورة" className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}

    </div>
  );
};
