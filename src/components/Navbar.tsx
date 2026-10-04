import React, { useState } from 'react';
import { 
  HeartHandshake, 
  PlusCircle, 
  BookOpen, 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  ShieldAlert, 
  LayoutDashboard,
  LogIn,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SiteLogo } from './SiteLogo';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const { userProfile, isAdmin, signInWithGoogle, signInDemo, signInAsAdmin, logout } = useAuth();

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'search', label: 'البحث عن صفحة', icon: Search },
    { id: 'quran', label: 'القرآن الكريم', icon: BookOpen },
    { id: 'adhkar', label: 'الأذكار والدعاء', icon: Sparkles },
    { id: 'charity', label: 'أعمال الخير' },
  ];

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="group-hover:scale-105 transition-transform duration-200">
              <SiteLogo size={52} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-1.5 font-quran">
                أثر طيب
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
              </span>
              <span className="text-xs text-stone-500 font-medium -mt-1">
                صدقة جارية لروح الفقيد
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-emerald-600 opacity-80" />}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Profile */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavigate('create')}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-sm flex items-center gap-2 shadow-xs transition-colors hover:shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>أنشئ صفحة الآن</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 hover:border-emerald-300 bg-stone-50 text-stone-700 text-sm font-medium transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'ف'}
                </div>
                <span className="max-w-[110px] truncate">{userProfile?.displayName || 'حسابي'}</span>
                {isAdmin ? (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                    مشرف
                  </span>
                ) : (
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-full">
                    مستخدم
                  </span>
                )}
              </button>

              {showAuthDropdown && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-400">الحساب الحالي</p>
                    <p className="text-sm font-semibold text-stone-800 truncate">{userProfile?.displayName}</p>
                    <p className="text-xs text-stone-500 truncate">{userProfile?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowAuthDropdown(false);
                      handleNavigate('dashboard');
                    }}
                    className="w-full text-right px-4 py-2.5 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                    لوحة تحكم صفحاتي
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthDropdown(false);
                      handleNavigate('admin');
                    }}
                    className="w-full text-right px-4 py-2.5 text-sm text-amber-800 bg-amber-50/50 hover:bg-amber-100 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    لوحة تحكم الإدارة العامة
                  </button>

                  <div className="border-t border-stone-100 my-1"></div>

                  {!isAdmin && (
                    <button
                      onClick={() => {
                        signInAsAdmin();
                        setShowAuthDropdown(false);
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors font-semibold"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      التبديل إلى حساب المشرف (Admin)
                    </button>
                  )}

                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setShowAuthDropdown(false);
                    }}
                    className="w-full text-right px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                    تسجيل الدخول عبر Google
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowAuthDropdown(false);
                    }}
                    className="w-full text-right px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => handleNavigate('create')}
              className="p-2 rounded-xl bg-emerald-800 text-white text-xs font-medium flex items-center gap-1 shadow-xs"
              title="أنشئ صفحة"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>أنشئ</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 focus:outline-none"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`w-full text-right px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-emerald-700" />}
                {link.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavigate('create')}
              className="w-full py-3 rounded-xl bg-emerald-800 text-white font-medium text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-5 h-5 text-amber-300" />
              أنشئ صفحة الآن
            </button>

            <button
              onClick={() => handleNavigate('dashboard')}
              className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-800 font-medium text-right px-4 flex items-center gap-2.5 hover:bg-stone-50"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-700" />
              لوحة تحكم صفحاتي ({userProfile?.displayName})
            </button>

            <button
              onClick={() => handleNavigate('admin')}
              className="w-full py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-medium text-right px-4 flex items-center gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              لوحة تحكم الإدارة العامة
            </button>

            {!isAdmin && (
              <button
                onClick={() => {
                  signInAsAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-amber-100/70 text-amber-900 text-xs font-semibold text-center"
              >
                دخول كمدير للنظام (Admin)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
