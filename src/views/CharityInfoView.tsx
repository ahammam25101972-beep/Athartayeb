import React from 'react';
import { HeartHandshake, Droplet, BookOpen, Users, Building, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const CharityInfoView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const charityTypes = [
    {
      title: 'سقيا الماء وحفر الآبار',
      icon: Droplet,
      hadith: 'سُئل النبي ﷺ: أَيُّ الصَّدَقَةِ أَفْضَلُ؟ قَالَ: «سَقْيُ الْمَاءِ».',
      desc: 'حفر الآبار وتوفير محطات تنقية المياه وتوزيع برادات المياه في المساجد والأماكن العامة من أعظم الصدقات الجارية نفعاً واستمراراً.',
      examples: 'منصة إحسان، الجمعيات الخيرية الرسمية للغوث والمياه'
    },
    {
      title: 'طباعة المصاحف ونشر العلم',
      icon: BookOpen,
      hadith: '«مِمَّا يَلْحَقُ الْمُؤْمِنَ مِنْ عَمَلِهِ وَحَسَنَاتِهِ بَعْدَ مَوْتِهِ: عِلْمًا عَلَّمَهُ وَنَشَرَهُ، أَوْ وَلَدًا صَالِحًا تَرَكَهُ، أَوْ مُصْحَفًا وَرَّثَهُ...»',
      desc: 'وقف المصاحف الشريفة وكتب التفسير والحديث، وبناء دور تحفيظ القرآن الكريم وكفالة معلمي القرآن.',
      examples: 'مجمع الملك فهد لطباعة المصحف الشريف، دور التحفيظ المعتمدة'
    },
    {
      title: 'كفالة الأيتام والأسر المتعففة',
      icon: Users,
      hadith: 'قال رسول الله ﷺ: «أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا» وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى.',
      desc: 'تأمين المصاريف الشهرية ورعاية اليتيم صحياً وتعليمياً واجتماعياً بنية إهداء ثواب ذلك للمتوفى.',
      examples: 'جمعية إنسان، جمعيات رعاية الأيتام المرخصة'
    },
    {
      title: 'بناء ورعاية بيوت الله (المساجد)',
      icon: Building,
      hadith: 'قال رسول الله ﷺ: «مَنْ بَنَى مَسْجِدًا لِلَّهِ بَنَى اللَّهُ لَهُ فِي الْجَنَّةِ مِثْلَهُ».',
      desc: 'المساهمة في تشييد المساجد، أو صيانتها وتجهيزها بالفرش والصوتيات وأجهزة التكييف والمصاحف.',
      examples: 'منصات الإحسان والبر الرسمية'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
          <span>أبواب الخير الدائمة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-quran">
          دليل الصدقات الجارية وأعمال الخير
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          بيان بأفضل الصدقات الجارية التي يصل ثوابها للمتوفى بإذن الله تعالى والجهات الرسمية المعتمدة
        </p>
      </div>

      {/* Transparency Banner */}
      <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-950 leading-relaxed">
          <p className="font-bold text-sm">ميثاق الشفافية والأمان في "أثر طيب"</p>
          <p>
            تنويه شرعي وأمني: لا يستقبل التطبيق أي أموال أو تبرعات مباشرة، والروابط المدرجة توجه حصراً إلى الجهات والمنصات الخيرية الرسمية والمرخصة. ويتم الدفع نظير إيصال الدفع الذي يُقدَّم.
          </p>
        </div>
      </div>

      {/* Charity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charityTypes.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-quran">{item.title}</h3>
                <p className="font-quran text-xs sm:text-sm text-emerald-900 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  {item.hadith}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 text-xs text-stone-500">
                <span className="font-semibold text-stone-700 block mb-0.5">من الجهات المقترحة:</span>
                <span>{item.examples}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Charity Portals Reference */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-stone-900 font-quran flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-emerald-700" />
          <span>الجهات والمؤسسات الخيرية المعتمدة في جمهورية مصر العربية</span>
        </h3>
        <p className="text-xs text-stone-500">
          يمكنك المساهمة مباشرة عبر البوابات الوطنية المعتمدة في مصر واختيار إهداء الصدقة للمتوفى:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {[
            { name: 'مؤسسة مصر الخير', role: 'سقيا ماء، فك كرب، أسقف وتكافل', phone: '16140', url: 'https://misrelkheir.org' },
            { name: 'جمعية الأورمان', role: 'كفالة أيتام، عمليات قلب وعيون، مياه', phone: '19455', url: 'https://www.orman.org' },
            { name: 'بنك الطعام المصري', role: 'إطعام طعام، كراتين غذائية للمستحقين', phone: '16060', url: 'https://www.efb.eg' },
            { name: 'مؤسسة مجدي يعقوب للقلب', role: 'جراحات قلب مجانية للأطفال بأسوان', phone: '19687', url: 'https://myf-egypt.org' },
            { name: 'مستشفى سرطان الأطفال 57357', role: 'علاج أورام الأطفال بالمجان', phone: '19057', url: 'https://www.57357.org' },
            { name: 'بيت الزكاة والصدقات (الأزهر)', role: 'مصارف شرعية بإشراف الإمام الأكبر', phone: '15111', url: 'https://www.baitzakat.org.eg' },
            { name: 'مستشفى بهية للكشف المبكر', role: 'علاج سرطان الثدي للأمهات بالمجان', phone: '16602', url: 'https://www.baheya.org' },
            { name: 'مستشفى الناس للأطفال', role: 'جراحات قلب أطفال ورعاية مركزة', phone: '16441', url: 'https://alnas-hospital.com' },
            { name: 'بنك الشفاء المصري', role: 'توفير الدواء وقوافل طبية مجانية', phone: '16060', url: 'https://www.egyptiancurebank.com' },
            { name: 'مستشفى أهل مصر للحروق', role: 'علاج ورعاية ضحايا الحروق بالمجان', phone: '16863', url: 'https://ahl-masr.ngo' },
            { name: 'مستشفى شفاء الأورمان بالصعيد', role: 'علاج الأورام بالمجان لأهالي الصعيد', phone: '19455', url: 'https://shefaorman.org' },
            { name: 'المعهد القومي للأورام', role: 'صرح علاج الأورام - جامعة القاهرة', phone: '19514', url: 'https://nci.cu.edu.eg' }
          ].map((charity, i) => (
            <a
              key={i}
              href={charity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 transition-colors text-right space-y-1 group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">{charity.name}</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded-md font-mono">{charity.phone}</span>
              </div>
              <span className="text-[11px] text-stone-500 block leading-tight">{charity.role}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white text-center space-y-4">
        <h3 className="text-2xl font-bold font-quran">هل تريد توثيق أعمال خير لفقيدك؟</h3>
        <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
          أنشئ صفحة تذكارية الآن وأضف مشاريع الخير المرتبطة باسمه ليشارك فيها الأهل والأصدقاء
        </p>
        <button
          onClick={() => onNavigate('create')}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs sm:text-sm transition-colors"
        >
          إنشاء صفحة تذكارية الآن
        </button>
      </div>

    </div>
  );
};
