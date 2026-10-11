import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Info,
  DollarSign,
  TrendingDown,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Commitment, SimulationMetrics, Transaction } from '../types/finance';
import { formatINR, TOTAL_DAYS } from '../utils/financeEngine';

interface TrajectoryChartProps {
  currentDay: number;
  onDaySelect: (day: number) => void;
  projectedBalances: {
    day: number;
    balance: number;
    simulatedBalance?: number;
    allowanceTrajectoryBalance: number;
    projectedGoalSavings?: number;
    safeAllowance: number;
    daySpend?: number;
  }[];
  commitments: Commitment[];
  transactions: Transaction[];
  metrics: SimulationMetrics;
  hasActiveSimulation: boolean;
}

export const TrajectoryChart: React.FC<TrajectoryChartProps> = ({
  currentDay,
  onDaySelect,
  projectedBalances,
  commitments,
  transactions,
  metrics,
  hasActiveSimulation,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(currentDay);
  const [calendarMode, setCalendarMode] = useState<'balances' | 'spends'>('balances');

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 35, left: 105 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Max and Min balance values for scale
  const maxVal = 10500;
  const minVal = -1500; // room for negative deficit

  const getX = (day: number) => padding.left + ((day - 1) / (TOTAL_DAYS - 1)) * graphWidth;
  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const normalized = (clamped - minVal) / (maxVal - minVal);
    return padding.top + (1 - normalized) * graphHeight;
  };

  const zeroY = getY(0);

  // Generate SVG paths
  // 1. Current Pace Baseline:
  const pacePath = projectedBalances.reduce((acc, pt, idx) => {
    const cmd = idx === 0 ? 'M' : 'L';
    return `${acc} ${cmd} ${getX(pt.day)} ${getY(pt.balance)}`;
  }, '');

  // 2. Safe Allowance Trajectory Line:
  const allowancePath = projectedBalances.reduce((acc, pt, idx) => {
    const cmd = idx === 0 ? 'M' : 'L';
    return `${acc} ${cmd} ${getX(pt.day)} ${getY(pt.allowanceTrajectoryBalance)}`;
  }, '');

  // 3. Simulated Balance Path (if active)
  const simPath = hasActiveSimulation
    ? projectedBalances.reduce((acc, pt, idx) => {
        const val = pt.simulatedBalance !== undefined ? pt.simulatedBalance : pt.balance;
        const cmd = idx === 0 ? 'M' : 'L';
        return `${acc} ${cmd} ${getX(pt.day)} ${getY(val)}`;
      }, '')
    : null;

  // 4. Savings Goals Floor (Issue 3):
  const goalsFloorPath = projectedBalances.reduce((acc, pt, idx) => {
    if (pt.projectedGoalSavings === undefined) return acc;
    const cmd = idx === 0 ? 'M' : 'L';
    return `${acc} ${cmd} ${getX(pt.day)} ${getY(pt.projectedGoalSavings)}`;
  }, '');

  // Hovered day details
  const activeHoverPoint = projectedBalances.find((p) => p.day === (hoveredDay || currentDay));
  const activeDayCommitments = commitments.filter(
    (c) => c.dueDay === (hoveredDay || currentDay)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400">BURNDOWN TRAJECTORY</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300">Dual Pacing Cashflow Forecast</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
              ₹10,000 Cashflow Runway & Deficit Floor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Compares your trajectory at current discretionary burn pace vs strictly adhering to safe daily allowance.
            </p>
          </div>

          <div className="flex items-center gap-3.5 text-xs font-mono text-slate-300 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-emerald-400"></span>
              <span>Current Pace</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-cyan-400"></span>
              <span>Safe Allowance Pace</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-violet-400 border-b border-dashed border-violet-400"></span>
              <span>Savings Target (₹{metrics.projectedDay30TotalSavings})</span>
            </div>
            {hasActiveSimulation && (
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-amber-400 stroke-dashed"></span>
                <span>Simulated</span>
              </div>
            )}
          </div>
        </div>

        {/* SVG Interactive Chart */}
        <div className="mt-6 w-full overflow-x-auto">
          <div className="min-w-[650px] relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible"
              onMouseLeave={() => setHoveredDay(currentDay)}
            >
              {/* Grid Lines */}
              {[10000, 7500, 5000, 2500, 0, -1000].map((tick) => {
                const y = getY(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke={tick === 0 ? '#ef4444' : '#1e293b'}
                      strokeWidth={tick === 0 ? 1.5 : 1}
                      strokeDasharray={tick === 0 ? '4 3' : '2 4'}
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3.5}
                      fill={tick <= 0 ? '#ef4444' : '#94a3b8'}
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="JetBrains Mono"
                      className="tabular-nums"
                    >
                      {tick === 0 ? '₹0 Floor' : tick < 0 ? `-₹${Math.abs(tick)} Deficit` : `₹${tick}`}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Day markers */}
              {[1, 5, 10, 15, 20, 25, 30].map((d) => {
                const x = getX(d);
                return (
                  <g key={d}>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={svgHeight - padding.bottom}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={svgHeight - padding.bottom + 16}
                      fill={d === currentDay ? '#34d399' : '#94a3b8'}
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono"
                      fontWeight={d === currentDay ? 'bold' : 'normal'}
                    >
                      D{d}
                    </text>
                  </g>
                );
              })}

              {/* Current Day Vertical Indicator Line */}
              <line
                x1={getX(currentDay)}
                y1={padding.top}
                x2={getX(currentDay)}
                y2={svgHeight - padding.bottom}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Goals Floor: Protected Savings Target (Issue 3) */}
              {goalsFloorPath && (
                <path
                  d={goalsFloorPath}
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.75"
                />
              )}

              {/* Line B: Safe Allowance Trajectory */}
              <path
                d={allowancePath}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity="0.85"
              />

              {/* Line A: Current Discretionary Pace */}
              <path
                d={pacePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Simulated Balance Path (if active) */}
              {simPath && (
                <path
                  d={simPath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive hover overlays */}
              {projectedBalances.map((pt) => {
                const x = getX(pt.day);
                const isHovered = hoveredDay === pt.day;
                const isCurrent = currentDay === pt.day;
                const val = hasActiveSimulation && pt.simulatedBalance !== undefined ? pt.simulatedBalance : pt.balance;
                const y = getY(val);

                return (
                  <g
                    key={pt.day}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDay(pt.day)}
                    onClick={() => onDaySelect(pt.day)}
                  >
                    {/* Transparent hover capture rect */}
                    <rect
                      x={x - graphWidth / (TOTAL_DAYS * 2)}
                      y={padding.top}
                      width={graphWidth / TOTAL_DAYS}
                      height={graphHeight}
                      fill="transparent"
                    />

                    {/* Point circles */}
                    {(isHovered || isCurrent || pt.day === 1 || pt.day === 30) && (
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 5 : 3.5}
                        fill={val <= 0 ? '#ef4444' : hasActiveSimulation ? '#f59e0b' : '#10b981'}
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hover / Selected Day Detail Strip */}
        {activeHoverPoint && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-white text-sm">
                Day {activeHoverPoint.day} of 30
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">
                Pace Balance:{' '}
                <strong
                  className={`font-mono tabular-nums ${
                    (activeHoverPoint.simulatedBalance ?? activeHoverPoint.balance) <= 0
                      ? 'text-rose-400 font-bold'
                      : 'text-emerald-400 font-bold'
                  }`}
                >
                  {(activeHoverPoint.simulatedBalance ?? activeHoverPoint.balance) < 0
                    ? `Short by ${formatINR(Math.abs(activeHoverPoint.simulatedBalance ?? activeHoverPoint.balance))}`
                    : formatINR(activeHoverPoint.simulatedBalance ?? activeHoverPoint.balance)}
                </strong>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">
                Safe Target Balance:{' '}
                <strong className="font-mono text-cyan-400">
                  {formatINR(activeHoverPoint.allowanceTrajectoryBalance)}
                </strong>
              </span>
            </div>

            {/* Commitments on this day */}
            <div className="flex items-center gap-2">
              {activeDayCommitments.length > 0 ? (
                <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md">
                  <Info className="w-3 h-3" />
                  <span>
                    Due Today: {activeDayCommitments.map((c) => `${c.title} (${formatINR(c.amount)})`).join(', ')}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400">No scheduled bills on this day</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 30-Day Grid Calendar View with explicit Mode Toggle */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">30-Day Cashflow Calendar & Deficit Check</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Display:</span>
            <div className="p-0.5 bg-slate-800 rounded-lg flex items-center text-xs">
              <button
                type="button"
                onClick={() => setCalendarMode('balances')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  calendarMode === 'balances'
                    ? 'bg-slate-900 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Projected Balances
              </button>
              <button
                type="button"
                onClick={() => setCalendarMode('spends')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  calendarMode === 'spends'
                    ? 'bg-slate-900 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily Outflow Spends
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((dayNum) => {
            const isPast = dayNum < currentDay;
            const isToday = dayNum === currentDay;

            // Day commitments
            const dayCommitment = commitments.find((c) => c.dueDay === dayNum);

            // Forecast point for day
            const dayForecast = projectedBalances.find((p) => p.day === dayNum);
            const forecastedBalance = dayForecast
              ? dayForecast.simulatedBalance ?? dayForecast.balance
              : 0;
            const isDeficit = forecastedBalance < 0;

            // Day actual or projected spend
            const dayActualSpend = transactions
              .filter((t) => t.day === dayNum && t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            const displaySpend = isPast ? dayActualSpend : (dayForecast?.daySpend ?? 0);

            return (
              <button
                key={dayNum}
                onClick={() => onDaySelect(dayNum)}
                className={`p-2 rounded-lg border text-left transition-all relative ${
                  isToday
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : isDeficit
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : isPast
                    ? 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-900/30 border-slate-800/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className={isToday ? 'font-bold text-emerald-300' : 'text-slate-400'}>
                    D{dayNum}
                  </span>
                  {dayCommitment && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title={`Bill: ${dayCommitment.title}`} />
                  )}
                </div>

                <div className="mt-1 font-mono text-[11px] tabular-nums">
                  {calendarMode === 'balances' ? (
                    isToday ? (
                      <div>
                        <span className="text-emerald-300 font-semibold">{formatINR(forecastedBalance)}</span>
                        <div className="text-[9px] text-emerald-400 font-sans">Today</div>
                      </div>
                    ) : isDeficit ? (
                      <div>
                        <span className="text-rose-400 font-bold">-{formatINR(Math.abs(forecastedBalance))}</span>
                        <div className="text-[9px] text-rose-400/80 font-sans">Shortfall</div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-slate-200">{formatINR(forecastedBalance)}</span>
                        <div className="text-[9px] text-slate-400 font-sans">{isPast ? 'Bal' : 'Proj Bal'}</div>
                      </div>
                    )
                  ) : (
                    <div>
                      <span className={displaySpend > 300 ? 'text-amber-400' : 'text-slate-200'}>
                        {formatINR(displaySpend)}
                      </span>
                      <div className="text-[9px] text-slate-400 font-sans">{isPast ? 'Spent' : 'Proj Outflow'}</div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-xs text-slate-300 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500"></span>
            <span>Current Day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Scheduled Bill</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500/50"></span>
            <span>Shortfall / Zero Floor Deficit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
