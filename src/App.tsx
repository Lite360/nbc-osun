import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LocationGuard } from './components/LocationGuard';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RegistrationList } from './components/admin/RegistrationList';
import { VenueSettings as VenueSettingsComponent } from './components/admin/VenueSettings';
import { ExportPanel } from './components/admin/ExportPanel';
import type { LocationVerificationResult } from './utils/geolocation';
import type { Registration, VenueSettings, RegistrationStatus } from './types';
import { apiService } from './services/api';
import { LayoutDashboard, Users, Sliders, Download, ArrowLeft, LogOut, Menu, X } from 'lucide-react';

export function App() {
  const [pathname, setPathname] = useState<string>(window.location.pathname);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'registrations' | 'venue' | 'exports'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App data state
  const [venue, setVenue] = useState<VenueSettings>(apiService.getVenueSettings());
  const [registrations, setRegistrations] = useState<Registration[]>(apiService.getRegistrations());
  const [locationVerification, setLocationVerification] = useState<LocationVerificationResult | null>(null);

  const isAdminView = pathname.startsWith('/admin');

  useEffect(() => {
    setIsAdminLoggedIn(apiService.isAdminLoggedIn());

    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPublic = () => {
    window.history.pushState({}, '', '/');
    setPathname('/');
  };

  const refreshData = () => {
    setVenue(apiService.getVenueSettings());
    setRegistrations(apiService.getRegistrations());
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
              onClick={() => {
                setActiveAdminTab('dashboard');
                setIsMobileSidebarOpen(false);
              }}
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
              onClick={() => {
                setActiveAdminTab('registrations');
                setIsMobileSidebarOpen(false);
              }}
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

            {/* Venue Settings Link */}
            <button
              onClick={() => {
                setActiveAdminTab('venue');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition ${
                activeAdminTab === 'venue'
                  ? 'bg-[#E61C24] text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Venue Settings</span>
            </button>

            {/* Export Link */}
            <button
              onClick={() => {
                setActiveAdminTab('exports');
                setIsMobileSidebarOpen(false);
              }}
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
              <span>Public Registration</span>
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
          {activeAdminTab === 'dashboard' && (
            <AdminDashboard
              registrations={registrations}
              onSelectTab={(tab) => setActiveAdminTab(tab as any)}
            />
          )}

          {activeAdminTab === 'registrations' && (
            <RegistrationList
              registrations={registrations}
              onUpdateStatus={handleUpdateRegistrationStatus}
            />
          )}

          {activeAdminTab === 'venue' && (
            <VenueSettingsComponent venue={venue} onSave={handleSaveVenue} />
          )}

          {activeAdminTab === 'exports' && <ExportPanel registrations={registrations} />}
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
        {/* Full-Page Blocking Modal / Location Check */}
        <LocationGuard venue={venue} onVerificationChange={setLocationVerification} />

        {/* Public Registration Form */}
        <RegistrationForm
          locationVerification={locationVerification}
          venue={venue}
          onSuccess={refreshData}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#E61C24]"></span>
            <span>NBC Osun Registration Portal</span>
          </div>
          <div>
            Official Corps Member Registration & Location Verification System &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
