import { useState, useMemo } from 'react';
import type { Registration } from '../../types';
import { OSUN_LGAS } from '../../data/osunLgas';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { FileSpreadsheet, FileText, Download, Filter } from 'lucide-react';

interface ExportPanelProps {
  registrations: Registration[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ registrations }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lgaFilter, setLgaFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (lgaFilter !== 'all' && r.lga !== lgaFilter) return false;
      return true;
    });
  }, [registrations, statusFilter, lgaFilter]);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Export Management System</h2>
        <p className="text-xs text-slate-500 mt-1">
          Generate and download registered corps member reports in CSV, Excel, or formatted PDF.
        </p>
      </div>

      {/* Filter Options */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Filter className="w-4 h-4 text-[#E61C24]" />
          <span>Report Dataset Filters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="exportStatus" className="block text-xs font-semibold text-slate-700 mb-1">
              Filter by Application Status
            </label>
            <select
              id="exportStatus"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="nbc-input text-xs"
            >
              <option value="all">All Statuses (Pending, Confirmed, Rejected)</option>
              <option value="pending">Pending Only</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="rejected">Rejected Only</option>
            </select>
          </div>

          <div>
            <label htmlFor="exportLga" className="block text-xs font-semibold text-slate-700 mb-1">
              Filter by Osun LGA
            </label>
            <select
              id="exportLga"
              value={lgaFilter}
              onChange={(e) => setLgaFilter(e.target.value)}
              className="nbc-input text-xs"
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

        <div className="bg-slate-50 p-3 rounded text-xs text-slate-600 flex items-center justify-between border border-slate-200">
          <span>
            Selected Records for Export: <strong>{filtered.length}</strong> corps members
          </span>
          <span className="text-slate-400 text-[11px]">
            Format columns: Reference, Name, State Code, Phone, Email, LGA, Bank, Account, Status
          </span>
        </div>
      </div>

      {/* Export Format Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CSV Card */}
        <div className="nbc-card p-5 text-center flex flex-col justify-between hover:border-red-300 transition">
          <div>
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Comma-Separated (.csv)</h4>
            <p className="text-xs text-slate-500 mt-1">
              Standard structured data format for databases & spreadsheet tools.
            </p>
          </div>

          <button
            onClick={() => exportToCSV(filtered)}
            disabled={filtered.length === 0}
            className="mt-4 w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded transition disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>

        {/* Excel Card */}
        <div className="nbc-card p-5 text-center flex flex-col justify-between hover:border-emerald-300 transition">
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Microsoft Excel (.xlsx)</h4>
            <p className="text-xs text-slate-500 mt-1">
              Formatted spreadsheet with automatic header styles & columns.
            </p>
          </div>

          <button
            onClick={() => exportToExcel(filtered)}
            disabled={filtered.length === 0}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded transition disabled:opacity-50"
          >
            Export Excel
          </button>
        </div>

        {/* PDF Card */}
        <div className="nbc-card p-5 text-center flex flex-col justify-between hover:border-red-300 transition">
          <div>
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#E61C24] flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Document Report (.pdf)</h4>
            <p className="text-xs text-slate-500 mt-1">
              Printable PDF report styled with NBC Osun header & page formatting.
            </p>
          </div>

          <button
            onClick={() => exportToPDF(filtered)}
            disabled={filtered.length === 0}
            className="mt-4 w-full nbc-btn-primary text-xs font-bold py-2.5 rounded transition disabled:opacity-50"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};
