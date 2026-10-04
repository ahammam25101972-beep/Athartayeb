import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Share2, 
  MessageCircle, 
  Sparkles,
  QrCode,
  Globe
} from 'lucide-react';
import { Memorial } from '../types';
import { cleanDeceasedName } from '../services/memorialService';

interface ShareModalProps {
  memorial: Memorial;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ memorial, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');

  const cleanName = cleanDeceasedName(memorial.deceasedName);
  const directPageUrl = window.location.origin + '?page=memorial&id=' + memorial.id;
  
  const displayUrl = memorial.customDomain || `www.${memorial.id}-4digital.net`;

  const whatsappMessage = encodeURIComponent(
    `نسألكم الدعاء وقراءة ما تيسر من القرآن والذكر للمغفور له بإذن الله:\n*${cleanName}*\n\nصدقة جارية ودعاء مستمر عبر منصة أثر طيب:\n${displayUrl}`
  );

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        directPageUrl,
        {
          width: 260,
          margin: 2,
          color: {
            dark: '#064e3b', // Deep emerald
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
          if (canvasRef.current) {
            setQrUrl(canvasRef.current.toDataURL('image/png'));
          }
        }
      );
    }
  }, [isOpen, directPageUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(directPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  const handleDownloadQR = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `QR_${cleanName.replace(/\s+/g, '_')}_AtharTayyib.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `صدقة جارية عن روح ${cleanName} | أثر طيب`,
          text: `نسألكم الدعاء للمغفور له بإذن الله ${cleanName}`,
          url: directPageUrl
        });
      } catch (e) {
        console.log('Share canceled or failed', e);
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center mb-3 border border-emerald-100 shadow-xs">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-quran">
            مشاركة الصفحة والـ QR Code
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            صدقة جارية عن روح {cleanName}
          </p>
        </div>

        {/* Domain Badge Bar */}
        <div className="mb-4 p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-stone-700">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>عنوان الصفحة:</span>
            <span className="font-mono font-bold text-emerald-900" dir="ltr">{displayUrl}</span>
          </div>
          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
            دومين خاص (السعر ٢٠٠ ج)
          </span>
        </div>

        {/* QR Code Presentation Box */}
        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col items-center justify-center mb-6 text-center">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-stone-100 mb-3">
            <canvas ref={canvasRef} className="rounded-lg max-w-full h-auto" />
          </div>
          <span className="text-xs text-stone-600 font-medium flex items-center gap-1.5 mb-3">
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            امسح الرمز بكاميرا الهاتف للوصول السريع والدعاء
          </span>
          
          <div className="flex flex-wrap items-center justify-center gap-2 w-full">
            <button
              onClick={handleDownloadQR}
              className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              تحميل الرمز (PNG)
            </button>
            <button
              onClick={handlePrintCard}
              className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              طباعة بطاقة العزاء
            </button>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-3">
          
          {/* WhatsApp Direct Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            مشاركة سريعة عبر واتساب WhatsApp
          </a>

          {/* Direct Copy Link */}
          <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl border border-stone-200">
            <input
              type="text"
              readOnly
              value={directPageUrl}
              className="flex-1 bg-transparent px-3 text-xs text-stone-600 focus:outline-none truncate font-mono"
              dir="ltr"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white hover:bg-stone-200 text-stone-800 shadow-2xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  نسخ الرابط
                </>
              )}
            </button>
          </div>

          {/* Web Share API */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-emerald-700" />
              مشاركة عبر تطبيقات أخرى في الجهاز
            </button>
          )}

        </div>

        {/* Friendly note */}
        <p className="text-[11px] text-stone-400 text-center mt-5">
          قال رسول الله ﷺ: «الدَّالُّ عَلَى الْخَيْرِ كَفَاعِلِهِ». شارك الصفحة لتكون صدقة جارية ونوراً في قبره.
        </p>
      </div>
    </div>
  );
};
