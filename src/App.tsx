import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RegistrationList } from './components/admin/RegistrationList';
import { VenueSettings as VenueSettingsComponent } from './components/admin/VenueSettings';
import { ExportPanel } from './components/admin/ExportPanel';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsConditions } from './components/TermsConditions';
import type { Registration, VenueSettings, RegistrationStatus } from './types';
import { apiService } from './services/api';
import { LayoutDashboard, Users, Sliders, Download, ArrowLeft, LogOut, Menu, X } from 'lucide-react';

export function App() {
  const [pathname, setPathname] = useState<string>(window.location.pathname);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'registrations' | 'venue' | 'exports'>('dashboard');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // App data state
  const [venue, setVenue] = useState<VenueSettings>(apiService.getVenueSettings());
  const [registrations, setRegistrations] = useState<Registration[]>(apiService.getRegistrations());

  const isAdminView = pathname.startsWith('/access');

  const switchTab = (tab: 'dashboard' | 'registrations' | 'venue' | 'exports') => {
    if (tab === activeAdminTab) return;
    setIsTabLoading(true);
    setActiveAdminTab(tab);
    setIsMobileSidebarOpen(false);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 150);
  };

  const refreshData = async () => {
    setVenue(apiService.getVenueSettings());
    const latest = await apiService.fetchRegistrations();
    setRegistrations(latest);
  };

  useEffect(() => {
    setIsAdminLoggedIn(apiService.isAdminLoggedIn());
    refreshData();

    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    // Auto-poll database every 5 seconds when in admin view for real-time fresh attendance submissions
    let intervalId: any = null;
    if (pathname.startsWith('/access')) {
      intervalId = setInterval(() => {
        apiService.fetchRegistrations().then(latest => {
          setRegistrations(latest);
        });
      }, 5000);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (intervalId) clearInterval(intervalId);
    };
  }, [pathname]);

  const navigateToPublic = () => {
    window.history.pushState({}, '', '/');
    setPathname('/');
  };

  const handleSaveVenue = (updated: Partial<VenueSettings>) => {
    const res = apiService.updateVenueSettings(updated);
    setVenue(res);
  };

  const handleUpdateRegistrationStatus = (
    id: string,
    status: RegistrationStatus,
    adminNote?: string
  ) => {
    apiService.updateRegistrationStatus(id, status, adminNote);
    refreshData();
  };

  const handleDeleteRegistration = (id: string) => {
    apiService.deleteRegistration(id);
    refreshData();
  };

  const handleLogout = () => {
    apiService.logoutAdmin();
    setIsAdminLoggedIn(false);
    navigateToPublic();
  };

  /* ADMIN PORTAL WITH LEFT SIDEBAR LAYOUT */
  if (isAdminView) {
    if (!isAdminLoggedIn) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
          <Header
            isAdminView={true}
            onNavigatePublic={navigateToPublic}
            isAdminLoggedIn={false}
          />
          <main className="flex-1 flex items-center justify-center p-4">
            <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-slate-900">
        {/* MOBILE TOP BAR */}
        <div className="lg:hidden bg-[#E61C24] text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#E61C24] flex items-center justify-center font-bold text-base shadow-xs">
              NBC
            </div>
            <span className="font-bold text-lg tracking-tight">NBC OSUN ADMIN</span>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded bg-white/10 hover:bg-white/20 text-white transition"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ADMIN SIDEBAR */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-200 ease-in-out ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#E61C24] text-white flex items-center justify-center font-bold text-xl shadow-md border border-red-400">
                NBC
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-tight text-white">NBC OSUN</h1>
                <p className="text-[11px] text-red-400 font-semibold uppercase tracking-wider">Admin Control Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Management Menu
            </div>

            {/* Dashboard Link */}
            <button
              onClick={() => switchTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                activeAdminTab === 'dashboard'
                  ? 'bg-[#E61C24] text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* Registrations Link */}
            <button
              onClick={() => switchTab('registrations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                activeAdminTab === 'registrations'
                  ? 'bg-[#E61C24] text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4" />
                <span>Registrations</span>
              </div>
              <span className="bg-slate-800 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-700">
                {registrations.length}
              </span>
            </button>

            {/* System Settings Link */}
            <button
              onClick={() => switchTab('venue')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                activeAdminTab === 'venue'
                  ? 'bg-[#E61C24] text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Portal Settings</span>
            </button>

            {/* Export Link */}
            <button
              onClick={() => switchTab('exports')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                activeAdminTab === 'exports'
                  ? 'bg-[#E61C24] text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </nav>

          {/* Sidebar Footer Controls */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              onClick={navigateToPublic}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4 text-red-400" />
              <span>Public Attendance</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-semibold text-red-400 hover:bg-red-950/60 hover:text-red-200 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Admin</span>
            </button>
          </div>
        </aside>

        {/* ADMIN CONTENT CANVAS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
          {isTabLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center space-y-3">
                <svg className="animate-spin h-8 w-8 text-[#E61C24]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-semibold text-slate-500">Loading view...</span>
              </div>
            </div>
          ) : (
            <>
              {activeAdminTab === 'dashboard' && (
                <AdminDashboard
                  registrations={registrations}
                  onSelectTab={(tab) => switchTab(tab as any)}
                />
              )}

              {activeAdminTab === 'registrations' && (
                <RegistrationList
                  registrations={registrations}
                  onUpdateStatus={handleUpdateRegistrationStatus}
                  onDelete={handleDeleteRegistration}
                />
              )}

              {activeAdminTab === 'venue' && (
                <VenueSettingsComponent venue={venue} onSave={handleSaveVenue} />
              )}

              {activeAdminTab === 'exports' && <ExportPanel registrations={registrations} />}
            </>
          )}
        </main>
      </div>
    );
  }

  /* PUBLIC REGISTRATION FORM (DEFAULT ROOT ROUTE `/`) */
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Header isAdminView={false} />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Public Registration Form */}
        <RegistrationForm
          venue={venue}
          onSuccess={refreshData}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#E61C24]"></span>
            <span>NBC Osun Attendance Portal</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-slate-500 hover:text-[#E61C24] transition font-medium"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowTerms(true)}
              className="text-slate-500 hover:text-[#E61C24] transition font-medium"
            >
              Terms & Conditions
            </button>
          </div>
          <div>
            Official Corps Member Attendance System &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenTerms={() => setShowTerms(true)}
      />

      {/* Privacy Policy Modal */}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}

      {/* Terms & Conditions Modal */}
      {showTerms && <TermsConditions onClose={() => setShowTerms(false)} />}
    </div>
  );
}

export default App;
