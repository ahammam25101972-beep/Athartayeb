import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { memorialService } from '../services/memorialService';

interface ReportModalProps {
  memorialId: string;
  memorialName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  memorialId,
  memorialName,
  isOpen,
  onClose
}) => {
  const [reason, setReason] = useState('محتوى غير لائق أو مخالف');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await memorialService.submitReport(memorialId, memorialName, reporterName, reason, details);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('حدث خطأ أثناء إرسال البلاغ.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center mb-3 border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-quran">
            إبلاغ عن محتوى الصفحة
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {memorialName}
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <p className="font-bold text-stone-900">تم استلام بلاغك بنجاح</p>
            <p className="text-xs text-stone-500">سيقوم فريق الإشراف بمراجعة الصفحة واتخاذ الإجراء اللازم.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                سبب البلاغ:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              >
                <option value="محتوى غير لائق أو مخالف">محتوى غير لائق أو مخالف للآداب</option>
                <option value="بيانات خاطئة أو منتحلة">بيانات غير صحيحة أو منتحلة لشخص آخر</option>
                <option value="روابط مشبوهة أو احتيال">روابط خارجية غير موثوقة أو احتيالية</option>
                <option value="طلب من ذوي المتوفى للحذف">طلب من ذوي المتوفى لحذف الصفحة</option>
                <option value="أخرى">سبب آخر</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                تفاصيل البلاغ (اختياري):
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={400}
                placeholder="وضح المشكلة لمساعدة المشرفين..."
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                اسمك أو وسيلة تواصل (اختياري):
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="فاعل خير"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال البلاغ للإدارة</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
