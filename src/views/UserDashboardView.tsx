import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Share2, 
  QrCode, 
  Eye, 
  Heart, 
  Sparkles, 
  ExternalLink, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Memorial } from '../types';
import { memorialService, cleanDeceasedName } from '../services/memorialService';
import { ShareModal } from '../components/ShareModal';

export const UserDashboardView: React.FC<{
  onNavigate: (view: string, id?: string) => void;
}> = ({ onNavigate }) => {
  const { user, signInWithGoogle, signInDemo } = useAuth();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareMemorial, setShareMemorial] = useState<Memorial | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const myMemorials = await memorialService.getUserMemorials(user.uid);
        setMemorials(myMemorials);
      } catch (e) {
        console.error('Error fetching user memorials:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف صفحة "${name}" نهائياً؟`)) {
      return;
    }
    try {
      await memorialService.deleteMemorial(id);
      setMemorials(memorials.filter(m => m.id !== id));
    } catch (e) {
      console.error('Error deleting memorial:', e);
      alert('حدث خطأ أثناء حذف الصفحة.');
    }
  };

  const handleCopyLink = (id: string) => {
    const url = window.location.origin + '?page=memorial&id=' + id;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center bg-white rounded-3xl border border-stone-200 shadow-sm mt-10 space-y-4">
        <LayoutDashboard className="w-16 h-16 text-emerald-800 mx-auto" />
        <h2 className="text-2xl font-bold text-stone-900 font-quran">تسجيل الدخول إلى لوحة التحكم</h2>
        <p className="text-xs text-stone-500">
          سجل دخولك لتتمكن من إدارة صفحاتك التذكارية، ومتابعة الدعوات والزيارات، وتحميل الـ QR Code.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
          >
            دخول عبر حساب Google
          </button>
          <button
            onClick={() => signInDemo()}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors"
          >
            دخول سريع (فاعل خير)
          </button>
        </div>
      </div>
    );
  }

  // Summary Metrics
  const totalVisits = memorials.reduce((acc, m) => acc + (m.visitCount || 0), 0);
  const totalPrayers = memorials.reduce((acc, m) => acc + (m.prayerCount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-quran">
            لوحة تحكم صفحاتي التذكارية
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            مرحباً بك، <strong className="text-stone-800">{user.displayName || user.email}</strong>. يمكنك من هنا إدارة صفحاتك ومتابعة الدعوات.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create')}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>إنشاء صفحة جديدة</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">إجمالي الصفحات التي أنشأتها</p>
            <p className="text-2xl font-extrabold text-stone-900 font-sans mt-1">{memorials.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">إجمالي الدعوات المسجلة</p>
            <p className="text-2xl font-extrabold text-emerald-800 font-sans mt-1">{totalPrayers}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-emerald-800/20" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">إجمالي الزيارات</p>
            <p className="text-2xl font-extrabold text-stone-800 font-sans mt-1">{totalVisits}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Memorials List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-quran">صفحاتك المنشأة</h2>

        {loading ? (
          <div className="p-12 text-center text-xs text-stone-400">جاري تحميل بيانات صفحاتك...</div>
        ) : memorials.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {memorials.map((memorial) => (
              <div
                key={memorial.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    {memorial.photoUrl ? (
                      <img src={memorial.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-emerald-950 flex items-center justify-center text-amber-300 font-quran text-xs">
                        أثر طيب
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {memorial.titlePrefix || 'المغفور له'}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-quran">
                      {cleanDeceasedName(memorial.deceasedName)}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                        <Heart className="w-3.5 h-3.5" />
                        {memorial.prayerCount || 0} دعوة
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {memorial.visitCount || 0} زيارة
                      </span>
                    </div>

                    {/* Domain address tag */}
                    <div className="pt-1 text-[11px] font-mono text-stone-600 flex items-center gap-2" dir="ltr">
                      <span className="font-semibold text-emerald-900">
                        {memorial.customDomain || `www.${memorial.id}-4digital.net`}
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md font-sans font-bold">
                        دومين خاص (السعر 200 ج)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
                  {/* Visit */}
                  <button
                    onClick={() => onNavigate('memorial', memorial.id)}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>عرض</span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onNavigate('create', memorial.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  {/* Share & QR */}
                  <button
                    onClick={() => setShareMemorial(memorial)}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-700" />
                    <span>QR والمشاركة</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => handleCopyLink(memorial.id)}
                    className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs transition-colors"
                    title="نسخ الرابط"
                  >
                    {copiedId === memorial.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(memorial.id, memorial.deceasedName)}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-600 text-xs transition-colors"
                    title="حذف الصفحة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 space-y-3">
            <LayoutDashboard className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-800 font-quran">لم تنشئ أي صفحة بعد</p>
            <p className="text-xs text-stone-500">ابدأ بإنشاء صفحة تذكارية لفقيدك واجمع له الدعوات والصدقات الجارية.</p>
            <button
              onClick={() => onNavigate('create')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-700"
            >
              أنشئ صفحة جديدة الآن
            </button>
          </div>
        )}
      </div>

      {shareMemorial && (
        <ShareModal
          memorial={shareMemorial}
          isOpen={!!shareMemorial}
          onClose={() => setShareMemorial(null)}
        />
      )}

    </div>
  );
};
