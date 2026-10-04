import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { Memorial } from '../types';
import { SiteLogo } from './SiteLogo';
import { cleanDeceasedName } from '../services/memorialService';

interface DedicatedQrSectionProps {
  memorial: Memorial;
  onOpenShareModal?: () => void;
}

export const DedicatedQrSection: React.FC<DedicatedQrSectionProps> = ({ 
  memorial,
  onOpenShareModal
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  const domainUrl = memorial.customDomain 
    ? (memorial.customDomain.startsWith('http') ? memorial.customDomain : `https://${memorial.customDomain}`)
    : `${window.location.origin}/#${memorial.id}`;

  const displayDomain = memorial.customDomain || `www.${memorial.id}-4digital.net`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        domainUrl,
        {
          width: 200,
          margin: 2,
          color: {
            dark: '#14362A', // Dark emerald
            light: '#FFFFFF'
          }
        },
        (error) => {
          if (!error) setQrLoaded(true);
        }
      );
    }
  }, [domainUrl]);

  const handleDownloadQr = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QR_${memorial.deceasedName}_athar_tayyib.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-md relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        
        {/* QR Code Canvas Card */}
        <div className="shrink-0 text-center">
          <div className="p-3.5 bg-white rounded-2xl shadow-lg border-2 border-emerald-800/20 inline-block relative group">
            <canvas ref={canvasRef} className="rounded-xl w-40 h-40 sm:w-44 sm:h-44 block" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-white/95 rounded-full p-1 shadow-md border border-amber-300">
                <SiteLogo size={32} />
              </div>
            </div>
          </div>
          <span className="block text-[11px] text-stone-500 font-mono mt-2 font-bold" dir="ltr">
            {displayDomain}
          </span>
        </div>

        {/* QR Information & Value Props */}
        <div className="flex-1 text-center md:text-right space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <QrCode className="w-3.5 h-3.5 text-amber-700" />
            <span>رمز الاستجابة السريعة (QR Code) الدائم</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-quran">
            امسح الرمز للدخول السريع لصفحة {cleanDeceasedName(memorial.deceasedName)}
          </h3>

          <p className="text-sm text-stone-600 leading-relaxed">
            هذا الرمز مخصص ومربوط مباشرة بالدومين الخاص (<span className="font-mono font-bold text-emerald-900" dir="ltr">{displayDomain}</span>). يمكنك تحميله وطباعته في لافتات العزاء، بطاقات الصدقة الجارية، أو توزيعه على الأهل لسهولة قراءة القرآن والدعاء.
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <button
              onClick={handleDownloadQr}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تحميل رمز QR عالي الدقة</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-stone-600" />}
              <span>{copied ? 'تم نسخ الرابط' : 'نسخ رابط الدومين'}</span>
            </button>

            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة لافتة العزاء والمشاركة</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
