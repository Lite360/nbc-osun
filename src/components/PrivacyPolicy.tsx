import { X, Shield, Eye, Database, UserCheck, Mail, Lock, Globe } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E61C24] to-[#C4121A] px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold tracking-tight">Privacy Policy</h2>
              <p className="text-red-100 text-xs">NBC Osun Corps Member Attendance Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          <p className="text-slate-500 text-xs">
            Last Updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">1. Overview</h3>
            </div>
            <p>
              The NBC Osun Corps Member Attendance Portal ("Portal") is operated by the Nigerian Bottling Company Osun State ("NBC Osun"). This Privacy Policy describes how we collect, use, store, and protect your personal information when you use our attendance services.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">2. Information We Collect</h3>
            </div>
            <p className="mb-2">When you submit your attendance through this portal, we collect the following personal information:</p>
            <ul className="space-y-1.5 ml-4 text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E61C24] mt-1.5 shrink-0"></span>
                <span><strong>Full Name</strong> — For identification and verification purposes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E61C24] mt-1.5 shrink-0"></span>
                <span><strong>NYSC ID Card</strong> — Uploaded image/document for identity verification</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E61C24] mt-1.5 shrink-0"></span>
                <span><strong>Phone Number & Email</strong> — For communication and duplicate prevention</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E61C24] mt-1.5 shrink-0"></span>
                <span><strong>Local Government Area (LGA)</strong> — Osun State LGA of deployment</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E61C24] mt-1.5 shrink-0"></span>
                <span><strong>State Code</strong> — Your unique NYSC state assignment code</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E61C24] mt-1.5 shrink-0"></span>
                <span><strong>Bank Details</strong> — Bank name, account name, and account number for payment processing</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <UserCheck className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">3. How We Use Your Information</h3>
            </div>
            <p className="mb-2">Your personal information is used exclusively for:</p>
            <ul className="space-y-1 ml-4 text-slate-600 list-disc list-inside">
              <li>Verifying your identity as a legitimate corps member</li>
              <li>Processing your registration for NBC Osun programs</li>
              <li>Preventing duplicate attendance submissions</li>
              <li>Facilitating payment disbursements through your provided bank details</li>
              <li>Communicating attendance status updates and important notices</li>
              <li>Generating aggregate, anonymized statistics for program improvement</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">4. Data Storage & Security</h3>
            </div>
            <p className="mb-2">
              We take the security of your data seriously. Your information is:
            </p>
            <ul className="space-y-1 ml-4 text-slate-600 list-disc list-inside">
              <li>Stored on secure servers with industry-standard encryption</li>
              <li>Accessible only to authorized NBC Osun administrators</li>
              <li>Protected by authentication and access control mechanisms</li>
              <li>Retained only for the duration necessary to fulfill the program objectives</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">5. Cookies & Local Storage</h3>
            </div>
            <p className="mb-2">This portal uses:</p>
            <ul className="space-y-1 ml-4 text-slate-600 list-disc list-inside">
              <li><strong>Essential local storage</strong> — Required for form functionality, admin session management, and attendance data caching</li>
              <li><strong>Cookie consent preferences</strong> — To remember your cookie choices</li>
            </ul>
            <p className="mt-2 text-slate-500 text-xs">
              No third-party tracking cookies or advertising technologies are used on this portal.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-4 h-4 text-[#E61C24]" />
              <h3 className="font-bold text-slate-900">6. Your Rights</h3>
            </div>
            <p className="mb-2">Under applicable Nigerian data protection regulations (NDPR), you have the right to:</p>
            <ul className="space-y-1 ml-4 text-slate-600 list-disc list-inside">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate personal data</li>
              <li>Request deletion of your personal data (subject to legal obligations)</li>
              <li>Withdraw your consent at any time</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              To exercise any of these rights, please contact the NBC Osun administration team.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">7. Contact Information</h3>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-600">
                For questions or concerns about this Privacy Policy, contact us at:
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1.5">NBC Osun Registration Team</p>
              <p className="text-xs text-slate-500">Email: admin@nbcosun.org</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-[#E61C24] text-white text-sm font-bold hover:bg-[#C4121A] transition shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
