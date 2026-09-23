import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldAlert } from 'lucide-react';
import { apiService } from '../../services/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@nbcosun.org');
  const [password, setPassword] = useState('nbcosun2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = apiService.loginAdmin(email, password);
      setLoading(false);

      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Authentication failed');
      }
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-lg shadow-md border border-slate-200 p-6 sm:p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#E61C24] flex items-center justify-center mx-auto mb-3 border border-red-100">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Admin Portal Authentication</h2>
        <p className="text-xs text-slate-500 mt-1">Authorized NBC Osun administrative access only.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-xs text-red-700 flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#E61C24] flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="adminEmail" className="block text-xs font-semibold text-slate-700 mb-1">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id="adminEmail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="nbc-input pl-9"
              placeholder="admin@nbcosun.org"
            />
          </div>
        </div>

        <div>
          <label htmlFor="adminPassword" className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              id="adminPassword"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="nbc-input pl-9"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="bg-slate-50 rounded border border-slate-200 p-2.5 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Demo Credentials:</span>
          <br />
          Email: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono">admin@nbcosun.org</code>
          <br />
          Password: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono">nbcosun2026</code>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full nbc-btn-primary py-3 rounded-md text-sm font-bold flex items-center justify-center space-x-2"
        >
          {loading ? <span>Authenticating...</span> : <span>Sign In to Admin Dashboard</span>}
        </button>
      </form>
    </div>
  );
};
