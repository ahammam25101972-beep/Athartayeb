import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { CreateMemorialView } from './views/CreateMemorialView';
import { MemorialDetailView } from './views/MemorialDetailView';
import { QuranView } from './views/QuranView';
import { AdhkarView } from './views/AdhkarView';
import { CharityInfoView } from './views/CharityInfoView';
import { SearchView } from './views/SearchView';
import { UserDashboardView } from './views/UserDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { memorialService } from './services/memorialService';
import { Memorial } from './types';

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [editMemorialData, setEditMemorialData] = useState<Memorial | null>(null);

  // Sync with URL query parameters on initial mount and popstate
  useEffect(() => {
    // Purge old cached demo text from localStorage
    try {
      const raw = localStorage.getItem('athar_tayyib_memorials_cache');
      if (raw && (raw.includes('نموذج') || raw.includes('Demo') || raw.includes('ديمو') || raw.includes('تجريب'))) {
        const parsed = JSON.parse(raw);
        const cleaned = parsed.map((m: any) => ({
          ...m,
          deceasedName: m.deceasedName
            ? m.deceasedName.replace(/\s*[\(\[\{]?\s*(نموذج\s*تجريب[يى]|ديمو|Demo|demo|تجريب[يى]|صفحة\s*تجريبية)\s*[\)\]\}]?/gi, '').trim()
            : m.deceasedName,
          summary: m.summary
            ? m.summary.replace(/نموذج تجريب[يى]|ديمو|Demo|صفحة تجريبية/gi, '').trim()
            : m.summary
        }));
        localStorage.setItem('athar_tayyib_memorials_cache', JSON.stringify(cleaned));
      }
    } catch (e) {}

    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        const id = params.get('id');
        const q = params.get('q');

        if (page === 'memorial' && id) {
          setCurrentView('memorial');
          setViewParam(id);
        } else if (page === 'search') {
          setCurrentView('search');
          setViewParam(q || '');
        } else if (page) {
          setCurrentView(page);
          setViewParam(id || undefined);
        }
      } catch (e) {
        console.warn('Error parsing url params:', e);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigateTo = async (view: string, param?: string) => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {}
    
    if (view === 'create' && param) {
      // Editing existing memorial
      try {
        const existing = await memorialService.getMemorialById(param);
        setEditMemorialData(existing);
      } catch (e) {
        setEditMemorialData(null);
      }
    } else {
      setEditMemorialData(null);
    }

    setCurrentView(view);
    setViewParam(param);

    // Update browser URL query string without reloading (guarded against iframe security restrictions)
    try {
      const url = new URL(window.location.href);
      if (view === 'home') {
        url.search = '';
      } else if (view === 'memorial' && param) {
        url.search = `?page=memorial&id=${param}`;
      } else if (view === 'search' && param) {
        url.search = `?page=search&q=${encodeURIComponent(param)}`;
      } else {
        url.search = `?page=${view}`;
      }
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      // Silently fall back to in-memory state if sandbox restricts history mutation
    }
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-sans" dir="rtl">
          {/* Sticky Header Navbar */}
          <Navbar currentView={currentView} setCurrentView={navigateTo} />

          {/* Dynamic Main Body Content */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomeView onNavigate={navigateTo} />
            )}

            {currentView === 'create' && (
              <CreateMemorialView 
                onNavigate={navigateTo} 
                editMemorial={editMemorialData} 
              />
            )}

            {currentView === 'memorial' && viewParam && (
              <MemorialDetailView 
                memorialId={viewParam} 
                onNavigate={navigateTo} 
              />
            )}

            {currentView === 'quran' && (
              <QuranView onNavigate={navigateTo} />
            )}

            {currentView === 'adhkar' && (
              <AdhkarView />
            )}

            {currentView === 'charity' && (
              <CharityInfoView onNavigate={navigateTo} />
            )}

            {currentView === 'search' && (
              <SearchView 
                initialQuery={viewParam} 
                onNavigate={navigateTo} 
              />
            )}

            {currentView === 'dashboard' && (
              <UserDashboardView onNavigate={navigateTo} />
            )}

            {currentView === 'admin' && (
              <AdminDashboardView onNavigate={navigateTo} />
            )}
          </main>

          {/* Global Reverent Footer */}
          <Footer onNavigate={navigateTo} />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
