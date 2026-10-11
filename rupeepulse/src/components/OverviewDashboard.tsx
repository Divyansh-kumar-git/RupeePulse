import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Sparkles,
  ArrowRight,
  Coffee,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
} from 'lucide-react';
import {
  FinancialHealthBreakdown,
  SimulationMetrics,
  SpendingClassification,
  Transaction,
  BudgetChallenge,
} from '../types/finance';
import { formatINR, TOTAL_DAYS } from '../utils/financeEngine';
import { motion } from 'motion/react';

interface OverviewDashboardProps {
  metrics: SimulationMetrics;
  health: FinancialHealthBreakdown;
  currentDay: number;
  transactions: Transaction[];
  challenges: BudgetChallenge[];
  onToggleChallenge: (id: string) => void;
  onNavigateToSimulator: (presetAmount?: number, presetTitle?: string) => void;
  onNavigateToTrajectory: () => void;
  onNavigateToGoals: () => void;
  hasActiveSimulation: boolean;
  onClearSimulation?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  metrics,
  health,
  currentDay,
  transactions,
  challenges,
  onToggleChallenge,
  onNavigateToSimulator,
  onNavigateToTrajectory,
  onNavigateToGoals,
  hasActiveSimulation,
  onClearSimulation,
}) => {
  const daysRemaining = TOTAL_DAYS - currentDay + 1;

  // Calculate 50/30/20 actual breakdown
  const totalExpenses = transactions
    .filter((tx) => tx.day <= currentDay && tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const needsSpent = transactions
    .filter((tx) => tx.day <= currentDay && tx.type === 'expense' && tx.classification === 'need')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const wantsSpent = transactions
    .filter((tx) => tx.day <= currentDay && tx.type === 'expense' && tx.classification === 'want')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Health status badge styling
  const getHealthBadge = (status: FinancialHealthBreakdown['status']) => {
    switch (status) {
      case 'thriving':
        return { label: 'Thriving', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'stable':
        return { label: 'Stable', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
      case 'caution':
        return { label: 'Caution Required', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'critical':
        return { label: 'High Risk / Squeezed', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    }
  };

  const healthBadge = getHealthBadge(health.status);

  return (
    <div className="space-y-6">
      {/* Simulation Active Notice Banner */}
      {hasActiveSimulation && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-300">
                Active &quot;What-If&quot; Simulation Mode Applied
              </p>
              <p className="text-xs text-amber-400/80 mt-0.5">
                The figures below reflect your hypothetical scenario. Review or dismiss to see your real baseline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onClearSimulation && (
              <button
                onClick={onClearSimulation}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Clear What-If
              </button>
            )}
            <button
              onClick={() => onNavigateToSimulator()}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap"
            >
              Review Simulation
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Grid (4 Columns) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Safe Daily Allowance */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Safe Daily Allowance</span>
            <span className="font-mono text-emerald-400 font-medium">{daysRemaining} days left</span>
          </div>
          <motion.div
            key={metrics.safeDailyAllowance}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white tabular-nums"
          >
            {formatINR(metrics.safeDailyAllowance)}
            <span className="text-sm font-normal text-slate-400 ml-1">/ day</span>
          </motion.div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Max spend pace today</span>
            <span className="text-slate-300">Goal: ~₹140/d</span>
          </div>
        </div>

        {/* Card 2: Effective Liquid Balance */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>True Liquid Funds</span>
            <Wallet className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <motion.div
            key={metrics.effectiveLiquid}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white tabular-nums"
          >
            {formatINR(metrics.effectiveLiquid)}
          </motion.div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Total Bank Balance</span>
            <span className="font-mono text-slate-300">{formatINR(metrics.currentBalance)}</span>
          </div>
        </div>

        {/* Card 3: Financial Health Index */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Financial Health</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${healthBadge.color}`}>
              {health.cookedLabel || healthBadge.label}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={health.score}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white tabular-nums"
            >
              {health.score}
            </motion.span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-1.5">
            <div title={`Runway: ${health.runwayScore}/25`} className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(health.runwayScore / 25) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-emerald-400"
              />
            </div>
            <div title={`Pacing: ${health.budgetPacingScore}/25`} className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(health.budgetPacingScore / 25) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-teal-400"
              />
            </div>
            <div title={`Bills: ${health.commitmentsScore}/25`} className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(health.commitmentsScore / 25) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-cyan-400"
              />
            </div>
            <div title={`Buffer: ${health.bufferResilienceScore}/25`} className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(health.bufferResilienceScore / 25) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Card 4: End-of-Month Forecast */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Day 30 Forecast</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
          </div>
          {metrics.brokeDay ? (
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-rose-400 tabular-nums">
                Day {metrics.brokeDay}
              </div>
              <p className="text-xs text-rose-400/90 mt-1">Projected zero-cash date</p>
            </div>
          ) : (
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
                {formatINR(metrics.projectedMonthEndBalance)}
              </div>
              <p className="text-xs text-slate-400 mt-1">Projected end surplus</p>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Forecast model</span>
            <button
              onClick={onNavigateToTrajectory}
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
            >
              View Curve <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Interactive Simulator Callout - The Hero Value Prop */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>SIMULATE BEFORE YOU SWIPE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Wondering if you can afford a weekend night out or new tech?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Test how any impulse purchase or unexpected expense compresses your daily allowance and delays your savings goals before spending a single rupee.
            </p>
          </div>

          {/* Quick Simulation Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateToSimulator(450, 'Zomato Party Order')}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800/80 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Test Swiggy ₹450
            </button>
            <button
              onClick={() => onNavigateToSimulator(1200, 'Weekend Cafe & Club Night')}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800/80 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Test Club Night ₹1,200
            </button>
            <button
              onClick={() => onNavigateToSimulator(1500, 'Noise Cancelling Earphones')}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800/80 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Test Gadget ₹1,500
            </button>
            <button
              onClick={() => onNavigateToSimulator()}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
            >
              <span>Custom Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: 50/30/20 Breakdown & Gen Z Micro-Leaks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gen Z 50/30/20 Rule Reality Check */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">50 / 30 / 20 Budget Discipline</h3>
              <p className="text-xs text-slate-400 mt-0.5">₹10,000 monthly distribution target</p>
            </div>
            <button
              onClick={onNavigateToGoals}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
            >
              Goals & Bills <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Progress Stack */}
          <div className="space-y-3 pt-1">
            {/* Needs */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300 font-medium">Needs (Target: 50% / ₹5,000)</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {formatINR(needsSpent)} spent ({Math.round((needsSpent / 5000) * 100)}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (needsSpent / 5000) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Hostel mess, Wi-Fi share, metro card, study supplies.
              </p>
            </div>

            {/* Wants */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300 font-medium">Wants (Target: 30% / ₹3,000)</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {formatINR(wantsSpent)} spent ({Math.round((wantsSpent / 3000) * 100)}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    wantsSpent > 2500 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (wantsSpent / 3000) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Weekend movie, biryani delivery, coffee, flea market clothes.
              </p>
            </div>

            {/* Savings Buffer */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300 font-medium">Savings Shield (Target: 20% / ₹2,000)</span>
                <span className="font-mono text-slate-400 tabular-nums">
                  ₹1,600 reserved (80%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-400 transition-all duration-500"
                  style={{ width: '80%' }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Emergency cushion (₹1,000 locked) + Earphones fund (₹400) + Trip fund (₹200).
              </p>
            </div>
          </div>
        </div>

        {/* Micro-Leaks & Gen Z Financial Traps */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Gen Z Micro-Leak Auditor</h3>
            </div>
            <span className="text-xs text-slate-400">Impact over 30 days</span>
          </div>

          <p className="text-xs text-slate-400">
            Small daily habits quietly devour huge chunks of a ₹10,000 monthly pool:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-200">Daily Campus Chai & Bun (₹40/day)</div>
                <div className="text-[11px] text-slate-400">₹1,200/month = 12% of total budget</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-medium text-amber-400">-₹1,200</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-200">Late-Night Delivery Convenience Fees</div>
                <div className="text-[11px] text-slate-400">Delivery surges + platform fees on 6 orders</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-medium text-amber-400">-₹420</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-200">Auto Surge vs Metro Smartcard</div>
                <div className="text-[11px] text-slate-400">Taking auto instead of metro when running late</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-medium text-amber-400">-₹380</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gen Z Financial Sprints & Challenges */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Active Financial Sprint Challenges</h3>
          </div>
          <span className="text-xs text-slate-400">Boost your daily allowance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-3.5 rounded-xl border transition-all ${
                challenge.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                  : challenge.active
                  ? 'bg-slate-800/60 border-slate-700 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-xs font-semibold leading-tight">{challenge.title}</h4>
                <button
                  onClick={() => onToggleChallenge(challenge.id)}
                  className={`p-1 rounded transition-colors ${
                    challenge.completed
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={challenge.completed ? 'Completed' : 'Toggle status'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                {challenge.subtitle}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{challenge.durationDays} day challenge</span>
                <span className="font-mono font-medium text-emerald-400">
                  +{formatINR(challenge.estimatedSaving)} pool boost
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
