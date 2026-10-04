import React, { useEffect, useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Search, 
  PlusCircle, 
  Share2, 
  Heart, 
  BookOpen, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  QrCode,
  Globe,
  Tag,
  ShieldCheck,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { Memorial } from '../types';
import { memorialService } from '../services/memorialService';
import { MemorialCard } from '../components/MemorialCard';
import { ShareModal } from '../components/ShareModal';
import { SiteLogo } from '../components/SiteLogo';

interface HomeViewProps {
  onNavigate: (view: string, id?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShareMemorial, setSelectedShareMemorial] = useState<Memorial | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await memorialService.getPublishedMemorials();
        setMemorials(data);
      } catch (err) {
        console.error('Failed to load memorials:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', searchQuery.trim());
    } else {
      onNavigate('search');
    }
  };

  const handleShareClick = (mem: Memorial, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedShareMemorial(mem);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-stone-200/70 bg-gradient-to-b from-emerald-50/50 via-stone-50 to-stone-50">
        
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          {/* Price Banner Tag */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>سعر التطبيق: ٢٠٠ جنيه مصري فقط</span>
            <span className="hidden sm:inline text-emerald-700">|</span>
            <span className="text-[11px] sm:text-xs text-emerald-800 font-semibold">شامل الصفحة والدومين والـ QR Code مدى الحياة</span>
          </div>

          {/* Official Emblem Logo */}
          <div className="flex justify-center pt-1 pb-1">
            <div className="p-2.5 rounded-full bg-white/90 shadow-md border border-amber-200/80 backdrop-blur-xs hover:scale-105 transition-transform duration-300">
              <SiteLogo size={108} />
            </div>
          </div>

          {/* Main Title Required: "اترك أثرًا طيبًا لمن تحب" */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight font-quran leading-tight sm:leading-snug">
            اترك أثرًا طيبًا لمن تحب
          </h1>

          {/* Subtitle Required Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-stone-600 leading-relaxed font-normal">
            منصة إسلامية تساعد الأسرة على إنشاء صفحة تذكارية للمتوفى، تجمع الدعاء الصادق، وقراءة القرآن والأذكار، وأعمال الخير والصدقة الجارية في مكان واحد مبارك.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={() => onNavigate('create')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <PlusCircle className="w-5 h-5 text-amber-300 group-hover:rotate-90 transition-transform duration-300" />
              <span>أنشئ صفحة الآن</span>
            </button>

            <button
              onClick={() => onNavigate('search')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-semibold text-base border border-stone-300 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-emerald-700" />
              <span>تصفح وابحث بالاسم</span>
            </button>
          </div>

          {/* Instant Search Bar */}
          <div className="max-w-xl mx-auto pt-6">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم المتوفى أو رقم الصفحة..."
                className="w-full py-3.5 pr-12 pl-24 rounded-2xl bg-white border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm outline-none transition-all placeholder:text-stone-400"
              />
              <Search className="w-5 h-5 text-stone-400 absolute right-4 pointer-events-none" />
              <button
                type="submit"
                className="absolute left-2 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                بحث
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 2. Price Highlight Card (سعر التطبيق ٢٠٠ ج) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white p-8 sm:p-12 shadow-xl border border-emerald-800/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-right flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Tag className="w-3.5 h-3.5" />
                <span>عرض شامل لجميع الصفحات</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-quran text-white">
                باقة أثر طيب الشاملة: <span className="text-amber-300">٢٠٠ جنيه مصري فقط</span>
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
                سعر رمزي لمرة واحدة فقط دون أي رسوم متكررة أو اشتراكات خفية، يغطي تكلفة حجز النطاق والاستضافة السحابية الآمنة لتبقى صفحة فقيدك صدقة جارية ونوراً دائماً بإذن الله.
              </p>

              {/* Package inclusions grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>دومين خاص بإسم المتوفى</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>رمز QR Code فوري عالي الدقة لطباعة بطاقات العزاء</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>سور القرآن الكريم كاملة وأذكار بتطبيق عداد تفاعلي</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ربط رسمي مع كبرى الجمعيات الخيرية (إطعام، سقيا، أيتام)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>سجل دعوات مفتوح يتيح للأقارب والأصدقاء كتابة الأدعية</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>استضافة دائمة آمنة وخالية تماماً من الإعلانات المزعجة</span>
                </div>
              </div>
            </div>

            {/* Price badge box & CTA */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center shrink-0 w-full sm:w-72 space-y-4">
              <span className="text-xs text-stone-300 font-medium block">تكلفة الخدمة الشاملة</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold text-amber-300 font-sans">200</span>
                <span className="text-lg font-bold text-white">ج.م</span>
              </div>
              <span className="text-[11px] text-emerald-200 block">دفع مرة واحدة مدى الحياة</span>
              <button
                onClick={() => onNavigate('create')}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>أنشئ صفحة الآن</span>
              </button>
              <div className="text-[10px] text-stone-300 space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">فودافون كاش:</span>
                  <span className="font-mono font-bold text-amber-300" dir="ltr">01005892886</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">إنستاباي:</span>
                  <span className="font-mono font-bold text-amber-300" dir="ltr">ahammam251072@instapay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Steps Section (Required: 3 خطوات للاستخدام) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
            بساطة وسهولة
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 mt-2 font-quran">
            كيف يعمل أثر طيب في 3 خطوات بسيطة
          </h2>
          <p className="text-sm text-stone-500 mt-2 max-w-lg mx-auto">
            خطوات ميسرة لتخليد ذكرى فقيدك وربط محبيه بالدعاء والصدقة المستمرة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8" />
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center mb-3">
              1
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 font-quran">
              أنشئ صفحة الفقيد
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              أدخل اسم المتوفى وتاريخ الوفاة ونبذة من سيرته العطرة وصورة وقورة أو رمزية، مع دعاء خاص وأعمال الخير المعتمدة.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center mb-3">
              2
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 font-quran">
              شارك الرابط أو QR Code
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              شارك الرابط فوراً مع الأهل والأصدقاء عبر واتساب ووسائل التواصل الاجتماعي، أو اطبع رمز الـ QR على بطاقات العزاء ومجالس الذكر.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center relative group">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 fill-emerald-800/10" />
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center mb-3">
              3
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 font-quran">
              اترك للناس فرصة الدعاء والمشاركة في الخير
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              يدخل الزوار للدعاء للمتوفى، وقراءة ما تيسر من سور القرآن والأذكار بنية الأجر له، والمساهمة في مشاريع الصدقة الجارية المرتبطة بالصفحة.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Featured / Recent Memorials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-quran">
              صفحات تذكارية وصدقات جارية
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              شارك في الدعاء لموتانا وموتى المسلمين واقرأ ما تيسر من الذكر
            </p>
          </div>

          <button
            onClick={() => onNavigate('search')}
            className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>عرض كافة الصفحات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-72 border border-stone-200"></div>
            ))}
          </div>
        ) : memorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {memorials.slice(0, 6).map((memorial) => (
              <MemorialCard
                key={memorial.id}
                memorial={memorial}
                onOpen={(id) => onNavigate('memorial', id)}
                onShare={handleShareClick}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
            <HeartHandshake className="w-12 h-12 text-emerald-800/40 mx-auto mb-3" />
            <p className="text-stone-700 font-semibold">لم يتم إنشاء صفحات بعد</p>
            <p className="text-xs text-stone-500 mt-1">كن أول من يترك أثراً طيباً وينشئ صفحة لفقيده</p>
            <button
              onClick={() => onNavigate('create')}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
            >
              أنشئ أول صفحة الآن
            </button>
          </div>
        )}
      </section>

      {/* 5. Quick Spiritual Portals (Quran & Adhkar Preview) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quran Portal Card */}
          <div 
            onClick={() => onNavigate('quran')}
            className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white cursor-pointer group shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-emerald-200 bg-white/10 px-3 py-1 rounded-full">
                قارئ القرآن الكريم
              </span>
            </div>
            <h3 className="text-2xl font-bold font-quran mb-2">
              سور من القرآن الكريم للميت
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
              سورة يس، تبارك (الملك)، الواقعة، الرحمن، والكهف بخط عثماني وتنسيق مصحف وقور للقراءة وإهداء الثواب.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>تصفح واقرأ السور الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>

          {/* Adhkar Portal Card */}
          <div 
            onClick={() => onNavigate('adhkar')}
            className="p-8 rounded-3xl bg-gradient-to-br from-stone-900 to-emerald-950 text-white cursor-pointer group shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-amber-200 bg-white/10 px-3 py-1 rounded-full">
                عداد الذكر التفاعلي
              </span>
            </div>
            <h3 className="text-2xl font-bold font-quran mb-2">
              أذكار الصباح والمساء ودعاء الميت
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
              أذكار صحيحة ومأثورة مع عداد تفاعلي يسهل عليك التسبيح والاستغفار وذكر الله في كل وقت.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>افتح الأذكار والعداد التفاعلي</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* Share Modal Dialog if triggered */}
      {selectedShareMemorial && (
        <ShareModal
          memorial={selectedShareMemorial}
          isOpen={!!selectedShareMemorial}
          onClose={() => setSelectedShareMemorial(null)}
        />
      )}

    </div>
  );
};
