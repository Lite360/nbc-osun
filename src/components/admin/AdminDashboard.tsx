import React from 'react';
import { Users, Clock, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import type { Registration } from '../../types';

interface AdminDashboardProps {
  registrations: Registration[];
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ registrations, onSelectTab }) => {
  const total = registrations.length;
  const pending = registrations.filter((r) => r.status === 'pending').length;
  const confirmed = registrations.filter((r) => r.status === 'confirmed').length;
  const rejected = registrations.filter((r) => r.status === 'rejected').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysCount = registrations.filter((r) => r.created_at.startsWith(todayStr)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Dashboard Overview</h2>
          <p className="text-xs text-slate-500">
            Real-time analytics for corps member attendance & verification in Osun State.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div
          onClick={() => onSelectTab('registrations')}
          className="nbc-card p-4 cursor-pointer hover:border-red-300 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-red-50 group-hover:text-[#E61C24] transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{total.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">All submissions</div>
        </div>

        {/* Pending */}
        <div
          onClick={() => onSelectTab('registrations')}
          className="nbc-card p-4 cursor-pointer hover:border-amber-300 transition group border-l-4 border-l-amber-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-2">{pending.toLocaleString()}</div>
          <div className="text-[11px] text-amber-600 mt-1">Awaiting admin review</div>
        </div>

        {/* Confirmed */}
        <div
          onClick={() => onSelectTab('registrations')}
          className="nbc-card p-4 cursor-pointer hover:border-emerald-300 transition group border-l-4 border-l-emerald-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Confirmed</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-900 mt-2">{confirmed.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Verified & approved</div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => onSelectTab('registrations')}
          className="nbc-card p-4 cursor-pointer hover:border-red-300 transition group border-l-4 border-l-red-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">Rejected</span>
            <div className="w-8 h-8 rounded-full bg-red-50 text-[#E61C24] flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-900 mt-2">{rejected.toLocaleString()}</div>
          <div className="text-[11px] text-red-600 mt-1">Declined entries</div>
        </div>

        {/* Today's Count */}
        <div className="nbc-card p-4 bg-slate-900 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Today</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-red-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{todaysCount.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">New attendees today</div>
        </div>
      </div>
    </div>
  );
};
