import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Target,
  Receipt,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: 'overview' | 'simulator' | 'trajectory' | 'commitments' | 'ledger';
  setActiveTab: (tab: 'overview' | 'simulator' | 'trajectory' | 'commitments' | 'ledger') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'simulator' as const, label: 'Decision Lab', icon: Sparkles },
    { id: 'trajectory' as const, label: 'Trajectory', icon: TrendingUp },
    { id: 'commitments' as const, label: 'Bills & Goals', icon: Target },
    { id: 'ledger' as const, label: 'Ledger', icon: Receipt },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-lg"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-400 font-semibold bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight whitespace-nowrap leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
