import React from 'react';
import { ShieldCheck, Heart, BookOpen, Share2 } from 'lucide-react';
import { SiteLogo } from './SiteLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Reverent Hadith Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border border-emerald-800/40 text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <p className="text-amber-400 font-quran text-lg sm:text-2xl leading-relaxed mb-3">
            «إِذَا مَاتَ الإنْسَانُ انْقَطَعَ عنْه عَمَلُهُ إِلَّا مِن ثَلَاثَةٍ: إِلَّا مِن صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو له»
          </p>
          <span className="text-xs sm:text-sm text-stone-400 font-medium">
            رواه مسلم في صحيحه عن أبي هريرة رضي الله عنه
          </span>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <SiteLogo size={46} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-quran">أثر طيب</span>
                <span className="text-[11px] text-stone-400">صدقة جارية لروح الفقيد</span>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              منصة تذكارية إسلامية تهدف إلى تيسير الدعاء لموتانا وربط الأحياء بالأعمال الصالحة والصدقات الجارية التي ينفع الله بها الميت.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              الأقسام والخدمات
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('create')} className="hover:text-emerald-400 transition-colors">
                  إنشاء صفحة تذكارية جديدة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('quran')} className="hover:text-emerald-400 transition-colors">
                  سور القرآن الكريم للقراءة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('adhkar')} className="hover:text-emerald-400 transition-colors">
                  أذكار الصباح والمساء وأدعية الميت
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('charity')} className="hover:text-emerald-400 transition-colors">
                  دليل الصدقات الجارية
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Charity Notice */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              الأمان والشفافية
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              <strong className="text-stone-300">تنويه شرعي وأمني:</strong> لا يستقبل التطبيق أي أموال أو تبرعات مباشرة، والروابط المدرجة توجه حصراً إلى الجهات والمنصات الخيرية الرسمية والمرخصة. ويتم الدفع نظير إيصال الدفع الذي يُقدَّم.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/30">
              <Heart className="w-4 h-4 shrink-0 text-amber-400" />
              <span>سعر رمزي لحجز النطاق والاستضافة: ٢٠٠ جنيه فقط</span>
            </div>
          </div>

          {/* Share & Prayer */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" />
              الدال على الخير
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              قال رسول الله ﷺ: «مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ». شارك المنصة مع من فقدوا عزيزاً ليكون صدقة جارية ونوراً في قبورهم.
            </p>
            <button
              onClick={() => onNavigate('search')}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors text-center"
            >
              البحث في الصفحات التذكارية
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 gap-4 text-center">
          <p className="order-1 md:order-none text-stone-500">
            © {new Date().getFullYear()} أثر طيب. جميع الحقوق محفوظة لوجه الله تعالى.
          </p>

          {/* Center Developer & Program Attribution */}
          <div className="order-2 md:order-none flex flex-wrap items-center justify-center gap-2 text-stone-300 font-medium">
            <span>تصميم وبرمجة <strong className="text-amber-400 font-bold">أحمد همام</strong> : <span dir="ltr" className="font-mono text-emerald-400 font-bold">01205132328</span></span>
            <span className="text-stone-600 font-bold hidden sm:inline">|</span>
            <a 
              href="https://www.facebook.com/profile.php?id=61582844093225" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 font-bold transition-colors inline-flex items-center gap-1"
            >
              فكرة اليوم تطبيق الغد
            </a>
          </div>

          <div className="order-3 md:order-none flex items-center gap-4 text-stone-500">
            <span>تصميم هادئ ووقور متوافق مع كافة الأجهزة</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
