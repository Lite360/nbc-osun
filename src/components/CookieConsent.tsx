import { useState, useEffect } from 'react';
import { Cookie, X, Shield, ChevronRight } from 'lucide-react';

const COOKIE_KEY = 'nbc_osun_cookie_consent';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [hasConsented, setHasConsented] = useState(true); // default hidden
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setHasConsented(false);
      // Auto-expand after a short delay on first visit
      const timer = setTimeout(() => setIsExpanded(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
      setHasConsented(true);
      setIsExpanded(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  const handleAcceptEssential = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ accepted: 'essential', date: new Date().toISOString() }));
      setHasConsented(true);
      setIsExpanded(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  // If user already consented, show only a small floating icon that can re-open settings
  if (hasConsented) {
    return (
      <button
        onClick={() => {
          setHasConsented(false);
          setIsExpanded(true);
        }}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-slate-900 text-amber-400 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-slate-800 group border border-slate-700"
        aria-label="Cookie Settings"
        title="Cookie Settings"
      >
        <Cookie className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      </button>
    );
  }

  return (
    <>
      {/* Floating Cookie Icon (when banner is collapsed) */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-slate-900 text-amber-400 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce group border-2 border-amber-400/30"
          aria-label="Open Cookie Settings"
        >
          <Cookie className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Expanded Cookie Consent Banner */}
      {isExpanded && (
        <div
          className={`fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[420px] transition-all duration-300 ${
            isAnimatingOut
              ? 'opacity-0 translate-y-4 scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Cookie Notice</h3>
                  <p className="text-slate-400 text-[11px]">NBC Osun Registration Portal</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white transition p-1 rounded-md hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-slate-600 text-xs leading-relaxed mb-4">
                We use cookies and local storage to enhance your experience on this portal. Essential cookies are required for core functionality like form submission and admin authentication.
              </p>

              {/* Cookie Types */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-3.5 py-2.5">
                  <div className="flex items-center space-x-2.5">
                    <Shield className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs font-semibold text-green-800">Essential Cookies</p>
                      <p className="text-[10px] text-green-600">Required for portal functionality</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Always On
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3.5 py-2.5">
                  <div className="flex items-center space-x-2.5">
                    <Cookie className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Analytics Cookies</p>
                      <p className="text-[10px] text-slate-500">Help us improve the portal</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center space-x-3 mb-4">
                <button
                  onClick={onOpenPrivacy}
                  className="text-[11px] text-[#E61C24] font-semibold hover:underline flex items-center space-x-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  <span>Privacy Policy</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={onOpenTerms}
                  className="text-[11px] text-[#E61C24] font-semibold hover:underline flex items-center space-x-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  <span>Terms & Conditions</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-5 pb-4 flex items-center space-x-2.5">
              <button
                onClick={handleAcceptEssential}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2.5 rounded-lg bg-[#E61C24] text-white text-xs font-bold hover:bg-[#C4121A] transition shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
