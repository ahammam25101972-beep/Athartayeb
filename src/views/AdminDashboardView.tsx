import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  FileText, 
  Eye, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Memorial, Report } from '../types';
import { memorialService, cleanDeceasedName } from '../services/memorialService';

export const AdminDashboardView: React.FC<{
  onNavigate: (view: string, id?: string) => void;
}> = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pages' | 'reports'>('pages');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const allMems = await memorialService.adminGetAllMemorials();
        setMemorials(allMems);
        const allReps = await memorialService.adminGetReports();
        setReports(allReps);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center bg-white rounded-3xl border border-stone-200 mt-10 space-y-4">
        <ShieldAlert className="w-16 h-16 text-amber-600 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 font-quran">لوحة تحكم الإدارة محصورة بالمشرفين</h2>
        <p className="text-xs text-stone-500">
          هذه الصفحة مخصصة لمدير المنصة والمشرفين لمراجعة المحتوى وإدارة البلاغات.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const handleToggleSuspend = async (memorialId: string, currentSuspended: boolean) => {
    try {
      await memorialService.adminSetSuspension(memorialId, !currentSuspended);
      setMemorials(memorials.map(m => m.id === memorialId ? { ...m, isSuspended: !currentSuspended } : m));
    } catch (e) {
      console.error('Error toggling suspension:', e);
      alert('حدث خطأ أثناء تعديل حالة الصفحة.');
    }
  };

  const handleDelete = async (memorialId: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف صفحة "${name}" نهائياً من قاعدة البيانات؟`)) return;
    try {
      await memorialService.deleteMemorial(memorialId);
      setMemorials(memorials.filter(m => m.id !== memorialId));
    } catch (e) {
      console.error('Error deleting memorial:', e);
      alert('حدث خطأ أثناء حذف الصفحة.');
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      await memorialService.adminUpdateReportStatus(reportId, status);
      setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
    } catch (e) {
      console.error('Error resolving report:', e);
      alert('حدث خطأ أثناء تحديث حالة البلاغ.');
    }
  };

  const totalVisits = memorials.reduce((acc, m) => acc + (m.visitCount || 0), 0);
  const totalPrayers = memorials.reduce((acc, m) => acc + (m.prayerCount || 0), 0);
  const pendingReports = reports.filter(r => r.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>صلاحية إدارة عامة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-quran">
            لوحة الإشراف والإدارة العامة
          </h1>
          <p className="text-xs text-stone-500">
            متابعة إحصائيات المنصة، فحص الصفحات، ومراجعة تبليغات الزوار.
          </p>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs text-stone-500">إجمالي الصفحات</p>
          <p className="text-2xl font-bold text-stone-900 font-sans mt-1">{memorials.length}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs text-stone-500">إجمالي الدعوات</p>
          <p className="text-2xl font-bold text-emerald-800 font-sans mt-1">{totalPrayers}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs text-stone-500">إجمالي الزيارات</p>
          <p className="text-2xl font-bold text-stone-800 font-sans mt-1">{totalVisits}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs text-stone-500">التبليغات المعلقة</p>
          <p className="text-2xl font-bold text-amber-700 font-sans mt-1">{pendingReports.length}</p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('pages')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'pages' ? 'border-emerald-800 text-emerald-800' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          إدارة ومراقبة الصفحات ({memorials.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports' ? 'border-amber-700 text-amber-800' : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>مراجعة البلاغات</span>
          {pendingReports.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-sans">
              {pendingReports.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Pages Management */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                  <tr>
                    <th className="p-4 font-semibold">المتوفى</th>
                    <th className="p-4 font-semibold">المنشئ</th>
                    <th className="p-4 font-semibold">تاريخ الوفاة</th>
                    <th className="p-4 font-semibold">التفاعل</th>
                    <th className="p-4 font-semibold">الحالة</th>
                    <th className="p-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {memorials.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            {m.photoUrl ? (
                              <img src={m.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full bg-emerald-950 flex items-center justify-center text-amber-300 text-[10px]">
                                أثر
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block font-quran text-sm">{cleanDeceasedName(m.deceasedName)}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{m.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-stone-600">
                        {m.creatorName || m.userId.substring(0, 8)}
                      </td>

                      <td className="p-4 text-stone-500">
                        {m.dateOfDeath || 'غير محدد'}
                      </td>

                      <td className="p-4 text-stone-600">
                        <span className="text-emerald-800 font-semibold">{m.prayerCount || 0} د</span> / 
                        <span> {m.visitCount || 0} ز</span>
                      </td>

                      <td className="p-4">
                        {m.isSuspended ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            موقوفة
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            نشطة
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onNavigate('memorial', m.id)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                            title="معاينة"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleSuspend(m.id, !!m.isSuspended)}
                            className={`p-1.5 rounded-lg text-xs font-semibold ${
                              m.isSuspended
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title={m.isSuspended ? 'إعادة التفعيل' : 'إيقاف الصفحة مؤقتاً'}
                          >
                            {m.isSuspended ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDelete(m.id, m.deceasedName)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                            title="حذف نهائي"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Reports Review */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                        {r.reason}
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(r.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 pt-1">
                      الصفحة المبلّغ عنها: <button onClick={() => onNavigate('memorial', r.memorialId)} className="text-emerald-800 hover:underline">{r.memorialName}</button>
                    </h4>

                    {r.details && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        التفاصيل: {r.details}
                      </p>
                    )}

                    <span className="text-[11px] text-stone-400 block">المبلّغ: {r.reporterName}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
                      r.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      r.status === 'dismissed' ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status === 'resolved' ? 'تم الحل' : r.status === 'dismissed' ? 'مرفوض' : 'معلق'}
                    </span>

                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleResolveReport(r.id, 'resolved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold"
                        >
                          حل البلاغ
                        </button>
                        <button
                          onClick={() => handleResolveReport(r.id, 'dismissed')}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
                        >
                          تجاهل
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-xs text-stone-400">
              لا توجد أي بلاغات حالياً بحمد الله.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
