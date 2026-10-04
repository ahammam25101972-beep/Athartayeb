import { Memorial, Prayer } from '../types';

export const DEMO_MEMORIALS: Memorial[] = [
  {
    id: 'demo-memorial-1',
    userId: 'demo-user-1',
    deceasedName: 'الوالد عبد الرحمن بن عبد الله',
    titlePrefix: 'المغفور له بإذن الله',
    dateOfDeath: '2024-04-15',
    hijriDate: '6 شوال 1445 هـ',
    cityOrCountry: 'الرياض، المملكة العربية السعودية',
    summary: 'كان والدنا رحمه الله محباً للخير، سباقاً لإصلاح ذات البين، معلماً لأبنائه وأحفاده كتاب الله وسنة رسوله ﷺ. عُرف بالبشاشة والتواضع والصدقة الخفية وإعانة المحتاجين. نسأل الله أن يجعل ما قدمه في موازين حسناته وأن يجمعنا به في الفردوس الأعلى من الجنة.',
    customDuaa: 'اللهم اجعل قبره روضة من رياض الجنة، وأنزِل عليه الضياء والنور والبهجة والسرور، واجزه بالإحسان إحساناً وبالسيئات عفواً وغفراناً.',
    photoUrl: '/Warm Portrait in a Home Office.png',
    visitCount: 342,
    prayerCount: 189,
    isPublished: true,
    isSuspended: false,
    allowPublicDuaa: true,
    domainType: 'custom',
    customDomain: 'www.abdelrahman-abdullah-4digital.net',
    creatorName: 'أبناؤه وبناته ومحبوه',
    createdAt: '2024-04-16T10:00:00.000Z',
    updatedAt: '2024-04-16T10:00:00.000Z',
    charityProjects: [
      {
        id: 'cp-1',
        title: 'سقيا ماء وحفر بئر ارتوازي صدقة جارية',
        description: 'مشروع توفير مياه شرب نقية لقرية ريفية محتاجة بالتعاون مع منصة إحسان الخيرية المرخصة.',
        organizationName: 'منصة إحسان الخيرية',
        category: 'water',
        url: 'https://ehsan.sa'
      },
      {
        id: 'cp-2',
        title: 'طباعة وتوزيع مصاحف شريفة في المساجد',
        description: 'وقف طباعة 500 مصحف للمساجد ودور تحفيظ القرآن الكريم بنية الأجر للمغفور له.',
        organizationName: 'مجمع الملك فهد لطباعة المصحف الشريف',
        category: 'quran'
      },
      {
        id: 'cp-3',
        title: 'كفالة أيتام مستمرة',
        description: 'كفالة شهرية لعدد من الأيتام والأسر المتعففة عبر الجمعيات الرسمية المرخصة.',
        organizationName: 'جمعية رعاية الأيتام الرسمية',
        category: 'orphan'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'demo-memorial-2',
    userId: 'demo-user-2',
    deceasedName: 'الوالدة فاطمة بنت إبراهيم',
    titlePrefix: 'المرحومة بإذن الله تعالى',
    dateOfDeath: '2024-01-20',
    hijriDate: '8 رجب 1445 هـ',
    cityOrCountry: 'القاهرة، مصر',
    summary: 'الأم الفاضلة والمربية الحنون التي أفنت عمرها في خدمة بيتها وأسرتها وتربية أجيال على طاعة الله ومحبة الناس وإطعام المساكين. كانت صاحبة لسان ذاكر وقلب نقي رءوف.',
    customDuaa: 'اللهم ارحم أمنا كما ربتنا صغاراً، وافسح لها في قبرها مد بصرها، وافرش لها من الجنة، واجمعنا بها في مستقر رحمتك.',
    photoUrl: '/Gemini_Generated_Image_b13x42b13x42b13x.jpg',
    visitCount: 215,
    prayerCount: 147,
    isPublished: true,
    isSuspended: false,
    allowPublicDuaa: true,
    domainType: 'custom',
    customDomain: 'www.fatima-ibrahim-4digital.net',
    creatorName: 'أسرة الفقيدة ومحبوها',
    createdAt: '2024-01-21T08:30:00.000Z',
    updatedAt: '2024-01-21T08:30:00.000Z',
    charityProjects: [
      {
        id: 'cp-4',
        title: 'وقف إطعام طعام للأسر المتعففة',
        description: 'توزيع وجبات وسلال غذائية دورية على الأسر المستحقة عبر بنك الطعام المصري المرخص.',
        organizationName: 'بنك الطعام المصري',
        category: 'food',
        url: 'https://www.efb.eg'
      }
    ]
  }
];

export const DEMO_PRAYERS: Record<string, Prayer[]> = {
  'demo-memorial-1': [
    {
      id: 'dp-1',
      memorialId: 'demo-memorial-1',
      authorName: 'أبو فهد العتيبي',
      duaaText: 'رحمك الله يا أبا عبد الرحمن رحمة واسعة وغفر لك وثبتك وأسكنك الفردوس الأعلى، كنت نعم الجار ونعم الرجل الصالح.',
      isHidden: false,
      createdAt: '2024-04-16T12:00:00.000Z'
    },
    {
      id: 'dp-2',
      memorialId: 'demo-memorial-1',
      authorName: 'د. خالد السالم',
      duaaText: 'اللهم وسع مدخله واغسله بالماء والثلج والبرد ونقه من الذنوب والخطايا كما ينقى الثوب الأبيض من الدنس.',
      isHidden: false,
      createdAt: '2024-04-16T15:20:00.000Z'
    },
    {
      id: 'dp-3',
      memorialId: 'demo-memorial-1',
      authorName: 'محب للخير',
      duaaText: 'اللهم اجعل كل عمل خير تركه صدقة جارية ونوراً في قبره إلى يوم يبعثون.',
      isHidden: false,
      createdAt: '2024-04-17T09:10:00.000Z'
    }
  ],
  'demo-memorial-2': [
    {
      id: 'dp-4',
      memorialId: 'demo-memorial-2',
      authorName: 'مريم أحمد',
      duaaText: 'اللهم اجزها عنا خير الجزاء واغفر لها وارحمها وعافها واعف عنها واجعل الفردوس الأعلى مستقرها.',
      isHidden: false,
      createdAt: '2024-01-21T10:00:00.000Z'
    }
  ]
};
