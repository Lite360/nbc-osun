import React, { useState } from 'react';
import type { Registration } from '../../types';
import { X, CheckCircle2, XCircle, Eye, FileText, User, CreditCard } from 'lucide-react';

interface RegistrationDetailModalProps {
  registration: Registration | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'confirmed' | 'rejected', adminNote?: string) => void;
}

export const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({
  registration,
  onClose,
  onUpdateStatus,
}) => {
  if (!registration) return null;

  const [adminNote, setAdminNote] = useState(registration.admin_note || '');
  const [showImageFull, setShowImageFull] = useState(false);

  const handleConfirm = () => {
    onUpdateStatus(registration.id, 'confirmed', adminNote);
  };

  const handleReject = () => {
    onUpdateStatus(registration.id, 'rejected', adminNote);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#E61C24] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-red-100 font-medium uppercase tracking-wider block">
              Registration Detail View
            </span>
            <h3 className="text-lg font-bold font-mono">{registration.registration_reference}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Application Status:
            </span>
            <span
              className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                registration.status === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : registration.status === 'rejected'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {registration.status}
            </span>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Details */}
            <div className="bg-slate-50/50 p-4 rounded-md border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1 border-b border-slate-200 pb-2">
                <User className="w-4 h-4 text-[#E61C24]" />
                <span>Personal Information</span>
              </h4>
              <div className="text-xs">
                <span className="text-slate-400 block">Full Name:</span>
                <span className="font-semibold text-slate-900 text-sm">{registration.full_name}</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block">State Code:</span>
                <span className="font-mono font-bold text-slate-800">{registration.state_code}</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block">Local Government Area (LGA):</span>
                <span className="font-semibold text-slate-800">{registration.lga}</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block">Phone & Email:</span>
                <span className="font-medium text-slate-800 block">{registration.phone}</span>
                <span className="text-slate-600 block">{registration.email}</span>
              </div>
            </div>

            {/* Bank Information */}
            <div className="bg-slate-50/50 p-4 rounded-md border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1 border-b border-slate-200 pb-2">
                <CreditCard className="w-4 h-4 text-[#E61C24]" />
                <span>Banking Details</span>
              </h4>
              <div className="text-xs">
                <span className="text-slate-400 block">Bank Name:</span>
                <span className="font-semibold text-slate-900">{registration.bank_name}</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block">Account Name:</span>
                <span className="font-semibold text-slate-800 uppercase">{registration.account_name}</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block">Account Number (NUBAN):</span>
                <span className="font-mono font-bold text-[#E61C24] text-sm">{registration.account_number}</span>
              </div>
            </div>
          </div>

          {/* NYSC ID Card Viewer */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-[#E61C24]" />
                <span>Uploaded NYSC ID Document</span>
              </h4>
              <span className="text-xs text-slate-500 font-mono">{registration.id_card_filename}</span>
            </div>

            <div className="text-center bg-white p-3 rounded border border-slate-200">
              <img
                src={registration.id_card_blob_url}
                alt="Uploaded NYSC ID Card"
                className="max-h-56 object-contain rounded mx-auto border border-slate-200 cursor-pointer hover:opacity-95 transition"
                onClick={() => setShowImageFull(true)}
              />
              <button
                onClick={() => setShowImageFull(true)}
                className="mt-2 text-xs font-semibold text-[#E61C24] hover:underline inline-flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Size Image</span>
              </button>
            </div>
          </div>

          {/* Admin Notes Field */}
          <div>
            <label htmlFor="adminNoteInput" className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Review Notes / Reason
            </label>
            <textarea
              id="adminNoteInput"
              rows={2}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add verification comments or rejection notes..."
              className="nbc-input text-xs"
            ></textarea>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-4 py-2 rounded bg-white border border-slate-300"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition inline-flex items-center space-x-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Application</span>
            </button>

            <button
              onClick={handleConfirm}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded transition inline-flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Registration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fullsize Image Modal */}
      {showImageFull && (
        <div
          onClick={() => setShowImageFull(false)}
          className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={registration.id_card_blob_url}
              alt="Fullsize NYSC ID"
              className="max-h-[85vh] max-w-full rounded shadow-2xl object-contain"
            />
            <p className="text-white text-center text-xs mt-2">Click anywhere to close preview</p>
          </div>
        </div>
      )}
    </div>
  );
};
