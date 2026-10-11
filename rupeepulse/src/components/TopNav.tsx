import React from 'react';
import { Sparkles, Plus, AlertCircle } from 'lucide-react';

interface TopNavProps {
  activeTab: 'overview' | 'simulator' | 'trajectory' | 'commitments' | 'ledger';
  setActiveTab: (tab: 'overview' | 'simulator' | 'trajectory' | 'commitments' | 'ledger') => void;
  onOpenSimulate: () => void;
  onOpenAddTx: () => void;
  onTriggerShock: () => void;
  healthScore: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulate,
  onOpenAddTx,
  onTriggerShock,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('overview')}
            aria-label="Go to RupeePulse overview"
            className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-base">
              ₹
            </span>
            <span className="tracking-tight">RupeePulse</span>
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
                activeTab === 'overview'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Decision Lab</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>
            <button
              onClick={() => setActiveTab('trajectory')}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
                activeTab === 'trajectory'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              30-Day Trajectory
            </button>
            <button
              onClick={() => setActiveTab('commitments')}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
                activeTab === 'commitments'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Bills & Goals
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
                activeTab === 'ledger'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Ledger
            </button>
          </nav>

          {/* Zone 3: 1 primary action button and secondary utilities */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onTriggerShock}
              aria-label="Test budget with life shock event"
              title="Test budget with random life event"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors whitespace-nowrap shrink-0"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Life Shock</span>
            </button>
            <button
              onClick={onOpenAddTx}
              aria-label="Record expense or income"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Spend</span>
            </button>
            <button
              onClick={onOpenSimulate}
              aria-label="Open Decision Simulator"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 active:bg-emerald-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Decision</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
