import React from 'react';
import { Shield, Lock, UserCheck, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  isAdminView: boolean;
  onToggleAdminView: () => void;
  isAdminLoggedIn?: boolean;
  onLogoutAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdminView,
  onToggleAdminView,
  isAdminLoggedIn,
  onLogoutAdmin,
}) => {
  return (
    <header className="bg-[#E61C24] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white text-[#E61C24] flex items-center justify-center font-bold text-xl shadow-sm border border-red-100">
            NBC
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              NBC OSUN
            </h1>
            <p className="text-xs text-red-100 font-medium">
              Corps Member Registration & Verification Portal
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-2">
          {isAdminView ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleAdminView}
                className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md transition font-medium border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Public Form</span>
              </button>
              {isAdminLoggedIn && onLogoutAdmin && (
                <button
                  onClick={onLogoutAdmin}
                  className="bg-white text-[#E61C24] hover:bg-red-50 text-xs sm:text-sm px-3 py-1.5 rounded-md font-semibold transition shadow-sm"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onToggleAdminView}
              className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md transition font-medium border border-white/20"
              title="Admin Portal Access"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
