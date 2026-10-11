import React from 'react';
import { Calendar, RotateCcw, AlertTriangle, FastForward } from 'lucide-react';
import { TOTAL_DAYS } from '../utils/financeEngine';

interface TimelineScrubberProps {
  currentDay: number;
  onDayChange: (day: number) => void;
  brokeDay: number | null;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentDay,
  onDayChange,
  brokeDay,
}) => {
  const daysRemaining = TOTAL_DAYS - currentDay + 1;
  const progressPercent = ((currentDay - 1) / (TOTAL_DAYS - 1)) * 100;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">30-Day Cycle Time Machine</h2>
              <span className="text-xs font-mono text-emerald-300 font-semibold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                Day {currentDay} of 30
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining in this ₹10,000 cycle
              {brokeDay && (
                <span className="text-rose-400 ml-2 inline-flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 inline" /> Zero balance by Day {brokeDay}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick jump presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Jump to:</span>
          <button
            onClick={() => onDayChange(1)}
            aria-label="Jump to Day 1 month kickoff"
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              currentDay === 1
                ? 'bg-slate-700 text-white font-medium ring-1 ring-slate-500'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            D1 (Kickoff)
          </button>
          <button
            onClick={() => onDayChange(12)}
            aria-label="Jump to Day 12 present reality"
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              currentDay === 12
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            D12 (Today)
          </button>
          <button
            onClick={() => onDayChange(19)}
            aria-label="Jump to Day 19 mid-month bills"
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              currentDay === 19
                ? 'bg-slate-700 text-white font-medium ring-1 ring-slate-500'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            D19 (Recharge Due)
          </button>
          <button
            onClick={() => onDayChange(25)}
            aria-label="Jump to Day 25 salary crunch"
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              currentDay === 25
                ? 'bg-slate-700 text-white font-medium ring-1 ring-slate-500'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            D25 (Broke Week)
          </button>
          <button
            onClick={() => onDayChange(30)}
            aria-label="Jump to Day 30 finish"
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              currentDay === 30
                ? 'bg-slate-700 text-white font-medium ring-1 ring-slate-500'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            D30 (Finish)
          </button>
          <button
            onClick={() => onDayChange(12)}
            aria-label="Reset to Day 12 baseline"
            title="Reset to Day 12 baseline"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md transition-colors ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive slider track with precisely positioned labels */}
      <div className="space-y-2 pt-2 pb-1 relative">
        <div className="relative">
          <input
            type="range"
            min={1}
            max={TOTAL_DAYS}
            value={currentDay}
            onChange={(e) => onDayChange(Number(e.target.value))}
            aria-label="30-day budget timeline slider"
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
          />
        </div>

        {/* Dynamic labels aligned with exact percentage positions */}
        <div className="relative h-5 text-[11px] font-mono text-slate-400 select-none">
          <span className={`absolute left-0 ${currentDay === 1 ? 'text-emerald-300 font-semibold' : 'text-slate-400'}`}>
            Day 1
          </span>
          <span
            className={`absolute -translate-x-1/2 hidden sm:inline ${
              currentDay === 10 ? 'text-emerald-300 font-semibold' : 'text-slate-400'
            }`}
            style={{ left: `${(9 / 29) * 100}%` }}
          >
            Day 10
          </span>
          <span
            className={`absolute -translate-x-1/2 ${
              currentDay === 15 ? 'text-emerald-300 font-semibold' : 'text-slate-400'
            }`}
            style={{ left: `${(14 / 29) * 100}%` }}
          >
            Day 15 (Mid)
          </span>
          <span
            className={`absolute -translate-x-1/2 hidden sm:inline ${
              currentDay === 20 ? 'text-emerald-300 font-semibold' : 'text-slate-400'
            }`}
            style={{ left: `${(19 / 29) * 100}%` }}
          >
            Day 20
          </span>
          <span
            className={`absolute -translate-x-1/2 ${
              currentDay === 25 ? 'text-emerald-300 font-semibold' : 'text-slate-400'
            }`}
            style={{ left: `${(24 / 29) * 100}%` }}
          >
            Day 25<span className="hidden sm:inline"> (Crunch)</span>
          </span>
          <span className={`absolute right-0 ${currentDay === 30 ? 'text-emerald-300 font-semibold' : 'text-slate-400'}`}>
            Day 30
          </span>
        </div>
      </div>
    </div>
  );
};
