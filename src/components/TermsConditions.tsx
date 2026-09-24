import { X, FileText, AlertTriangle, CheckCircle, Users, Scale, Ban, RefreshCw } from 'lucide-react';

interface TermsConditionsProps {
  onClose: () => void;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold tracking-tight">Terms & Conditions</h2>
              <p className="text-slate-400 text-xs">NBC Osun Corps Member Attendance Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          <p className="text-slate-500 text-xs">
            Effective Date: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              By using this attendance portal, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this portal.
            </p>
          </div>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">1. Acceptance of Terms</h3>
            </div>
            <p>
              By accessing and submitting attendance through the NBC Osun Corps Member Attendance Portal ("Portal"), you acknowledge that you have read, understood, and agree to abide by these Terms and Conditions. These terms apply to all users of the Portal, including corps members, administrators, and visitors.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">2. Eligibility</h3>
            </div>
            <p className="mb-2">To use this attendance portal, you must:</p>
            <ul className="space-y-1 ml-4 text-slate-600 list-disc list-inside">
              <li>Be a currently serving National Youth Service Corps (NYSC) member deployed to Osun State</li>
              <li>Possess a valid NYSC ID card issued by the National Youth Service Corps</li>
              <li>Have a valid Nigerian bank account in your name for payment processing</li>
              <li>Provide accurate and truthful information in all attendance fields</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">3. Attendance Process</h3>
            </div>
            <ul className="space-y-1.5 ml-4 text-slate-600 list-disc list-inside">
              <li>Each corps member may only submit attendance once per session. Duplicate submissions using the same State Code or phone number will be flagged.</li>
              <li>A unique reference number (format: NBC-OSUN-YEAR-XXXXXX) will be generated upon successful attendance submission.</li>
              <li>Attendance submissions are subject to manual verification and approval by NBC Osun administrators.</li>
              <li>Attendance submission is only valid when the portal's attendance status is set to "Active" by administrators.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <Scale className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">4. User Obligations</h3>
            </div>
            <p className="mb-2">As a user of this Portal, you agree to:</p>
            <ul className="space-y-1 ml-4 text-slate-600 list-disc list-inside">
              <li>Provide only accurate, current, and complete information</li>
              <li>Upload a clear, readable, and authentic NYSC ID card image</li>
              <li>Not attempt to submit attendance on behalf of another person</li>
              <li>Not manipulate, tamper with, or exploit the Portal in any way</li>
              <li>Not use automated tools, bots, or scripts to interact with the Portal</li>
              <li>Comply with all applicable Nigerian laws and regulations</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <Ban className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">5. Prohibited Activities</h3>
            </div>
            <p className="mb-2">The following actions are strictly prohibited:</p>
            <ul className="space-y-1 ml-4 text-slate-600 list-disc list-inside">
              <li>Submitting fraudulent, falsified, or misleading attendance information</li>
              <li>Uploading forged or altered NYSC identity documents</li>
              <li>Attempting to bypass attendance controls or security mechanisms</li>
              <li>Accessing or attempting to access the administrative panel without authorization</li>
              <li>Sharing admin login credentials with unauthorized persons</li>
            </ul>
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
              Violation of these terms may result in attendance rejection, account suspension, and/or referral to appropriate authorities.
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <RefreshCw className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">6. Modifications to Service</h3>
            </div>
            <p>
              NBC Osun reserves the right to modify, suspend, or discontinue the Portal at any time, with or without notice. We may also update these Terms and Conditions periodically. Continued use of the Portal after any modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">7. Limitation of Liability</h3>
            <p>
              NBC Osun shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the Portal, including but not limited to data loss, attendance failures, or service interruptions.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">8. Governing Law</h3>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising under these terms shall be subject to the jurisdiction of Nigerian courts.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">9. Contact Information</h3>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-600">
                For questions about these Terms and Conditions, please contact:
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1.5">NBC Osun Attendance Team</p>
              <p className="text-xs text-slate-500">Email: admin@nbcosun.org</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
