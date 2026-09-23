import React, { useState } from 'react';
import type { VenueSettings as TVenueSettings } from '../../types';
import { MapPin, Save, Power, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';
import Swal from 'sweetalert2';

interface VenueSettingsProps {
  venue: TVenueSettings;
  onSave: (updated: Partial<TVenueSettings>) => void;
}

export const VenueSettings: React.FC<VenueSettingsProps> = ({ venue, onSave }) => {
  const [name, setName] = useState(venue.name);
  const [address, setAddress] = useState(venue.address);
  const [radius, setRadius] = useState(venue.radius);
  const [isActive, setIsActive] = useState(venue.is_active);
  const [lat, setLat] = useState(venue.latitude);
  const [lng, setLng] = useState(venue.longitude);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      address,
      radius: Number(radius),
      is_active: isActive,
      latitude: Number(lat),
      longitude: Number(lng),
    });

    Swal.fire({
      icon: 'success',
      title: 'Venue Settings Saved',
      text: 'Registration venue configurations updated successfully.',
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
        ? 'Public registration portal is now OPEN to corps members at the venue.'
        : 'Public registration portal is now CLOSED.',
      confirmButtonColor: '#E61C24',
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Registration Venue & System Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage the single registration venue, address, geofencing radius, and global portal availability.
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
                ? 'Corps members can submit registrations when inside the venue radius.'
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
          <span>Venue Configuration Parameters</span>
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

        {/* Radius */}
        <div>
          <label htmlFor="venueRadius" className="block text-xs font-semibold text-slate-700 mb-1">
            Allowed Geofence Radius (metres)
          </label>
          <input
            id="venueRadius"
            type="number"
            min={10}
            max={5000}
            required
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="nbc-input font-mono"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Maximum physical distance allowed between device coordinates and venue center. Default: 100 metres.
          </p>
        </div>

        {/* Internal Geocoding Coordinates */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label htmlFor="venueLat" className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Venue Latitude
            </label>
            <input
              id="venueLat"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
              className="nbc-input font-mono text-xs"
            />
          </div>
          <div>
            <label htmlFor="venueLng" className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Venue Longitude
            </label>
            <input
              id="venueLng"
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
              className="nbc-input font-mono text-xs"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-right">
          <button
            type="submit"
            className="nbc-btn-primary px-6 py-2.5 rounded text-xs font-bold inline-flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Venue Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
