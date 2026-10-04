import React from 'react';
import { Calendar, MapPin, Eye, Heart, Share2, Sparkles, BookOpen } from 'lucide-react';
import { Memorial } from '../types';
import { cleanDeceasedName } from '../services/memorialService';

interface MemorialCardProps {
  memorial: Memorial;
  onOpen: (id: string) => void;
  onShare: (memorial: Memorial, e: React.MouseEvent) => void;
}

export const MemorialCard: React.FC<MemorialCardProps> = ({ memorial, onOpen, onShare }) => {
  const displayName = cleanDeceasedName(memorial.deceasedName);

  return (
    <div 
      onClick={() => onOpen(memorial.id)}
      className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:border-emerald-300 relative"
    >
      {/* Header Image or Reverent Banner */}
      <div className="h-44 w-full bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 relative overflow-hidden flex items-center justify-center">
        {memorial.photoUrl ? (
          <img 
            src={memorial.photoUrl} 
            alt={displayName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-center p-6 text-stone-300">
            <div className="w-16 h-16 rounded-full bg-emerald-800/80 mx-auto flex items-center justify-center text-amber-300 mb-2 border border-emerald-700/60 shadow-inner">
              <BookOpen className="w-8 h-8 opacity-80" />
            </div>
            <span className="text-xs text-amber-200/80 font-quran">صدقة جارية ودعاء مستمر</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
        
        {/* Title Prefix Badge */}
        <div className="absolute bottom-3 right-4 text-xs font-semibold text-amber-300 drop-shadow-sm font-quran">
          {memorial.titlePrefix || 'المغفور له بإذن الله'}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Deceased Name */}
          <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2 font-quran leading-tight">
            {displayName}
          </h3>

          {/* Dates & Location */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-stone-500 mb-3.5">
            {memorial.dateOfDeath && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{memorial.dateOfDeath}</span>
                {memorial.hijriDate && <span className="text-stone-400">({memorial.hijriDate})</span>}
              </div>
            )}
            {memorial.cityOrCountry && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{memorial.cityOrCountry}</span>
              </div>
            )}
          </div>

          {/* Short Excerpt */}
          {memorial.summary && (
            <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
              {memorial.summary}
            </p>
          )}
        </div>

        {/* Bottom stats and action */}
        <div>
          {/* Stats Bar */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
                {memorial.prayerCount || 0} دعوة
              </span>
              <span className="flex items-center gap-1 text-stone-500">
                <Eye className="w-3.5 h-3.5 text-stone-400" />
                {memorial.visitCount || 0} زيارة
              </span>
            </div>

            <button
              onClick={(e) => onShare(memorial, e)}
              className="p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="مشاركة الصفحة"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Action Button */}
          <button 
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 group-hover:bg-emerald-800 group-hover:text-white text-stone-800 font-semibold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2"
          >
            <span>زيارة الصفحة والدعاء له</span>
            <span className="text-amber-500 group-hover:text-amber-300">←</span>
          </button>
        </div>
      </div>
    </div>
  );
};
