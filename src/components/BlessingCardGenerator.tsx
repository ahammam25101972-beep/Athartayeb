import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Share2, Sparkles, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';
import { Memorial } from '../types';
import { cleanDeceasedName } from '../services/memorialService';

interface BlessingCardGeneratorProps {
  memorial: Memorial;
}

const TEMPLATES = [
  { id: 'parchment', name: 'البردي والذهب', bg: '#FAF6EE', border: '#C5A059', textColor: '#2A2318', accent: '#8C6226' },
  { id: 'emerald', name: 'الزمردي الوقور', bg: '#0F2B22', border: '#D4AF37', textColor: '#FFFFFF', accent: '#E5C07B' },
  { id: 'navy', name: 'الكحلي والريحان', bg: '#101F28', border: '#629CB9', textColor: '#FFFFFF', accent: '#97CDED' }
];

const PRESET_DUAS = [
  'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ.',
  'اللَّهُمَّ اجْعَلْ قَبْرَهُ رَوْضَةً مِنْ رِيَاضِ الجَنَّةِ، وَأَسْكِنْهُ الفِرْدَوْسَ الأَعْلَى.',
  'اللَّهُمَّ بَيِّضْ وَجْهَهُ يَوْمَ تَبْيَضُّ وُجُوهٌ، وَيَسِّرْ حِسَابَهُ، وَيَمِّنْ كِتَابَهُ.',
  'اللَّهُمَّ اجْزِهِ عَنَّا خَيْرَ الجَزَاءِ، وَاجْمَعْنَا بِهِ فِي مُسْتَقَرِّ رَحْمَتِكَ.'
];

