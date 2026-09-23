import { useState } from 'react';
import type { VenueSettings as TVenueSettings } from '../../types';
import { Save, Power, Sliders } from 'lucide-react';
import Swal from 'sweetalert2';

interface VenueSettingsProps {
  venue: TVenueSettings;
  onSave: (updated: Partial<TVenueSettings>) => void;
}

export const VenueSettings: React.FC<VenueSettingsProps> = ({ venue, onSave }) => {
  const [name, setName] = useState(venue.name);
  const [address, setAddress] = useState(venue.address);
  const [isActive, setIsActive] = useState(venue.is_active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      address,
      is_active: isActive,
    });

    Swal.fire({
      icon: 'success',
      title: 'Portal Settings Saved',
      text: 'Venue details and registration availability updated successfully.',
      confirmButtonColor: '#E61C24',
    });
  };

  const toggleStatus = () => {
    const nextStatus = !isActive;
    setIsActive(nextStatus);
    onSave({ is_active: nextStatus });

    Swal.fire({
      icon: nextStatus ? 'success' : 'warning',
      title: nextStatus ? 'Registration Opened' : 'Registration Closed',
      text: nextStatus
        ? 'Public registration portal is now OPEN to corps members.'
        : 'Public registration portal is now CLOSED.',
      confirmButtonColor: '#E61C24',
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Portal & Venue Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure venue information and control global registration portal availability.
        </p>
      </div>

      {/* Global Status Banner */}
      <div
        className={`p-4 rounded-lg border flex items-center justify-between ${
          isActive
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-red-50 border-red-300 text-red-950'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-[#E61C24]'
            }`}
          >
            <Power className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">
              Registration Portal Status: {isActive ? 'OPEN' : 'CLOSED'}
            </h4>
            <p className="text-xs text-slate-600">
              {isActive
                ? 'Public registration form is currently open and accepting submissions.'
                : 'Registration form is locked and unavailable to public applicants.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleStatus}
          className={`px-4 py-2 rounded text-xs font-bold transition shadow-xs ${
            isActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isActive ? 'Close Registration' : 'Open Registration'}
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
          <Sliders className="w-4 h-4 text-[#E61C24]" />
          <span>Venue Information Parameters</span>
        </h3>

        {/* Venue Name */}
        <div>
          <label htmlFor="venueName" className="block text-xs font-semibold text-slate-700 mb-1">
            Venue Name
          </label>
          <input
            id="venueName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="nbc-input"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="venueAddress" className="block text-xs font-semibold text-slate-700 mb-1">
            Venue Address
          </label>
          <input
            id="venueAddress"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="nbc-input"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 text-right">
          <button
            type="submit"
            className="nbc-btn-primary px-6 py-2.5 rounded text-xs font-bold inline-flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
