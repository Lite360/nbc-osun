import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, CheckCircle2, RefreshCw, Compass, Lock } from 'lucide-react';
import type { VenueSettings } from '../types';
import { verifyVenueLocation, type LocationVerificationResult } from '../utils/geolocation';

interface LocationGuardProps {
  venue: VenueSettings;
  onVerificationChange: (result: LocationVerificationResult) => void;
}

export const LocationGuard: React.FC<LocationGuardProps> = ({ venue, onVerificationChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<LocationVerificationResult | null>(null);
  const [showSimOptions, setShowSimOptions] = useState<boolean>(false);

  const checkLocation = () => {
    if (!venue.is_active) {
      const closedResult: LocationVerificationResult = {
        isVerified: false,
        distanceMeters: 0,
        allowedRadius: venue.radius,
        errorMessage: 'Registration is currently CLOSED by administrators.',
      };
      setVerification(closedResult);
      onVerificationChange(closedResult);
      return;
    }

    if (!navigator.geolocation) {
      const notSupportedResult: LocationVerificationResult = {
        isVerified: false,
        distanceMeters: 0,
        allowedRadius: venue.radius,
        errorMessage: 'Geolocation is not supported by your browser.',
      };
      setError('Geolocation is not supported by your browser.');
      setVerification(notSupportedResult);
      onVerificationChange(notSupportedResult);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const res = verifyVenueLocation(userLat, userLng, venue.latitude, venue.longitude, venue.radius);

        setVerification(res);
        onVerificationChange(res);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        let msg = 'Unable to retrieve your current location. Please allow location access.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please enable location access in your browser settings.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable on your device.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setError(msg);

        const failResult: LocationVerificationResult = {
          isVerified: false,
          distanceMeters: 0,
          allowedRadius: venue.radius,
          errorMessage: msg,
        };
        setVerification(failResult);
        onVerificationChange(failResult);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    checkLocation();
  }, [venue.latitude, venue.longitude, venue.radius, venue.is_active]);

  const simulateLocation = (atVenue: boolean) => {
    let userLat = venue.latitude;
    let userLng = venue.longitude;

    if (!atVenue) {
      // Simulate ~5km away
      userLat = venue.latitude + 0.045;
      userLng = venue.longitude + 0.045;
    }

    const res = verifyVenueLocation(userLat, userLng, venue.latitude, venue.longitude, venue.radius);
    setVerification(res);
    onVerificationChange(res);
    setError(null);
    setShowSimOptions(false);
  };

  const isBlocked = !venue.is_active || (verification && !verification.isVerified && !loading);

  return (
    <>
      {/* VERIFIED SUCCESS CALLOUT ABOVE FORM */}
      {verification?.isVerified && !loading && (
        <div className="mb-6 bg-emerald-50 border border-emerald-300 rounded-lg p-4 flex items-start space-x-3 text-emerald-900 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="font-bold text-emerald-950 flex items-center justify-between">
              <span>✓ You are at the registration venue.</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Within {verification.distanceMeters}m of venue
              </span>
            </h4>
            <p className="text-xs text-emerald-800 mt-1">
              Location verified for <strong>{venue.name}</strong>. You may proceed with filling out the registration form.
            </p>
          </div>
        </div>
      )}

      {/* FULL-SCREEN BLOCKING POPUP MODAL (Covers whole interface when blocked) */}
      {isBlocked && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5 my-auto">
            {/* Header Icon */}
            {!venue.is_active ? (
              <div className="w-16 h-16 rounded-full bg-red-100 text-[#E61C24] flex items-center justify-center mx-auto shadow-inner border border-red-200">
                <Lock className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-100 text-[#E61C24] flex items-center justify-center mx-auto shadow-inner border border-red-200">
                <AlertTriangle className="w-8 h-8" />
              </div>
            )}

            {/* Title & Description */}
            {!venue.is_active ? (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Registration Closed
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Corps member registration is currently unavailable. Registration can only be completed when opened by venue administrators.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 font-medium">
                  Venue: {venue.name}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  You are not at the registration venue.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Registration can only be completed at the designated registration venue.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 text-xs text-red-900 text-left space-y-1 mt-3">
                  <div className="font-bold flex items-center space-x-1.5 text-red-950">
                    <MapPin className="w-4 h-4 text-[#E61C24]" />
                    <span>Venue Location Details:</span>
                  </div>
                  <div>Venue: <strong>{venue.name}</strong></div>
                  {verification?.distanceMeters ? (
                    <div>
                      Your Current Distance: <strong className="text-[#E61C24]">~{verification.distanceMeters} metres</strong> (Allowed Max Radius: {venue.radius}m)
                    </div>
                  ) : null}
                </div>

                {error && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
                    <strong>Notice:</strong> {error}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              {venue.is_active && (
                <button
                  type="button"
                  onClick={checkLocation}
                  disabled={loading}
                  className="w-full nbc-btn-primary py-3 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 shadow-md"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Acquiring GPS Location...' : 'Re-check My Location'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowSimOptions(!showSimOptions)}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                <Compass className="w-3.5 h-3.5 text-[#E61C24]" />
                <span>{showSimOptions ? 'Hide Testing Options' : 'Location Simulation (Demo/Testing)'}</span>
              </button>

              {/* Simulation Options for Testers */}
              {showSimOptions && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-left space-y-2 pt-3 animate-fade-in">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    Testing Controls (Simulate Device Coordinates):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => simulateLocation(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded text-xs font-bold transition text-center"
                    >
                      ✓ Inside Venue
                    </button>
                    <button
                      type="button"
                      onClick={() => simulateLocation(false)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-xs font-bold transition text-center"
                    >
                      ✕ Outside Venue
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
