import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Upload, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  User, 
  BookOpen, 
  Share2, 
  QrCode, 
  Heart, 
  Link as LinkIcon,
  ShieldCheck,
  Image as ImageIcon,
  Globe,
  Check,
  Copy,
  Building2,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Tag,
  CreditCard,
  CheckCircle,
  Info,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { memorialService } from '../services/memorialService';
import { CharityProject, Memorial } from '../types';
import { DECEASED_DUAAS } from '../data/adhkarData';
import { REGISTERED_CHARITIES, RegisteredCharity } from '../data/charitiesData';
import { ShareModal } from '../components/ShareModal';

interface CreateMemorialViewProps {
  onNavigate: (view: string, id?: string) => void;
  editMemorial?: Memorial | null;
}

// Client-side image compressor: scales images down to max 800px & 0.75 quality base64 string
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('الملف المرفق ليس صورة صالحة'));
    }
    if (file.size > 10 * 1024 * 1024) {
      return reject(new Error('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 10 ميجابايت'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(event.target?.result as string);
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

function slugifyArabic(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 40);
}

const PRESET_AVATARS = [
  { label: 'زخرفة إسلامية خضراء', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80' },
  { label: 'مصحف شريف ونور', url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format&fit=crop&q=80' },
  { label: 'طبيعة هادئة وأشجار', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80' },
  { label: 'سماء وسحاب', url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80' },
];

export const CreateMemorialView: React.FC<CreateMemorialViewProps> = ({ onNavigate, editMemorial }) => {
  const { activeUid, activeDisplayName } = useAuth();

  // Form states
  const [deceasedName, setDeceasedName] = useState(editMemorial?.deceasedName || '');
  const [titlePrefix, setTitlePrefix] = useState(editMemorial?.titlePrefix || 'المغفور له بإذن الله');
  const [photoUrl, setPhotoUrl] = useState(editMemorial?.photoUrl || '');
  const [dateOfDeath, setDateOfDeath] = useState(editMemorial?.dateOfDeath || '');
  const [hijriDate, setHijriDate] = useState(editMemorial?.hijriDate || '');
  const [cityOrCountry, setCityOrCountry] = useState(editMemorial?.cityOrCountry || '');
  const [summary, setSummary] = useState(editMemorial?.summary || '');
  const [customDuaa, setCustomDuaa] = useState(editMemorial?.customDuaa || DECEASED_DUAAS[0].text);
  const [charityProjects, setCharityProjects] = useState<CharityProject[]>(editMemorial?.charityProjects || []);
  const [galleryImages, setGalleryImages] = useState<string[]>(editMemorial?.galleryImages || []);
  const [allowPublicDuaa, setAllowPublicDuaa] = useState(editMemorial ? editMemorial.allowPublicDuaa : true);

  // Domain selection state (Custom Domain included in unified 200 EGP price)
  const [customDomain, setCustomDomain] = useState(editMemorial?.customDomain || '');

  // Charity items inputs & Dropdown state
  const [showAddCharity, setShowAddCharity] = useState(false);
  const [selectedCharityPresetId, setSelectedCharityPresetId] = useState<string>('');
  const [newCharityTitle, setNewCharityTitle] = useState('');
  const [newCharityOrg, setNewCharityOrg] = useState('');
  const [newCharityDesc, setNewCharityDesc] = useState('');
  const [newCharityUrl, setNewCharityUrl] = useState('');
  const [newCharityCategory, setNewCharityCategory] = useState<CharityProject['category']>('water');

  // Submission & feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdMemorial, setCreatedMemorial] = useState<Memorial | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);
  const [copiedInstapay, setCopiedInstapay] = useState(false);

  // Auto-generate domain names when deceased name changes if not manually set
  useEffect(() => {
    if (deceasedName && !editMemorial) {
      const slug = slugifyArabic(deceasedName);
      if (!customDomain) {
        setCustomDomain(`www.${slug}-4digital.net`);
      }
    }
  }, [deceasedName, editMemorial]);

  const handleCharityPresetChange = (presetId: string) => {
    setSelectedCharityPresetId(presetId);
    if (!presetId) return;

    if (presetId === 'custom_other') {
      setNewCharityOrg('');
      setNewCharityUrl('');
      setNewCharityDesc('');
      return;
    }

    const charity = REGISTERED_CHARITIES.find(c => c.id === presetId);
    if (charity) {
      setNewCharityOrg(charity.name);
      setNewCharityUrl(charity.officialUrl);
      setNewCharityCategory(charity.category as any);
      setNewCharityDesc(charity.defaultDescription);
      if (!newCharityTitle.trim()) {
        setNewCharityTitle(`${charity.categoryLabel} - صدقة جارية`);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setPhotoUrl(compressed);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء معالجة الصورة');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (galleryImages.length >= 6) {
        alert('الحد الأقصى للصور الإضافية هو 6 صور');
        return;
      }
      const compressed = await compressImage(file);
      setGalleryImages([...galleryImages, compressed]);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء معالجة الصورة');
    }
  };

  const handleAddCharity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharityTitle.trim() || !newCharityOrg.trim()) {
      alert('يرجى اختيار جهة خيرية وكتابة عنوان العمل الخيري');
      return;
    }
    const newProject: CharityProject = {
      id: 'cp_' + Date.now(),
      title: newCharityTitle.trim(),
      organizationName: newCharityOrg.trim(),
      description: newCharityDesc.trim(),
      url: newCharityUrl.trim() || undefined,
      category: newCharityCategory
    };
    setCharityProjects([...charityProjects, newProject]);
    setNewCharityTitle('');
    setNewCharityOrg('');
    setNewCharityDesc('');
    setNewCharityUrl('');
    setSelectedCharityPresetId('');
    setShowAddCharity(false);
  };

  const handleRemoveCharity = (id: string) => {
    setCharityProjects(charityProjects.filter(p => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName.trim()) {
      setErrorMessage('يرجى إدخال اسم المتوفى');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const memorialId = editMemorial 
        ? editMemorial.id 
        : 'mem_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

      const resolvedCustomDomain = customDomain.trim() || `www.${slugifyArabic(deceasedName)}-4digital.net`;

      if (editMemorial) {
        await memorialService.updateMemorial(editMemorial.id, {
          deceasedName: deceasedName.trim(),
          titlePrefix,
          photoUrl,
          dateOfDeath,
          hijriDate,
          cityOrCountry,
          summary: summary.trim(),
          customDuaa: customDuaa.trim(),
          charityProjects,
          galleryImages,
          allowPublicDuaa,
          domainType: 'custom',
          customDomain: resolvedCustomDomain
        });
        onNavigate('memorial', editMemorial.id);
      } else {
        const newMemorialData = {
          id: memorialId,
          userId: activeUid,
          deceasedName: deceasedName.trim(),
          titlePrefix,
          photoUrl,
          dateOfDeath,
          hijriDate,
          cityOrCountry,
          summary: summary.trim(),
          customDuaa: customDuaa.trim(),
          charityProjects,
          galleryImages,
          isPublished: true,
          allowPublicDuaa,
          creatorName: activeDisplayName || 'فاعل خير',
          domainType: 'custom' as const,
          customDomain: resolvedCustomDomain,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const created = await memorialService.createMemorial(newMemorialData);
        setCreatedMemorial(created);
      }
    } catch (err: any) {
      console.error('Error saving memorial:', err);
      setErrorMessage('حدث خطأ أثناء حفظ الصفحة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If page was successfully created, show confirmation, domain details, 200 EGP payment info, & QR Code
  if (createdMemorial) {
    const finalDomainDisplay = createdMemorial.customDomain || `www.${slugifyArabic(createdMemorial.deceasedName)}-4digital.net`;

    const whatsappPaymentMessage = encodeURIComponent(
      `السلام عليكم ورحمة الله وبركاته،\nقمت بإنشاء صفحة تذكارية لـ: ${createdMemorial.deceasedName}\nعبر منصة أثر طيب بالباقة الشاملة (٢٠٠ جنيه مصري فقط).\nرابط/دومين الصفحة: ${finalDomainDisplay}\nمعرف الصفحة: ${createdMemorial.id}\n\nأود إرسال إيصال التحويل لتأكيد التفعيل الكامل.`
    );

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="text-3xl font-bold text-stone-900 font-quran">
            تم إنشاء الصفحة التذكارية بنجاح!
          </h2>

          <p className="text-sm text-stone-600 max-w-md mx-auto">
            تم إنشاء صفحة مباركة للمغفور له بإذن الله <strong className="text-emerald-900 font-bold">{createdMemorial.deceasedName}</strong>.
          </p>

          {/* Domain & Link Confirmation Box */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-right space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>عنوان ونطاق الصفحة:</span>
              </span>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                السعر: ٢٠٠ جنيه مصري فقط
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-300 font-mono text-xs sm:text-sm text-emerald-900 text-center font-bold tracking-wide select-all" dir="ltr">
              {finalDomainDisplay}
            </div>

            {/* 200 EGP Payment & Activation Box */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-emerald-50/50 rounded-2xl border border-amber-200 text-xs text-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
                <span className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                  <CreditCard className="w-4 h-4 text-emerald-800" />
                  <span>طرق السداد الميسر (٢٠٠ جنيه مصري فقط)</span>
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  تكلفة لمرة واحدة فقط
                </span>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed">
                يشمل السعر (٢٠٠ ج): حجز النطاق، الاستضافة السحابية الآمنة، قارئ القرآن والأذكار، ورمز الـ QR Code مدى الحياة.
              </p>

              {/* Payment Channels List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between shadow-2xs">
                  <div className="flex flex-col text-right">
                    <span className="text-stone-500 font-semibold">فودافون كاش:</span>
                    <span className="font-mono font-extrabold text-stone-900 text-xs mt-0.5 tracking-wide select-all" dir="ltr">
                      01005892886
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('01005892886');
                      setCopiedVodafone(true);
                      setTimeout(() => setCopiedVodafone(false), 2000);
                    }}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors border border-stone-200"
                  >
                    {copiedVodafone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVodafone ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between shadow-2xs">
                  <div className="flex flex-col text-right">
                    <span className="text-stone-500 font-semibold">إنستاباي InstaPay:</span>
                    <span className="font-mono font-extrabold text-stone-900 text-xs mt-0.5 select-all" dir="ltr">
                      ahammam251072@instapay
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('ahammam251072@instapay');
                      setCopiedInstapay(true);
                      setTimeout(() => setCopiedInstapay(false), 2000);
                    }}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors border border-stone-200"
                  >
                    {copiedInstapay ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedInstapay ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=201005892886&text=${whatsappPaymentMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-amber-300" />
                <span>إرسال إيصال التحويل عبر واتساب (01005892886) لتأكيد التفعيل</span>
              </a>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-amber-300" />
              <span>مشاركة الرابط والـ QR Code</span>
            </button>

            <button
              onClick={() => onNavigate('memorial', createdMemorial.id)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-emerald-700" />
              <span>زيارة الصفحة الآن</span>
            </button>
          </div>

          {showShareModal && (
            <ShareModal
              memorial={createdMemorial}
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Page Title & Price Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-950 text-xs sm:text-sm font-bold mb-3 border border-emerald-300 shadow-2xs">
          <Tag className="w-3.5 h-3.5 text-amber-600" />
          <span>سعر التطبيق: ٢٠٠ جنيه مصري فقط</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-quran">
          {editMemorial ? 'تعديل بيانات الفقيد' : 'اترك أثراً طيباً لفقيدك'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-lg mx-auto">
          أنشئ صفحة تذكارية مباركة تشمل الدومين والـ QR Code وسور القرآن والأذكار وأعمال الخير بسعر (٢٠٠ جنيه فقط).
        </p>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2 font-quran">
            <User className="w-5 h-5 text-emerald-700" />
            <span>البيانات الأساسية</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Title Prefix */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                اللقب التقديري:
              </label>
              <select
                value={titlePrefix}
                onChange={(e) => setTitlePrefix(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="المغفور له بإذن الله">المغفور له بإذن الله</option>
                <option value="المرحوم بإذن الله">المرحوم بإذن الله</option>
                <option value="المرحومة بإذن الله تعالى">المرحومة بإذن الله تعالى</option>
                <option value="المغفور لها بإذن الله">المغفور لها بإذن الله</option>
                <option value="شهيد الواجب والوطن">شهيد الواجب والوطن</option>
                <option value="الفقيد الغالي">الفقيد الغالي</option>
                <option value="الوالد الحبيب">الوالد الحبيب</option>
                <option value="الوالدة الحبيبة">الوالدة الحبيبة</option>
              </select>
            </div>

            {/* Deceased Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                اسم المتوفى <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={deceasedName}
                onChange={(e) => setDeceasedName(e.target.value)}
                placeholder="مثال: عبد الرحمن بن عبد الله آل فلان"
                maxLength={100}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none font-semibold text-stone-800"
              />
            </div>

          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>تاريخ الوفاة (ميلادي):</span>
              </label>
              <input
                type="date"
                value={dateOfDeath}
                onChange={(e) => setDateOfDeath(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-stone-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                التاريخ الهجري (اختياري):
              </label>
              <input
                type="text"
                value={hijriDate}
                onChange={(e) => setHijriDate(e.target.value)}
                placeholder="مثال: 15 رمضان 1445 هـ"
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                المدينة أو البلد (اختياري):
              </label>
              <input
                type="text"
                value={cityOrCountry}
                onChange={(e) => setCityOrCountry(e.target.value)}
                placeholder="مثال: الرياض، السعودية"
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Summary / Biography */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              نبذة قصيرة وسيرة عطرة عن المتوفى ومناقبه:
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={1500}
              placeholder="اكتب كلمات طيبة عن صفاته، حبه للخير، وصاياه، أو ذكريات جميلة تذكر الناس بفضله والدعاء له..."
              className="w-full p-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none resize-none leading-relaxed"
            />
            <div className="text-left text-[11px] text-stone-400 mt-1">
              {summary.length} / 1500 حرف
            </div>
          </div>

        </div>

        {/* Section 2: توجيه لاسم الدومين المراد حجزه مع التنويه عن السعر 200 ج */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 font-quran">
              <Globe className="w-5 h-5 text-emerald-700" />
              <span>اختيار رابط وعنوان المنصة</span>
            </h2>
            <span className="text-xs font-bold text-amber-950 bg-amber-200/90 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>السعر ٢٠٠ ج فقط</span>
            </span>
          </div>

          {/* توجيه لاسم الدومين المراد حجزه */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-300/80 shadow-xs space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-1.5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-800" />
                <span>اسم الدومين المراد حجزه لصفحة الفقيد:</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
                  placeholder="www.yourname-4digital.net"
                  className="w-full p-3.5 rounded-2xl border-2 border-amber-400 text-sm sm:text-base font-mono font-bold text-stone-900 bg-white text-left shadow-2xs focus:ring-2 focus:ring-emerald-700 outline-none"
                  dir="ltr"
                />
              </div>
              <span className="text-[11px] text-stone-600 mt-1.5 block">
                يقترح النظام تلقائياً اسماً مشتقاً من اسم المتوفى (مثال: <span className="font-mono text-emerald-900 font-semibold" dir="ltr">www.{slugifyArabic(deceasedName || 'yourname')}-4digital.net</span>)، ويمكنك تعديله أو تحديد أي اسم تريده.
              </span>
            </div>

            {/* التنويه عن السعر 200 ج */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200 text-xs text-stone-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>تنويه وقور بشأن الدومين والسعر (٢٠٠ ج فقط):</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-xs">
                السعر ٢٠٠ جنيه مصري فقط يُسدد لمرة واحدة، وهو يشمل بالكامل:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700 pt-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>حجز وتسجيل الدومين الرسمي المخصص باسم المتوفى</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>شهادة أمان وتشفير عالمية معتمدة SSL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>استضافة سحابية فائقة السرعة وآمنة مدى الحياة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>ربط الدومين برمز QR عالي الدقة لطباعة بطاقات العزاء</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Photo of Deceased or Islamic Symbol */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-lg font-bold text-stone-900 pb-2 flex items-center justify-between font-quran">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-700" />
              <span>صورة المتوفى أو صورة رمزية وقورة (اختيارية)</span>
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            {photoUrl ? (
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-700 shadow-md shrink-0">
                <img src={photoUrl} alt="صورة المتوفى" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-1 left-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-stone-200 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 shrink-0">
                <ImageIcon className="w-8 h-8 mb-1" />
                <span className="text-[10px]">لا توجد صورة</span>
              </div>
            )}

            <div className="space-y-3 flex-1 text-center sm:text-right">
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer shadow-2xs transition-colors">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>رفع صورة شخصية من جهازك</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-stone-400 mt-1">يتم ضغط الصورة تلقائياً لسرعة التحميل والحفاظ على الأمان.</p>
              </div>

              {/* Preset dignified symbols */}
              <div>
                <span className="text-xs text-stone-600 block mb-1.5 font-medium">أو اختر صورة رمزية وقورة:</span>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPhotoUrl(avatar.url)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-emerald-600 text-[11px] text-stone-600 transition-colors"
                    >
                      {avatar.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Custom Prayer */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-lg font-bold text-stone-900 pb-2 flex items-center gap-2 font-quran">
            <Heart className="w-5 h-5 text-emerald-700" />
            <span>الدعاء المختار للمتوفى</span>
          </h2>

          <textarea
            rows={3}
            value={customDuaa}
            onChange={(e) => setCustomDuaa(e.target.value)}
            maxLength={1000}
            className="w-full p-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none font-quran leading-relaxed"
            placeholder="الدعاء الذي يظهر في صدارة الصفحة..."
          />

          <div className="flex flex-wrap gap-2">
            {DECEASED_DUAAS.slice(0, 3).map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setCustomDuaa(d.text)}
                className="text-[11px] p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 text-right line-clamp-1"
              >
                {d.title}
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: Charity Works with Registered Organizations Dropdown */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 font-quran">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>أعمال الخير والصدقة الجارية داخل جمهورية مصر العربية</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowAddCharity(!showAddCharity)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عمل خيري من القائمة</span>
            </button>
          </div>

          {/* Educational Guide Box (شرح كيفية إضافة عمل خيري داخل جمهورية مصر العربية) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-stone-800 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-amber-950 font-quran text-sm">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>شرح ودليل ربط الصدقة الجارية بالجهات المعتمدة داخل جمهورية مصر العربية</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              حرصاً على مصداقية العمل الخيري وتوجيه التبرعات لمصارفها الشرعية الموثوقة 100%، توفر المنصة ربطاً رسمياً ومباشراً مع كافة المؤسسات والجمعيات الخيرية المشهرة بوزارة التضامن الاجتماعي في جمهورية مصر العربية:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
              <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">١. اختر الجهة المصرية المعتمدة</span>
                <span className="text-stone-600">اختر من القائمة إحدى المؤسسات المشهرة رسمياً (مثل: مصر الخير، الأورمان، بنك الطعام، مجدي يعقوب، 57357، بيت الزكاة بالأزهر، مستشفى بهية، مستشفى الناس، إلخ).</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">٢. تحديد مصرف الصدقة والخط الساخن</span>
                <span className="text-stone-600">اختر المجال (سقيا ماء، كفالة يتيم، علاج أورام، إطعام طعام، أسقف منازل) وسيتم إدراج رابط التبرع الرسمي ورقم الخط الساخن المباشر للمؤسسة تلقائياً.</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">٣. النشر ورمز الـ QR Code</span>
                <span className="text-stone-600">تظهر الصدقة الجارية في صفحة الفقيد وبطاقات العزاء المطبوعة، مما يتيح للأهل والمحبين المساهمة والتبرع المباشر باسم الفقيد وأجره مستمر بإذن الله.</span>
              </div>
            </div>
          </div>

          {/* Quick Egyptian Charity Selection Chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-700 block">اختيار سريع لأشهر الجهات الخيرية المعتمدة في مصر:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'eg-misr-el-kheir', label: 'مصر الخير (سقيا وتكافل)' },
                { id: 'eg-orman', label: 'الأورمان (أيتام وقلب)' },
                { id: 'eg-efb', label: 'بنك الطعام المصري' },
                { id: 'eg-magdi-yacoub', label: 'مجدي يعقوب للقلب' },
                { id: 'eg-57357', label: 'مستشفى 57357' },
                { id: 'eg-azhar-zakat', label: 'بيت الزكاة (الأزهر)' },
                { id: 'eg-baheya', label: 'مستشفى بهية' },
                { id: 'eg-al-nas', label: 'مستشفى الناس للأطفال' },
                { id: 'eg-cure-bank', label: 'بنك الشفاء المصري' },
                { id: 'eg-resala', label: 'جمعية رسالة' },
                { id: 'eg-ahl-masr', label: 'أهل مصر للحروق' },
                { id: 'eg-shefaa-orman', label: 'شفاء الأورمان بالصعيد' }
              ].map(chip => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setShowAddCharity(true);
                    handleCharityPresetChange(chip.id);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    selectedCharityPresetId === chip.id
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add Charity Subform with Complete Organizations Dropdown */}
          {showAddCharity && (
            <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-800" />
                  <span>إضافة مشروع صدقة جارية من قائمة الجهات الخيرية المعتمدة في مصر</span>
                </h3>
                <span className="text-[11px] text-emerald-800 font-medium">مؤسسات مشهرة بوزارة التضامن الاجتماعي</span>
              </div>

              {/* Required Dropdown: جميع الجهات التي تقدم الخدمة */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  اختر المؤسسة الخيرية المعتمدة في جمهورية مصر العربية:
                </label>
                <select
                  value={selectedCharityPresetId}
                  onChange={(e) => handleCharityPresetChange(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-emerald-600 text-xs sm:text-sm bg-white font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-700 outline-none"
                >
                  <option value="">-- اضغط هنا لاختيار الجهة الخيرية المعتمدة --</option>
                  
                  <optgroup label="🇪🇬 جمهورية مصر العربية (جهات معتمدة رسمياً ومشهرة بوزارة التضامن)">
                    {REGISTERED_CHARITIES.filter(c => c.country === 'جمهورية مصر العربية').map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.phone ? `(الخط الساخن: ${c.phone})` : ''} - {c.categoryLabel}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="المملكة العربية السعودية والخليج">
                    {REGISTERED_CHARITIES.filter(c => c.country === 'المملكة العربية السعودية').map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.categoryLabel}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="جهات دولية وإسلامية عامة">
                    {REGISTERED_CHARITIES.filter(c => c.country === 'دولية / أخرى').map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.categoryLabel}
                      </option>
                    ))}
                  </optgroup>

                  <option value="custom_other">جهة خيرية أخرى معتمدة (كتابة يدوية مخصصة)...</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">اسم العمل الخيري / المشروع:</label>
                  <input
                    type="text"
                    value={newCharityTitle}
                    onChange={(e) => setNewCharityTitle(e.target.value)}
                    placeholder="مثال: حفر بئر ارتوازي، كفالة يتيم..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">اسم الجهة الخيرية المرخصة:</label>
                  <input
                    type="text"
                    value={newCharityOrg}
                    onChange={(e) => setNewCharityOrg(e.target.value)}
                    placeholder="اسم المؤسسة..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">تصنيف الصدقة الجارية:</label>
                  <select
                    value={newCharityCategory}
                    onChange={(e) => setNewCharityCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="water">سقيا ماء وحفر آبار</option>
                    <option value="food">إطعام طعام وسلال غذائية</option>
                    <option value="orphan">كفالة أيتام وأسر متعففة</option>
                    <option value="health">علاج ورعاية صحية</option>
                    <option value="quran">طباعة ونشر مصاحف</option>
                    <option value="mosque">بناء ورعاية مساجد</option>
                    <option value="waqf">وقف خيري مستمر</option>
                    <option value="other">عمل خيري آخر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">رابط الجهة الرسمي (الموقع الإلكتروني):</label>
                  <input
                    type="url"
                    value={newCharityUrl}
                    onChange={(e) => setNewCharityUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">تفاصيل إضافية عن المشروع:</label>
                <textarea
                  rows={2}
                  value={newCharityDesc}
                  onChange={(e) => setNewCharityDesc(e.target.value)}
                  placeholder="وصف مختصر لمشروع الصدقة الجارية..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCharity(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddCharity}
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 shadow-2xs"
                >
                  إضافة المشروع للصفحة
                </button>
              </div>
            </div>
          )}

          {/* List of Added Charities */}
          {charityProjects.length > 0 ? (
            <div className="space-y-2">
              {charityProjects.map((p) => (
                <div key={p.id} className="p-3.5 rounded-2xl border border-stone-200 bg-white flex items-center justify-between shadow-2xs">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{p.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      الجهة: <span className="text-emerald-800 font-bold">{p.organizationName}</span>
                    </p>
                    {p.description && <p className="text-xs text-stone-600 mt-0.5">{p.description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCharity(p.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 border border-dashed border-stone-300 rounded-2xl text-xs text-stone-400 bg-stone-50/50">
              لم تتم إضافة أعمال خير بعد (اضغط "إضافة عمل خيري من القائمة" للاختيار من بنك الطعام، الأورمان، مصر الخير، إحسان، وغيرها)
            </div>
          )}
        </div>

        {/* Section 6: Additional Gallery Images */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="text-lg font-bold text-stone-900 pb-2 flex items-center gap-2 font-quran">
            <ImageIcon className="w-5 h-5 text-emerald-700" />
            <span>صور وذكريات إضافية (اختياري - حتى 6 صور)</span>
          </h2>

          <div className="flex flex-wrap gap-3 items-center">
            {galleryImages.map((img, index) => (
              <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-300">
                <img src={img} alt="صورة إضافية" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))}
                  className="absolute top-1 left-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            {galleryImages.length < 6 && (
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-600 flex flex-col items-center justify-center text-stone-400 hover:text-emerald-700 cursor-pointer bg-stone-50 transition-colors">
                <Plus className="w-5 h-5" />
                <span className="text-[10px] mt-1">إضافة صورة</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Section 7: Options */}
        <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
          <input
            type="checkbox"
            id="allowPublicDuaa"
            checked={allowPublicDuaa}
            onChange={(e) => setAllowPublicDuaa(e.target.checked)}
            className="w-4 h-4 text-emerald-800 rounded-sm focus:ring-emerald-700"
          />
          <label htmlFor="allowPublicDuaa" className="text-xs font-semibold text-stone-700 cursor-pointer">
            السماح للزوار بكتابة دعوات جديدة تظهر في صفحة المتوفى
          </label>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Price Order Card inside Form */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-stone-50 to-amber-50/50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <span className="text-xs font-bold text-emerald-950 flex items-center justify-center sm:justify-start gap-1.5">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>باقة أثر طيب الشاملة (٢٠٠ جنيه فقط)</span>
            </span>
            <p className="text-[11px] text-stone-600">
              سعر شامل يشمل الصفحة، وحجز النطاق، والـ QR Code، والاستضافة الدائمة مدى الحياة.
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold">
              السداد عبر فودافون كاش: <span dir="ltr" className="font-mono font-bold">01005892886</span> • إنستاباي: <span dir="ltr" className="font-mono font-bold">ahammam251072@instapay</span>
            </p>
          </div>
          <div className="text-center sm:text-left shrink-0">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-3xl font-extrabold text-emerald-900 font-sans">200</span>
              <span className="text-xs font-bold text-stone-700">جنيه مصري</span>
            </div>
            <span className="text-[10px] text-stone-400">سعر لمرة واحدة</span>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>جاري حفظ الصفحة وإنشاء الـ QR...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
                <span>
                  {editMemorial 
                    ? 'حفظ التعديلات' 
                    : 'إنشاء الصفحة الآن'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50"
          >
            إلغاء
          </button>
        </div>

      </form>

    </div>
  );
};
