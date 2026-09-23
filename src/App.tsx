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
import { LayoutDashboard, Users, Sliders, Download } from 'lucide-react';

export function App() {
  const [pathname, setPathname] = useState<string>(window.location.pathname);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'registrations' | 'venue' | 'exports'>('dashboard');

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Header
        isAdminView={isAdminView}
        onNavigatePublic={navigateToPublic}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isAdminView ? (
          /* ADMIN PORTAL - ONLY ACCESSIBLE VIA /admin ROUTE */
          <div>
            {!isAdminLoggedIn ? (
              <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
            ) : (
              <div className="space-y-6">
                {/* Admin Navigation Tabs */}
                <div className="bg-white rounded-lg border border-slate-200 p-1.5 flex flex-wrap items-center gap-1 shadow-xs">
                  <button
                    onClick={() => setActiveAdminTab('dashboard')}
                    className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-md transition ${
                      activeAdminTab === 'dashboard'
                        ? 'bg-[#E61C24] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('registrations')}
                    className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-md transition ${
                      activeAdminTab === 'registrations'
                        ? 'bg-[#E61C24] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Registrations ({registrations.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('venue')}
                    className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-md transition ${
                      activeAdminTab === 'venue'
                        ? 'bg-[#E61C24] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Venue Settings</span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('exports')}
                    className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-md transition ${
                      activeAdminTab === 'exports'
                        ? 'bg-[#E61C24] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </button>
                </div>

                {/* Tab Views */}
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
              </div>
            )}
          </div>
        ) : (
          /* PUBLIC REGISTRATION FORM (DEFAULT ROOT ROUTE) */
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Geofence Guard */}
            <LocationGuard venue={venue} onVerificationChange={setLocationVerification} />

            {/* Registration Form */}
            <RegistrationForm
              locationVerification={locationVerification}
              venue={venue}
              onSuccess={refreshData}
            />
          </div>
        )}
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