export const BlessingCardGenerator: React.FC<BlessingCardGeneratorProps> = ({ memorial }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('parchment');
  const [selectedDuaa, setSelectedDuaa] = useState(PRESET_DUAS[0]);
  const [senderName, setSenderName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const displayDomain = memorial.customDomain || `www.${memorial.id}-4digital.net`;
  const domainUrl = memorial.customDomain 
    ? (memorial.customDomain.startsWith('http') ? memorial.customDomain : `https://${memorial.customDomain}`)
    : `${window.location.origin}/#${memorial.id}`;

  const generateCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGenerating(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const tmpl = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

    // Background
    ctx.fillStyle = tmpl.bg;
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.strokeStyle = tmpl.border;
    ctx.lineWidth = 14;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.strokeStyle = tmpl.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(54, 54, width - 108, height - 108);

    // Corner Islamic accents
    const drawCorner = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = tmpl.accent;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawCorner(54, 54);
    drawCorner(width - 54, 54);
    drawCorner(54, height - 54);
    drawCorner(width - 54, height - 54);

    // Header Calligraphy: صدقة جارية
    ctx.fillStyle = tmpl.accent;
    ctx.font = 'bold 36px "Amiri", serif';
    ctx.textAlign = 'center';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, 130);

    ctx.font = 'bold 32px "Amiri", serif';
    ctx.fillText('«صَدَقَةٌ جَارِيَةٌ وَدُعَاءٌ لِرُوحِ الفَقِيدِ»', width / 2, 190);

    // Deceased Name
    ctx.fillStyle = tmpl.textColor;
    ctx.font = 'bold 58px "Amiri", serif';
    const fullName = `${memorial.titlePrefix || 'المغفور له بإذن الله'} / ${cleanDeceasedName(memorial.deceasedName)}`;
    ctx.fillText(fullName, width / 2, 280);

    // Divider
    ctx.strokeStyle = tmpl.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 220, 320);
    ctx.lineTo(width / 2 + 220, 320);
    ctx.stroke();

    // Duaa Box
    ctx.font = 'normal 38px "Amiri", serif';
    ctx.fillStyle = tmpl.textColor;
    
    // Wrap Duaa Text
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x, currentY);
    };

    wrapText(selectedDuaa, width / 2, 420, 840, 64);

    // Sender Name
    if (senderName.trim()) {
      ctx.font = 'italic 30px "Amiri", serif';
      ctx.fillStyle = tmpl.accent;
      ctx.fillText(`مُهدى من: ${senderName.trim()}`, width / 2, 690);
    }

    // Generate and draw QR Code
    try {
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, domainUrl, {
        width: 170,
        margin: 1,
        color: {
          dark: tmpl.id === 'parchment' ? '#14362A' : '#0B1A20',
          light: '#FFFFFF'
        }
      });
      // Draw QR Box
      const qrX = width / 2 - 85;
      const qrY = 740;
      ctx.drawImage(qrCanvas, qrX, qrY, 170, 170);

      // Domain Text under QR
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = tmpl.accent;
      ctx.fillText(displayDomain, width / 2, 950);

      // Footer branding
      ctx.font = '22px "Amiri", serif';
      ctx.fillStyle = tmpl.id === 'parchment' ? '#7A6B56' : '#A0AEC0';
      ctx.fillText('منصة أثر طيب - صدقة جارية لروح الفقيد', width / 2, 995);
    } catch (err) {
      console.error(err);
    }

    setPreviewUrl(canvas.toDataURL('image/png'));
    setIsGenerating(false);
  };

  useEffect(() => {
    generateCard();
  }, [selectedTemplate, selectedDuaa, senderName]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `بطاقة_دعاء_${memorial.deceasedName}.png`;
    a.click();
  };

  const handleShareWhatsApp = () => {
    const text = `بطاقة دعاء لروح: ${memorial.deceasedName}\n«${selectedDuaa}»\nزوروا صفحة الصدقة الجارية والدومين الخاص: ${displayDomain}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold mb-2">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-800" />
          <span>مولّد بطاقات الدعاء والإهداء</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-quran">
          صمِّم بطاقة دعاء لروح {memorial.deceasedName} وشاركها
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          أنشئ صورة وقورة جاهزة للواتساب وفيسبوك بنقرة واحدة مع رمز الـ QR والدومين المخصص بدون أي إنترنت خارجي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="space-y-5">
          
          {/* Template Color Theme */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              اختر مظهر البطاقة:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-600/30'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div 
                    className="w-full h-5 rounded-lg mb-1.5 border border-stone-300"
                    style={{ backgroundColor: tmpl.bg }}
                  ></div>
                  <span>{tmpl.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preset Duas */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              اختر نص الدعاء أو اكتب دعاءك:
            </label>
            <div className="space-y-2 mb-3">
              {PRESET_DUAS.map((duaa, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDuaa(duaa)}
                  className={`w-full text-right p-3 rounded-xl border text-xs leading-relaxed transition-colors ${
                    selectedDuaa === duaa
                      ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950'
                      : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                  }`}
                >
                  «{duaa}»
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={selectedDuaa}
              onChange={(e) => setSelectedDuaa(e.target.value)}
              placeholder="اكتب دعاءً مخصصاً من قلبك..."
              className="w-full p-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-700 outline-none leading-relaxed"
            />
          </div>

          {/* Sender Name */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              اسم المُهدي (اختياري يظهر أسفل البطاقة):
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="مثال: محب للفقيد / ابنه البار / عائلة فلان"
              className="w-full p-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-700 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تحميل البطاقة كصورة (PNG)</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة عبر واتساب</span>
            </button>
          </div>

        </div>

        {/* Live Preview Column */}
        <div className="flex flex-col items-center justify-center bg-stone-50 p-6 rounded-3xl border border-stone-200 text-center">
          <span className="text-xs font-bold text-stone-500 mb-3 block">
            معاينة البطاقة الفورية:
          </span>

          <div className="max-w-[320px] sm:max-w-[360px] w-full rounded-2xl shadow-xl overflow-hidden border-2 border-amber-300/60 bg-white">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="بطاقة دعاء" 
                className="w-full h-auto block"
              />
            ) : (
              <div className="aspect-square flex items-center justify-center text-xs text-stone-400">
                جارٍ تصميم البطاقة...
              </div>
            )}
          </div>

          {/* Hidden Canvas used for high resolution rendering */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

      </div>

    </div>
  );
};
