import React from 'react';

export type AppSection = 'overview' | 'tenses' | 'relative' | 'vstep-vocab' | 'vstep-game';

interface HeaderProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const navItems: { id: AppSection; label: string }[] = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'tenses', label: '1. Các thì' },
    { id: 'relative', label: '2. Mệnh đề quan hệ' },
    { id: 'vstep-vocab', label: '3. Từ vựng VSTEP' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 rounded"
        >
          Nền Tảng Anh Ngữ
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 ${
                  isActive
                    ? 'border-blue-700 text-slate-950 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('vstep-game')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 ${
              activeSection === 'vstep-game'
                ? 'bg-blue-800 text-white'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
          >
            Game nghe VSTEP
          </button>
        </div>
      </div>

      {/* Mobile compact single-line horizontal nav */}
      <nav
        aria-label="Điều hướng di động"
        className="md:hidden border-t border-slate-100 bg-white px-4 py-2 flex items-center gap-4 overflow-x-auto"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`text-xs font-medium py-1 border-b-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-blue-700 text-slate-950 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
