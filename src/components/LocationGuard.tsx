import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, CheckCircle2, RefreshCw, Compass } from 'lucide-react';
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
  const [showSimModal, setShowSimModal] = useState<boolean>(false);

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
          msg = 'Location permission denied. Please allow location access in your browser settings.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
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
      // Simulate ~5km away in Osun State
      userLat = venue.latitude + 0.045;
      userLng = venue.longitude + 0.045;
    }

    const res = verifyVenueLocation(userLat, userLng, venue.latitude, venue.longitude, venue.radius);
    setVerification(res);
    onVerificationChange(res);
    setError(null);
    setShowSimModal(false);
  };

  if (!venue.is_active) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 mb-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-[#E61C24] flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-red-900 mb-1">Registration Closed</h3>
        <p className="text-sm text-red-700 max-w-md mx-auto">
          Corps member registration is currently unavailable. Please check with venue administrators for schedule updates.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Status Box */}
      {loading ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center space-x-3 text-slate-700">
          <RefreshCw className="w-5 h-5 animate-spin text-[#E61C24]" />
          <div className="text-sm">
            <span className="font-semibold block">Verifying venue location...</span>
            <span className="text-xs text-slate-500">Acquiring GPS coordinates to verify physical presence at venue.</span>
          </div>
        </div>
      ) : verification?.isVerified ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 flex items-start space-x-3 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="font-bold text-emerald-950 flex items-center justify-between">
              <span>✓ You are at the registration venue.</span>
              <span className="text-xs font-normal text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Within {verification.distanceMeters}m of venue
              </span>
            </h4>
            <p className="text-xs text-emerald-800 mt-1">
              Location verified for {venue.name}. You may proceed with filling out the registration form below.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-900">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-[#E61C24] flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <h4 className="font-bold text-red-950 text-base mb-1">
                You are not at the registration venue.
              </h4>
              <p className="text-xs sm:text-sm text-red-800 leading-relaxed mb-2">
                Registration can only be completed at the designated registration venue ({venue.name}).
                {verification?.distanceMeters ? (
                  <span className="block font-semibold mt-1">
                    Your current distance: ~{verification.distanceMeters}m (Allowed max radius: {venue.radius}m).
                  </span>
                ) : null}
              </p>

              {error && (
                <div className="bg-white/80 border border-red-200 rounded p-2 text-xs text-red-700 mb-2">
                  <strong>Notice:</strong> {error}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={checkLocation}
                  className="inline-flex items-center space-x-1.5 bg-[#E61C24] hover:bg-[#C4121A] text-white text-xs font-medium px-3 py-1.5 rounded transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-check My Location</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSimModal(true)}
                  className="inline-flex items-center space-x-1 text-xs text-red-700 hover:text-red-900 underline font-medium px-2 py-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Location Simulation (Demo/Testing)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulator Modal for Testing */}
      {showSimModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#E61C24]" />
                <span>Venue Location Testing Tool</span>
              </h3>
              <button
                onClick={() => setShowSimModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Use this tool to simulate physical device presence for testing the registration venue guard when testing off-site.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => simulateLocation(true)}
                className="w-full text-left p-3 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center justify-between transition"
              >
                <div>
                  <div className="text-sm font-bold text-emerald-950">✓ Simulate INSIDE Venue</div>
                  <div className="text-emerald-700 font-normal">Sets coordinates to venue center ({venue.name})</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </button>

              <button
                onClick={() => simulateLocation(false)}
                className="w-full text-left p-3 rounded border border-red-300 bg-red-50 hover:bg-red-100 text-red-900 text-xs font-semibold flex items-center justify-between transition"
              >
                <div>
                  <div className="text-sm font-bold text-red-950">✕ Simulate OUTSIDE Venue</div>
                  <div className="text-red-700 font-normal">Sets coordinates ~5km outside venue radius</div>
                </div>
                <AlertTriangle className="w-5 h-5 text-[#E61C24]" />
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowSimModal(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
