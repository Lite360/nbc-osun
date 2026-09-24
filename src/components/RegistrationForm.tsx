import { useState } from 'react';
import Swal from 'sweetalert2';
import { Upload, FileCheck, AlertCircle, ShieldCheck, CreditCard, User, Lock } from 'lucide-react';
import { OSUN_LGAS, NIGERIAN_BANKS } from '../data/osunLgas';
import type { VenueSettings } from '../types';
import { apiService } from '../services/api';

interface RegistrationFormProps {
  venue: VenueSettings;
  onSuccess: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  venue,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [lga, setLga] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [consent, setConsent] = useState(false);

  // File upload state
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idFilePreview, setIdFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Form submitting state
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files || e.target.files.length === 0) {
      setIdFile(null);
      setIdFilePreview(null);
      return;
    }

    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setFileError('Invalid file format. Allowed formats: JPG, JPEG, PNG, WEBP, or PDF.');
      setIdFile(null);
      setIdFilePreview(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      setFileError('File size exceeds maximum limit of 5MB.');
      setIdFile(null);
      setIdFilePreview(null);
      return;
    }

    setIdFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIdFilePreview('pdf');
    }
  };

  const isFormValid = () => {
    return (
      fullName.trim() !== '' &&
      phone.trim().length >= 10 &&
      lga !== '' &&
      stateCode.trim() !== '' &&
      bankName !== '' &&
      accountName.trim() !== '' &&
      accountNumber.trim().length >= 10 &&
      idFile !== null &&
      consent &&
      venue.is_active
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!venue.is_active) {
      Swal.fire({
        icon: 'error',
        title: 'Attendance Closed',
        text: 'Corps member attendance submission is currently unavailable.',
        confirmButtonColor: '#E61C24',
      });
      return;
    }

    if (!idFile) {
      setFileError('Please upload your physical NYSC/Corps Member ID card.');
      return;
    }

    setSubmitting(true);

    try {
      // Create mock blob URL for demonstration file storage
      let blobUrl = idFilePreview && idFilePreview !== 'pdf' 
        ? idFilePreview 
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';

      const newRegistration = apiService.createRegistration({
        full_name: fullName.trim(),
        id_card_blob_url: blobUrl,
        id_card_filename: idFile.name,
        id_card_type: idFile.type,
        phone: phone.trim(),
        email: '',
        lga,
        state_code: stateCode.trim().toUpperCase(),
        bank_name: bankName,
        account_name: accountName.trim().toUpperCase(),
        account_number: accountNumber.trim(),
        location_verified: true,
      });

      setSubmitting(false);

      // SweetAlert2 Confirmation
      await Swal.fire({
        title: 'Attendance Submitted',
        html: `
          <div class="text-left py-2">
            <p class="text-gray-700 text-sm mb-3">Your attendance has been submitted successfully to the NBC Osun database.</p>
            <div class="bg-red-50 border border-red-200 rounded p-3 text-center">
              <span class="text-xs text-red-600 uppercase tracking-wider font-semibold block">Attendance Reference Number</span>
              <span class="text-lg font-bold text-[#E61C24] font-mono block mt-0.5">${newRegistration.registration_reference}</span>
            </div>
            <p class="text-xs text-gray-500 mt-3 text-center">Please save or screenshot this reference number for your records.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E61C24',
      });

      // Reset form
      setFullName('');
      setPhone('');
      setLga('');
      setStateCode('');
      setBankName('');
      setAccountName('');
      setAccountNumber('');
      setIdFile(null);
      setIdFilePreview(null);
      setConsent(false);

      onSuccess();
      window.location.reload();
    } catch (err: any) {
      setSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message || 'Please check your information and try again.',
        confirmButtonColor: '#E61C24',
      });
    }
  };

  const isClosed = !venue.is_active;

  return (
    <div className="relative">
      {/* FULL-SCREEN OVERLAY WHEN REGISTRATION IS CLOSED */}
      {isClosed && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 text-[#E61C24] flex items-center justify-center mx-auto border border-red-200">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Closed</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Corps member attendance submission is currently closed. Please check back later or contact portal administrators for schedule updates.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-500 font-medium">
              NBC Osun Portal Status: CLOSED
            </div>
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 sm:p-7">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Corps Member Attendance Form
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete all required fields below to confirm your attendance at the NBC Osun program.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-[#E61C24]" />
              <span>1. Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  disabled={isClosed || submitting}
                  placeholder="e.g. Adewale Adebayo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="nbc-input"
                />
              </div>

              {/* State Code */}
              <div>
                <label htmlFor="stateCode" className="block text-xs font-semibold text-slate-700 mb-1">
                  State Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="stateCode"
                  type="text"
                  required
                  disabled={isClosed || submitting}
                  placeholder="e.g. OS/25A/1234"
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="nbc-input uppercase font-mono"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  disabled={isClosed || submitting}
                  placeholder="e.g. 08031234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="nbc-input"
                />
              </div>

              {/* Local Government Area */}
              <div className="md:col-span-2">
                <label htmlFor="lga" className="block text-xs font-semibold text-slate-700 mb-1">
                  Local Government Area (Osun State) <span className="text-red-500">*</span>
                </label>
                <select
                  id="lga"
                  required
                  disabled={isClosed || submitting}
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="nbc-input cursor-pointer"
                >
                  <option value="">-- Select Osun LGA --</option>
                  {OSUN_LGAS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <Upload className="w-4 h-4 text-[#E61C24]" />
              <span>2. Upload NYSC ID Card</span>
            </h3>

            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 text-center">
              <input
                id="idCardUpload"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                disabled={isClosed || submitting}
                onChange={handleFileChange}
                className="hidden"
              />
              
              <label
                htmlFor="idCardUpload"
                className={`cursor-pointer inline-flex flex-col items-center justify-center ${
                  isClosed ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-red-50 text-[#E61C24] flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {idFile ? idFile.name : 'Click to Upload Physical NYSC ID Card'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supported formats: JPG, JPEG, PNG, WEBP, PDF (Max size: 5MB)
                </span>
              </label>

              {idFilePreview && (
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center space-x-3">
                  {idFilePreview === 'pdf' ? (
                    <div className="bg-red-100 text-[#E61C24] px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-2">
                      <FileCheck className="w-4 h-4" />
                      <span>PDF Document Uploaded ({idFile?.name})</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={idFilePreview}
                        alt="NYSC ID Preview"
                        className="h-28 object-contain rounded border border-slate-300 shadow-xs mx-auto"
                      />
                      <span className="text-xs text-slate-500 mt-1 block">Uploaded Image Preview</span>
                    </div>
                  )}
                </div>
              )}

              {fileError && (
                <p className="text-xs text-red-600 mt-2 font-medium flex items-center justify-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fileError}</span>
                </p>
              )}
            </div>
          </div>

          {/* Banking Information Section */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <CreditCard className="w-4 h-4 text-[#E61C24]" />
              <span>3. Bank Account Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bank Name */}
              <div>
                <label htmlFor="bankName" className="block text-xs font-semibold text-slate-700 mb-1">
                  Commercial Bank Name <span className="text-red-500">*</span>
                </label>
                <select
                  id="bankName"
                  required
                  disabled={isClosed || submitting}
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="nbc-input cursor-pointer"
                >
                  <option value="">-- Select Commercial Bank --</option>
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Name */}
              <div>
                <label htmlFor="accountName" className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="accountName"
                  type="text"
                  required
                  disabled={isClosed || submitting}
                  placeholder="Must match bank record"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="nbc-input uppercase"
                />
              </div>

              {/* Account Number */}
              <div>
                <label htmlFor="accountNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  maxLength={10}
                  required
                  disabled={isClosed || submitting}
                  placeholder="10-digit NUBAN"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  className="nbc-input font-mono"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Consent */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                disabled={isClosed || submitting}
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#E61C24] focus:ring-[#E61C24]"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                I hereby declare that all information provided is accurate and true. I authorize NBC Osun to process my personal details solely for attendance verification purposes.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid() || submitting}
              className="w-full nbc-btn-primary py-3.5 rounded-md text-sm font-bold flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>⟳ Submitting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
