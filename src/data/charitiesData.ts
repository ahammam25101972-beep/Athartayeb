export interface RegisteredCharity {
  id: string;
  name: string;
  country: 'جمهورية مصر العربية' | 'المملكة العربية السعودية' | 'دولية / أخرى';
  category: 'water' | 'food' | 'orphan' | 'health' | 'quran' | 'mosque' | 'waqf' | 'general';
  categoryLabel: string;
  defaultDescription: string;
  officialUrl: string;
  badge?: string;
  phone?: string;
}

export const REGISTERED_CHARITIES: RegisteredCharity[] = [
  // ==========================================
  // جمهورية مصر العربية (جهات معتمدة وموثقة رسمياً)
  // ==========================================
  {
    id: 'eg-misr-el-kheir',
    name: 'مؤسسة مصر الخير',
    country: 'جمهورية مصر العربية',
    category: 'water',
    categoryLabel: 'سقيا ماء، تكافل اجتماعي، وفك كرب الغارمين',
    defaultDescription: 'توصيل مياه شرب نقية للمنازل بالقرى والنجوع، حفر آبار ارتوازية، بناء أسقف للمنازل، وفك كرب الغارمين والغارمات كصدقة جارية بنية الأجر للمتوفى.',
    officialUrl: 'https://misrelkheir.org',
    badge: 'مشهرة بوزارة التضامن برقم 555',
    phone: '16140'
  },
  {
    id: 'eg-orman',
    name: 'جمعية الأورمان',
    country: 'جمهورية مصر العربية',
    category: 'orphan',
    categoryLabel: 'كفالة أيتام، سقيا ماء، وعمليات قلب وعيون',
    defaultDescription: 'كفالة ورعاية شاملة للأيتام، توصيل وصلات مياه للمنازل الأكثر احتياجاً، إجراء عمليات قلب وعيون لغير القادرين، وتأهيل منازل القرى الفقيرة.',
    officialUrl: 'https://www.orman.org',
    badge: 'مشهرة بوزارة التضامن برقم 803',
    phone: '19455'
  },
  {
    id: 'eg-efb',
    name: 'بنك الطعام المصري',
    country: 'جمهورية مصر العربية',
    category: 'food',
    categoryLabel: 'إطعام طعام، كراتين غذائية، وتكية المحتاجين',
    defaultDescription: 'توفير كراتين وسلال غذائية شهرية للأسر المستحقة والأرامل والمسنين، وإطعام المساكين يومياً كصدقة جارية دائمة الأجر للمتوفى.',
    officialUrl: 'https://www.efb.eg',
    badge: 'مشهر برقم 575 لسنة 2006',
    phone: '16060'
  },
  {
    id: 'eg-magdi-yacoub',
    name: 'مؤسسة مجدي يعقوب لأمراض وأبحاث القلب',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'جراحات قلب مجانية للأطفال والكبار بأسوان',
    defaultDescription: 'صدقة جارية لإنقاذ حياة مرضى القلب والأطفال غير القادرين، وإجراء عمليات قسطرة وقلب مفتوح مجانية بأحدث التقنيات العالمية في مركز أسوان.',
    officialUrl: 'https://myf-egypt.org',
    badge: 'مركز أسوان العالمي للقلب',
    phone: '19687'
  },
  {
    id: 'eg-57357',
    name: 'مستشفى سرطان الأطفال 57357',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'علاج أورام الأطفال بأحدث بروتوكولات الشفاء',
    defaultDescription: 'علاج أطفال مرضى السرطان بالمجان تماماً، وتوفير الأدوية الكيماوية والعمليات والأجهزة الطبية المتطورة كصدقة جارية تجلب الشفاء والأجر.',
    officialUrl: 'https://www.57357.org',
    badge: 'مؤسسة مستشفى 57357',
    phone: '19057'
  },
  {
    id: 'eg-azhar-zakat',
    name: 'بيت الزكاة والصدقات المصري (مشيخة الأزهر الشريف)',
    country: 'جمهورية مصر العربية',
    category: 'waqf',
    categoryLabel: 'وقف شرعي موثوق تحت إشراف الإمام الأكبر شيخ الأزهر',
    defaultDescription: 'صرف الصدقات الجارية في مصارفها الشرعية (سقيا ماء، تيسير زواج يتيمات، علاج مرضى، إغاثة عاجلة) بإشراف مباشر من فضيلة الإمام الأكبر.',
    officialUrl: 'https://www.baitzakat.org.eg',
    badge: 'هيئة تابعة لمشيخة الأزهر الشريف',
    phone: '15111'
  },
  {
    id: 'eg-baheya',
    name: 'مؤسسة مستشفى بهية للكشف المبكر وعلاج سرطان الثدي',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'كشف مبكر وعلاج مجاني لسرطان الثدي للأمهات',
    defaultDescription: 'صدقة جارية لدعم وعلاج الأمهات والسيدات بالمجان عبر الكشف المبكر والعلاج الإشعاعي والكيماوي والعمليات الجراحية والدعم النفسي.',
    officialUrl: 'https://www.baheya.org',
    badge: 'مشهرة بوزارة التضامن برقم 5520',
    phone: '16602'
  },
  {
    id: 'eg-al-nas',
    name: 'مستشفى الناس الخيري للأطفال',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'أكبر مركز متخصص لجراحات قلب الأطفال بالمجان',
    defaultDescription: 'تقديم أفضل رعاية طبية وجراحات قلب للأطفال بالمجان في شبرا الخيمة، وتوفير أحدث غرف رعاية مركزة كصدقة جارية مستمرة.',
    officialUrl: 'https://alnas-hospital.com',
    badge: 'مؤسسة الجود الخيرية',
    phone: '16441'
  },
  {
    id: 'eg-resala',
    name: 'جمعية رسالة للأعمال الخيرية',
    country: 'جمهورية مصر العربية',
    category: 'general',
    categoryLabel: 'كفالات، إطعام، كساء، ومساعدات قرى الصعيد والمحافظات',
    defaultDescription: 'كفالة أسر متعففة، تجهيز عرائس أيتام، كساء المحتاجين، وبناء أسقف وغرف للفقراء في كافة محافظات مصر.',
    officialUrl: 'https://resala.org',
    badge: 'مشهرة بوزارة التضامن برقم 444',
    phone: '19450'
  },
  {
    id: 'eg-cure-bank',
    name: 'بنك الشفاء المصري',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'توفير الدواء والعمليات الجراحية والقوافل الطبية',
    defaultDescription: 'توفير العلاج الدوائي الشهري لأصحاب الأمراض المزمنة غير القادرين، وإجراء عمليات جراحية وقوافل طبية في المحافظات النائية.',
    officialUrl: 'https://www.egyptiancurebank.com',
    badge: 'مشهر برقم 4262 لسنة 2011',
    phone: '16060'
  },
  {
    id: 'eg-clothing-bank',
    name: 'بنك الكساء المصري',
    country: 'جمهورية مصر العربية',
    category: 'general',
    categoryLabel: 'كساء الأسر المتعففة وتوزيع بطاطين وملابس شتوية',
    defaultDescription: 'توفير الملابس الكريمة للأسر المحتاجة وأطفال المدارس والبطاطين في فصل الشتاء بنية الستر والأجر للمتوفى.',
    officialUrl: 'https://www.egyptianclothingbank.org',
    badge: 'مشهر بوزارة التضامن برقم 7921',
    phone: '16060'
  },
  {
    id: 'eg-tahya-misr',
    name: 'صندوق تحيا مصر',
    country: 'جمهورية مصر العربية',
    category: 'waqf',
    categoryLabel: 'مبادرات قومية لتطوير القرى والتنمية الاجتماعية',
    defaultDescription: 'مشاريع قومية لتوفير الحماية الاجتماعية للأسر الأكثر احتياجاً، وتطوير البنية الأساسية وسقيا الماء والمراكز الطبية.',
    officialUrl: 'https://tahyamisr.org',
    badge: 'صندوق رسمي بموجب قانون جمهوري',
    phone: '1333'
  },
  {
    id: 'eg-shefaa-orman',
    name: 'مستشفى شفاء الأورمان لعلاج الأورام بالأقصر',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'صرح طبي مجاني متكامل لعلاج السرطان بصعيد مصر',
    defaultDescription: 'خدمة أهالي محافظات الصعيد (الأقصر، قنا، أسوان، سوهاج، البحر الأحمر) وتوفير العلاج الإشعاعي والكيماوي مجاناً.',
    officialUrl: 'https://shefaorman.org',
    badge: 'أول مستشفى أورام مجاني بالصعيد',
    phone: '19455'
  },
  {
    id: 'eg-nci',
    name: 'المعهد القومي للأورام (جامعة القاهرة)',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'المعهد الرائد لعلاج أورام الكبار والأطفال في مصر',
    defaultDescription: 'صدقة جارية لتطوير غرف العمليات وشراء أجهزة علاج الأورام المتطورة لخدمة آلاف المرضى يومياً من كافة أنحاء الجمهورية.',
    officialUrl: 'https://nci.cu.edu.eg',
    badge: 'مؤسسة جامعية بحثية وعلاجية',
    phone: '19514'
  },
  {
    id: 'eg-ahl-masr',
    name: 'مؤسسة مستشفى أهل مصر لعلاج الحروق بالمجان',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'أول وأكبر مستشفى مجاني لعلاج الحروق في الشرق الأوسط',
    defaultDescription: 'إنقاذ حياة ضحايا الحروق من الأطفال والكبار، وتوفير الرعاية المركزة والعمليات التعويضية وإعادة التأهيل مجاناً 100%.',
    officialUrl: 'https://ahl-masr.ngo',
    badge: 'مشهرة بوزارة التضامن برقم 800',
    phone: '16863'
  },
  {
    id: 'eg-life-makers',
    name: 'مؤسسة صناع الحياة مصر',
    country: 'جمهورية مصر العربية',
    category: 'waqf',
    categoryLabel: 'مشروعات تنموية وتمكين اقتصادي للأسر المعيلة',
    defaultDescription: 'تمكين الأسر المتعففة بمشروعات صغيرة مدرة للدخل، محو الأمية، ووصلات مياه شرب نظيفة كصدقة جارية تنموية مستدامة.',
    officialUrl: 'https://lifemakers.org',
    badge: 'منظمة أهلية مشهرة برقم 839',
    phone: '16563'
  },
  {
    id: 'eg-red-crescent',
    name: 'جمعية الهلال الأحمر المصري',
    country: 'جمهورية مصر العربية',
    category: 'general',
    categoryLabel: 'إغاثة إنسانية، قوافل طبية، وخدمات مجتمعية وطوارئ',
    defaultDescription: 'تقديم العون الإغاثي والطبي للأسر المتضررة في الأزمات وحملات بنوك الدم والقوافل المتخصصة في القرى الحدودية والأشد احتياجاً.',
    officialUrl: 'https://www.egyptianrc.org',
    badge: 'منظمة إنسانية وطنية عريقة',
    phone: '15322'
  },
  {
    id: 'eg-mersal',
    name: 'مؤسسة مرسال الخيرية',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'عناية مركزة، حضانات أطفال، وعلاج الحالات الحرجة',
    defaultDescription: 'توفير أسرة الرعاية المركزة وحضانات الأطفال المبتسرين وأدوية الأمراض النادرة والأورام مجاناً لكافة المحتاجين.',
    officialUrl: 'https://mersal-ngo.org',
    badge: 'مشهرة بوزارة التضامن برقم 648',
    phone: '19875'
  },
  {
    id: 'eg-together-save-human',
    name: 'مؤسسة معاً لإنقاذ إنسان',
    country: 'جمهورية مصر العربية',
    category: 'orphan',
    categoryLabel: 'إيواء ورعاية المشردين وكبار السن فاقدي المأوى',
    defaultDescription: 'إنقاذ ورعاية المشردين في الشوارع، وتوفير المأوى والرعاية الطبية والنفسية والكرامة الإنسانية كصدقة جارية مباركة.',
    officialUrl: 'https://togetherhuman.org',
    badge: 'دور رعاية مشهرة ومعتمدة',
    phone: '19228'
  },
  {
    id: 'eg-mostafa-mahmoud',
    name: 'جمعية ومسجد الدكتور مصطفى محمود الخيرية',
    country: 'جمهورية مصر العربية',
    category: 'health',
    categoryLabel: 'مجمع طبي خيري وقوافل علاجية ورعاية مرضى',
    defaultDescription: 'تقديم الخدمات الطبية في مجمع عيادات ومستشفى مصطفى محمود التخصصي بالمهندسين بأسعار رمزية ومجانية للمتعففين.',
    officialUrl: 'https://mostafamahmoud.org',
    badge: 'مشهرة رسمياً بالجيزة',
    phone: '0233475150'
  },

  // ==========================================
  // المملكة العربية السعودية والخليج
  // ==========================================
  {
    id: 'sa-ehsan',
    name: 'منصة إحسان الوطنية للعمل الخيري',
    country: 'المملكة العربية السعودية',
    category: 'general',
    categoryLabel: 'المنصة الوطنية الشاملة لكافة أبواب البر',
    defaultDescription: 'صدقات جارية في سقيا الماء، رعاية الأيتام، تفريج كرب، وعلاج المرضى عبر منصة حكومية رسمية موثوقة.',
    officialUrl: 'https://ehsan.sa',
    badge: 'منصة وطنية سعودية معتمدة'
  },
  {
    id: 'sa-quran-complex',
    name: 'مجمع الملك فهد لطباعة المصحف الشريف بالمدينة',
    country: 'المملكة العربية السعودية',
    category: 'quran',
    categoryLabel: 'طباعة وتوزيع المصحف الشريف بالمساجد',
    defaultDescription: 'وقف وتوزيع المصاحف الشريفة في المسجد الحرام والمسجد النبوي والمساجد الكبرى بنية الأجر للمتوفى.',
    officialUrl: 'https://qurancomplex.gov.sa',
    badge: 'المجمع الرسمي لطباعة المصحف'
  },
  {
    id: 'sa-ensan',
    name: 'الجمعية الخيرية لرعاية الأيتام (إنسان)',
    country: 'المملكة العربية السعودية',
    category: 'orphan',
    categoryLabel: 'كفالة ورعاية شاملة للأيتام والأرامل',
    defaultDescription: 'كفالة أيتام شاملة السكن والتعليم والغذاء والصحة بنية إهداء ثوابها للمغفور له بإذن الله.',
    officialUrl: 'https://www.ensan.org.sa',
    badge: 'جمعية إنسان المرخصة'
  },
  {
    id: 'sa-suqia',
    name: 'جمعية سقيا الماء الخيرية',
    country: 'المملكة العربية السعودية',
    category: 'water',
    categoryLabel: 'سقيا ماء وحفر آبار بالمساجد والقرى',
    defaultDescription: 'حفر آبار وتوفير مياه شرب نقية في المساجد ومواقيت الحج والقرى المحتاجة كصدقة جارية دائمة.',
    officialUrl: 'https://suqia.org.sa',
    badge: 'جمعية سقيا المرخصة'
  },
  {
    id: 'sa-tabarru',
    name: 'منصة تبرع (وزارة الموارد البشرية السعودية)',
    country: 'المملكة العربية السعودية',
    category: 'waqf',
    categoryLabel: 'المنصة الوطنية المعتمدة للتبرعات',
    defaultDescription: 'بوابة وطنية آمنة تقدم مئات الفرص للصدقة الجارية وبناء المساجد وكفالة الأسر المتعففة.',
    officialUrl: 'https://donations.sa',
    badge: 'إشراف حكومي مباشر'
  },

  // ==========================================
  // جهات دولية وإسلامية موثوقة
  // ==========================================
  {
    id: 'int-direct-aid',
    name: 'جمعية العون المباشر (Direct Aid)',
    country: 'دولية / أخرى',
    category: 'water',
    categoryLabel: 'حفر آبار ارتوازية ومساجد في إفريقيا',
    defaultDescription: 'حفر آبار مياه دائمة، بناء مساجد، وكفالة أيتام في أشد مناطق العالم فقراً وجفافاً في إفريقيا.',
    officialUrl: 'https://direct-aid.org',
    badge: 'تأسست بإشراف د. عبد الرحمن السميط رحمه الله'
  },
  {
    id: 'int-islamic-relief',
    name: 'الإغاثة الإسلامية العالمية (Islamic Relief)',
    country: 'دولية / أخرى',
    category: 'general',
    categoryLabel: 'إغاثة عاجلة، كفالات أيتام، ومياه شرب',
    defaultDescription: 'مشاريع مياه مستدامة، كفالة أسر لاجئة، وبناء مستوصفات طبية في مختلف الدول الإسلامية.',
    officialUrl: 'https://www.islamic-relief.org',
    badge: 'منظمة إغاثة دولية معتمدة'
  }
];
