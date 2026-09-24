import React, { useState, useMemo } from 'react';
import type { Registration, RegistrationStatus } from '../../types';
import { OSUN_LGAS } from '../../data/osunLgas';
import { Search, Eye, Trash2 } from 'lucide-react';
import { RegistrationDetailModal } from './RegistrationDetailModal';
import Swal from 'sweetalert2';

interface RegistrationListProps {
  registrations: Registration[];
  onUpdateStatus: (id: string, status: RegistrationStatus, adminNote?: string) => void;
  onDelete?: (id: string) => void;
}

export const RegistrationList: React.FC<RegistrationListProps> = ({
  registrations,
  onUpdateStatus,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lgaFilter, setLgaFilter] = useState<string>('all');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const filtered = useMemo(() => {
    return registrations.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // LGA filter
      if (lgaFilter !== 'all' && item.lga !== lgaFilter) {
        return false;
      }
      // Text search
      if (search.trim() !== '') {
        const q = search.toLowerCase().trim();
        const matchesName = item.full_name.toLowerCase().includes(q);
        const matchesRef = item.registration_reference.toLowerCase().includes(q);
        const matchesCode = item.state_code.toLowerCase().includes(q);
        const matchesPhone = item.phone.includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const matchesLga = item.lga.toLowerCase().includes(q);

        return matchesName || matchesRef || matchesCode || matchesPhone || matchesEmail || matchesLga;
      }

      return true;
    });
  }, [registrations, search, statusFilter, lgaFilter]);

  const confirmAndDelete = async (id: string, refName: string) => {
    const res = await Swal.fire({
      title: 'Delete Record?',
      text: `Are you sure you want to permanently delete attendance record ${refName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E61C24',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    });

    if (res.isConfirmed) {
      if (onDelete) {
        onDelete(id);
      }
      if (selectedReg?.id === id) {
        setSelectedReg(null);
      }
      await Swal.fire({
        title: 'Deleted!',
        text: 'Attendance record has been permanently deleted.',
        icon: 'success',
        confirmButtonColor: '#E61C24',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Name, Reference, State Code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="nbc-input pl-9 text-xs"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Pills */}
            <div className="inline-flex rounded-md shadow-xs bg-slate-100 p-1 border border-slate-200">
              {['all', 'pending', 'confirmed', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs font-semibold capitalize px-3 py-1 rounded-sm transition ${
                    statusFilter === s
                      ? 'bg-white text-[#E61C24] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* LGA Select */}
            <select
              value={lgaFilter}
              onChange={(e) => setLgaFilter(e.target.value)}
              className="nbc-input text-xs w-auto py-1.5"
            >
              <option value="all">All LGAs ({OSUN_LGAS.length})</option>
              {OSUN_LGAS.map((lga) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{filtered.length}</strong> of {registrations.length} total attendance records
          </span>
          {(search || statusFilter !== 'all' || lgaFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setLgaFilter('all');
              }}
              className="text-[#E61C24] font-medium hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Corps Member</th>
                <th className="py-3 px-4">State Code</th>
                <th className="py-3 px-4">LGA</th>
                <th className="py-3 px-4">Bank & Account</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching corps member attendance records found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    {/* Reference */}
                    <td className="py-3 px-4 font-mono font-bold text-[#E61C24] whitespace-nowrap">
                      {r.registration_reference}
                    </td>

                    {/* Corps Member */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{r.full_name}</span>
                      <span className="text-[11px] text-slate-400 block">{r.phone}</span>
                    </td>

                    {/* State Code */}
                    <td className="py-3 px-4 font-mono text-slate-700 font-semibold uppercase">
                      {r.state_code}
                    </td>

                    {/* LGA */}
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{r.lga}</td>

                    {/* Bank & Account */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block truncate max-w-[140px]">
                        {r.bank_name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 block">
                        {r.account_number}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-block ${
                          r.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setSelectedReg(r)}
                        className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded transition text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => confirmAndDelete(r.id, r.registration_reference)}
                        className="inline-flex items-center p-1 rounded bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                        title="Delete Attendance Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <RegistrationDetailModal
        registration={selectedReg}
        onClose={() => setSelectedReg(null)}
        onUpdateStatus={(id, status, note) => {
          onUpdateStatus(id, status, note);
          setSelectedReg(null);
        }}
        onDelete={(id) => {
          if (selectedReg) {
            confirmAndDelete(id, selectedReg.registration_reference);
          }
        }}
      />
    </div>
  );
};
