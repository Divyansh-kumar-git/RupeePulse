import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Check,
  HelpCircle,
  Flame,
  Split,
  Target,
  Clock,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  DecisionSimulationInput,
  SavingsGoal,
  SimulationMetrics,
  TransactionCategory,
  SpendingClassification,
} from '../types/finance';
import {
  formatINR,
  TOTAL_DAYS,
  FinancialStateContext,
  simulate,
} from '../utils/financeEngine';

interface DecisionSimulatorProps {
  currentDay: number;
  baseMetrics: SimulationMetrics;
  simulatedMetrics: SimulationMetrics;
  activeSimulation: DecisionSimulationInput | null;
  onUpdateSimulation: (sim: DecisionSimulationInput | null) => void;
  onCommitSimulation: (sim: DecisionSimulationInput) => void;
  savingsGoals: SavingsGoal[];
  stateContext: FinancialStateContext;
}

export const DecisionSimulator: React.FC<DecisionSimulatorProps> = ({
  currentDay,
  baseMetrics,
  simulatedMetrics: _externalSimulatedMetrics,
  activeSimulation,
  onUpdateSimulation,
  onCommitSimulation,
  savingsGoals,
  stateContext,
}) => {
  const daysRemaining = Math.max(1, TOTAL_DAYS - currentDay + 1);

  // Single draft object in state
  const defaultDraft: DecisionSimulationInput = {
    title: 'Weekend Cafe & Club Night',
    amount: 1200,
    category: 'Social & Night Out',
    classification: 'want',
    type: 'one_off',
    day: currentDay,
    targetGoalDeduction: '',
  };

  const [draft, setDraft] = useState<DecisionSimulationInput>(
    activeSimulation || defaultDraft
  );

  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [planBDraft, setPlanBDraft] = useState<DecisionSimulationInput>({
    title: 'Wait until Day 26 + Split 50/50',
    amount: 600,
    category: 'Social & Night Out',
    classification: 'want',
    type: 'one_off',
    day: Math.min(26, currentDay + 10),
    targetGoalDeduction: '',
  });

  // Calculate live preview metrics for draft and plan B from pure financial engine
  // This ensures preview deltas are ALWAYS active on mount WITHOUT mutating global activeSimulation
  const previewSimulation = React.useMemo(
    () => simulate(stateContext, draft),
    [stateContext, draft]
  );
  const effectiveSimMetrics = previewSimulation.metrics;

  const planBSimulation = React.useMemo(
    () => simulate(stateContext, planBDraft),
    [stateContext, planBDraft]
  );
  const planBMetrics = planBSimulation.metrics;

  const updateDraft = (updates: Partial<DecisionSimulationInput>) => {
    const updated = { ...draft, ...updates };
    setDraft(updated);
    // Only update global simulation if already armed globally
    if (activeSimulation) {
      onUpdateSimulation(updated);
    }
  };

  const handleApplyGlobally = () => {
    onUpdateSimulation(draft);
  };

  const handleDiscardSimulation = () => {
    onUpdateSimulation(null);
  };

  const handleReset = () => {
    setDraft(defaultDraft);
    onUpdateSimulation(null);
  };

  const handleCommit = () => {
    onCommitSimulation(draft);
    onUpdateSimulation(null);
  };

  // Instant Presets
  const presets = [
    {
      title: 'Zomato Swiggy Feast',
      amount: 450,
      category: 'Food & Dining' as TransactionCategory,
      type: 'one_off' as const,
      classification: 'want' as const,
      day: currentDay,
    },
    {
      title: 'Weekend Outing & Clubbing',
      amount: 1200,
      category: 'Social & Night Out' as TransactionCategory,
      type: 'one_off' as const,
      classification: 'want' as const,
      day: currentDay,
    },
    {
      title: 'ANC Bluetooth Earphones',
      amount: 1200,
      category: 'Shopping & Gear' as TransactionCategory,
      type: 'one_off' as const,
      classification: 'want' as const,
      day: currentDay,
    },
    {
      title: 'Gym & Fitness Pass',
      amount: 799,
      category: 'Subscriptions' as TransactionCategory,
      type: 'recurring_monthly' as const,
      classification: 'want' as const,
      day: Math.min(20, currentDay + 5),
    },
    {
      title: 'Freelance Design Windfall',
      amount: 1500,
      category: 'Gigs & Cashback' as TransactionCategory,
      type: 'income' as const,
      classification: 'savings' as const,
      day: currentDay,
    },
  ];

  // Deltas calculated live from effective preview metrics
  const dailyDelta = effectiveSimMetrics.safeDailyAllowance - baseMetrics.safeDailyAllowance;
  const balanceDelta = effectiveSimMetrics.currentBalance - baseMetrics.currentBalance;
  const healthDelta = effectiveSimMetrics.healthScore - baseMetrics.healthScore;

  // Selected goal dipped into
  const dippedGoal = savingsGoals.find((g) => g.id === draft.targetGoalDeduction);
  const dippedGoalDelay = effectiveSimMetrics.goalDelays.find(
    (gd) => gd.goalId === draft.targetGoalDeduction
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400">DECISION LAB</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300">Simulate Before You Swipe</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Test Financial Decisions in Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Model impending expenses, recurring bills, or windfalls on any cycle day. See how your safe allowance, bills,
              sinking funds, and risk radar react.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 border ${
                comparisonMode
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-medium'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>{comparisonMode ? 'Single Mode' : 'Plan A vs Plan B'}</span>
            </button>
            {activeSimulation ? (
              <button
                onClick={handleDiscardSimulation}
                className="px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/40 border border-rose-500/40 rounded-lg transition-colors flex items-center gap-1 font-medium"
              >
                <span>Discard What-If</span>
              </button>
            ) : (
              <button
                onClick={handleApplyGlobally}
                className="px-3 py-1.5 text-xs text-amber-300 hover:text-white bg-amber-950/40 border border-amber-500/40 rounded-lg transition-colors flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Arm Global What-If</span>
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleCommit}
              className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Commit to Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300">Instant Presets:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                updateDraft({
                  title: preset.title,
                  amount: preset.amount,
                  category: preset.category,
                  type: preset.type,
                  classification: preset.classification,
                  day: preset.day,
                  targetGoalDeduction: '',
                });
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                draft.title === preset.title && draft.amount === preset.amount
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs font-medium truncate">{preset.title}</div>
              <div className="text-xs font-mono font-bold mt-1 text-emerald-400">
                {preset.type === 'income' ? `+${formatINR(preset.amount)}` : formatINR(preset.amount)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Regret Meter Banner */}
      {draft.type !== 'income' && effectiveSimMetrics.regretDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-amber-950/20 border border-rose-500/30 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Gen Z Regret Meter
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-rose-400 font-mono font-semibold">
                  {effectiveSimMetrics.regretDays} Days of Allowance Consumed
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Spending {formatINR(draft.amount)} wipes out{' '}
                <strong className="text-white font-mono">{effectiveSimMetrics.regretDays} full days</strong> of your safe daily allowance ({formatINR(baseMetrics.safeDailyAllowance)}/day).
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <span className="text-xs text-slate-400">Status: </span>
            <span className="text-xs font-semibold text-rose-300 font-mono">
              {effectiveSimMetrics.cookedLabel}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Grid: Parameters (Left) vs Live Consequences (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Scenario Parameters</h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">Day {draft.day} of 30</span>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Decision Title</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => updateDraft({ title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              placeholder="e.g. Weekend Clubbing, New Phone Case"
            />
          </div>

          {/* Amount Slider + Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-medium">Amount</label>
              <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                {draft.type === 'income' ? `+${formatINR(draft.amount)}` : formatINR(draft.amount)}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={4000}
              step={50}
              value={draft.amount}
              onChange={(e) => updateDraft({ amount: Number(e.target.value) })}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
            />
            <div className="flex items-center gap-1.5 pt-1">
              {[250, 500, 1000, 1200, 2000].map((quickAmt) => (
                <button
                  key={quickAmt}
                  type="button"
                  onClick={() => updateDraft({ amount: quickAmt })}
                  className={`flex-1 py-1 text-[11px] font-mono rounded transition-colors ${
                    draft.amount === quickAmt
                      ? 'bg-emerald-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  ₹{quickAmt}
                </button>
              ))}
            </div>
          </div>

          {/* Execution Day Picker (Fix Issue 6) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Effective On Day (1-30)</span>
              </label>
              <span className="font-mono text-emerald-400 font-bold">Day {draft.day}</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={draft.day}
              onChange={(e) => updateDraft({ day: Number(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Day 1</span>
              <span>Today (D{currentDay})</span>
              <span>Day 30</span>
            </div>
          </div>

          {/* Nature of Transaction */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">Transaction Nature</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800/80 rounded-lg">
              <button
                type="button"
                onClick={() => updateDraft({ type: 'one_off' })}
                className={`py-1.5 text-xs font-medium rounded transition-colors ${
                  draft.type === 'one_off'
                    ? 'bg-slate-900 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                One-Off Spend
              </button>
              <button
                type="button"
                onClick={() => updateDraft({ type: 'recurring_monthly' })}
                className={`py-1.5 text-xs font-medium rounded transition-colors ${
                  draft.type === 'recurring_monthly'
                    ? 'bg-slate-900 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Recurring Bill
              </button>
              <button
                type="button"
                onClick={() => updateDraft({ type: 'income' })}
                className={`py-1.5 text-xs font-medium rounded transition-colors ${
                  draft.type === 'income'
                    ? 'bg-slate-900 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Windfall Income
              </button>
            </div>
          </div>

          {/* Spending Classification */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">50/30/20 Discipline Classification</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800/80 rounded-lg">
              <button
                type="button"
                onClick={() => updateDraft({ classification: 'need' })}
                className={`py-1.5 text-xs font-medium rounded transition-colors ${
                  draft.classification === 'need'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Need (50%)
              </button>
              <button
                type="button"
                onClick={() => updateDraft({ classification: 'want' })}
                className={`py-1.5 text-xs font-medium rounded transition-colors ${
                  draft.classification === 'want'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Want (30%)
              </button>
              <button
                type="button"
                onClick={() => updateDraft({ classification: 'savings' })}
                className={`py-1.5 text-xs font-medium rounded transition-colors ${
                  draft.classification === 'savings'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Savings (20%)
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Budget Category</label>
            <select
              value={draft.category}
              onChange={(e) => updateDraft({ category: e.target.value as TransactionCategory })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="Food & Dining">Food & Dining</option>
              <option value="Social & Night Out">Social & Night Out</option>
              <option value="Shopping & Gear">Shopping & Gear</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Transit & Commute">Transit & Commute</option>
              <option value="College & Study">College & Study</option>
              <option value="Health & Emergency">Health & Emergency</option>
              <option value="Gigs & Cashback">Gigs & Cashback</option>
            </select>
          </div>

          {/* Funding Source (Fix Issue 5) */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Funding Pool Source</label>
            <select
              value={draft.targetGoalDeduction || ''}
              onChange={(e) => updateDraft({ targetGoalDeduction: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="">Normal Liquid Cashflow (Standard)</option>
              {savingsGoals.map((g) => (
                <option key={g.id} value={g.id}>
                  Dip into Sinking Fund: {g.title} (Available: {formatINR(g.currentSaved)} · Rate: {formatINR(g.monthlyAllocation)}/mo)
                </option>
              ))}
            </select>
          </div>

          {/* Dipped Goal Live Details (Fix Issue 5: exact spillover calculation) */}
          {dippedGoal && dippedGoalDelay && (
            <div className="p-3.5 rounded-lg bg-cyan-950/25 border border-cyan-500/35 text-xs space-y-2">
              <div className="flex items-center justify-between text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>{dippedGoal.title}</span>
                </span>
                <span className="font-mono text-cyan-400">
                  {formatINR(dippedGoal.currentSaved)} ➔ {formatINR(dippedGoalDelay.newSaved)}
                </span>
              </div>
              <div className="text-slate-300 text-[11px] space-y-1">
                <div>
                  • Absorbed from goal: <strong className="text-emerald-400">{formatINR(dippedGoalDelay.absorbedFromGoal)}</strong>
                </div>
                {dippedGoalDelay.spilloverFromLiquid > 0 && (
                  <div>
                    • Spillover paid from cash: <strong className="text-amber-400">{formatINR(dippedGoalDelay.spilloverFromLiquid)}</strong>
                  </div>
                )}
                <div>
                  • Deadline impact:{' '}
                  {dippedGoalDelay.missesDeadline ? (
                    <strong className="text-rose-400">
                      Misses Day 30 deadline ({formatINR(dippedGoalDelay.shortfallAtDay30)} short)
                    </strong>
                  ) : (
                    <strong className="text-emerald-400">
                      On track for Day 30 target!
                    </strong>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Consequences Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">Before vs After Consequence Matrix</h3>
              <span className="text-xs text-emerald-400 font-semibold font-mono">
                {effectiveSimMetrics.cookedLabel}
              </span>
            </div>

            {/* Side-by-side metric tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Daily Allowance Impact */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Safe Daily Allowance</span>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {formatINR(effectiveSimMetrics.safeDailyAllowance)}
                    <span className="text-xs text-slate-400 font-normal ml-0.5">/d</span>
                  </div>
                  <div
                    className={`text-xs font-mono font-bold ${
                      dailyDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {dailyDelta >= 0 ? `+${formatINR(dailyDelta)}` : formatINR(dailyDelta)}/d
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 pt-1 flex items-center justify-between border-t border-slate-800/60">
                  <span>Current: {formatINR(baseMetrics.safeDailyAllowance)}/d</span>
                  <span className="text-slate-400">{daysRemaining} days left</span>
                </div>
              </div>

              {/* Liquid Balance Impact */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">True Spendable Liquid Pool</span>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {formatINR(effectiveSimMetrics.effectiveLiquid)}
                  </div>
                  <div
                    className={`text-xs font-mono font-bold ${
                      balanceDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {balanceDelta >= 0 ? `+${formatINR(balanceDelta)}` : formatINR(balanceDelta)}
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 pt-1 flex items-center justify-between border-t border-slate-800/60">
                  <span>Current: {formatINR(baseMetrics.effectiveLiquid)}</span>
                  <span className="text-slate-400">After bills & goals</span>
                </div>
              </div>

              {/* Cash Exhaustion Day / Broke Day */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Runway Status</span>
                <div className="flex items-baseline justify-between">
                  <div
                    className={`text-2xl font-bold font-mono tabular-nums ${
                      effectiveSimMetrics.brokeDay ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {effectiveSimMetrics.brokeDay ? `Zero on D${effectiveSimMetrics.brokeDay}` : 'Day 30+ (Safe)'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {effectiveSimMetrics.brokeDay
                      ? `${TOTAL_DAYS - effectiveSimMetrics.brokeDay} broke days`
                      : 'No deficit'}
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 pt-1 flex items-center justify-between border-t border-slate-800/60">
                  <span>
                    Forecast:{' '}
                    {effectiveSimMetrics.projectedMonthEndBalance < 0
                      ? `Short by ${formatINR(Math.abs(effectiveSimMetrics.projectedMonthEndBalance))}`
                      : formatINR(effectiveSimMetrics.projectedMonthEndBalance)}
                  </span>
                  <span className="text-slate-400">Pace burn</span>
                </div>
              </div>

              {/* Health Score Impact */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">Financial Health</span>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {effectiveSimMetrics.healthScore}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                  <div
                    className={`text-xs font-mono font-bold ${
                      healthDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {healthDelta >= 0 ? `+${healthDelta}` : healthDelta} pts
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 pt-1 flex items-center justify-between border-t border-slate-800/60">
                  <span>Baseline: {baseMetrics.healthScore}</span>
                  <span className="font-medium text-emerald-300">{effectiveSimMetrics.cookedLabel}</span>
                </div>
              </div>
            </div>

            {/* 4-Pillar Score Transparency (Fix Issue 7) */}
            <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300">
                Pillar-by-Pillar Health Score Breakdown (0-25 Each):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <div className="text-slate-400">Runway</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {baseMetrics.breakdown.runwayScore} ➔ {effectiveSimMetrics.breakdown.runwayScore}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <div className="text-slate-400">Pacing</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {baseMetrics.breakdown.budgetPacingScore} ➔ {effectiveSimMetrics.breakdown.budgetPacingScore}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <div className="text-slate-400">Bills Cover</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {baseMetrics.breakdown.commitmentsScore} ➔ {effectiveSimMetrics.breakdown.commitmentsScore}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <div className="text-slate-400">Buffer Fund</div>
                  <div className="font-mono font-bold text-white mt-0.5">
                    {baseMetrics.breakdown.bufferResilienceScore} ➔ {effectiveSimMetrics.breakdown.bufferResilienceScore}
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Goal Dynamic Impact Note */}
            <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">Savings & Goal Consequences:</span>
              <span className="font-medium text-slate-200">{effectiveSimMetrics.impactOnGoalsSummary}</span>
            </div>
          </div>

          {/* Actionable Trade-Off Box */}
          {draft.type === 'income' ? (
            <div className="bg-emerald-950/25 border border-emerald-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Windfall Capital Allocation Plan</span>
              </div>
              <p>
                Adding {formatINR(draft.amount)} on Day {draft.day} increases safe daily allowance by{' '}
                <strong className="text-white">+{formatINR(draft.amount / daysRemaining)}/day</strong>.
              </p>
              <p className="text-slate-400">
                Recommended: Siphon ₹500 into your Rainy Day Shield, keeping ₹1,000 to raise daily allowance to ₹175/day!
              </p>
            </div>
          ) : effectiveSimMetrics.brokeDay !== null ? (
            <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-rose-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>Runway Squeeze Warning</span>
              </div>
              <p>
                Spending {formatINR(draft.amount)} causes liquid reserves to exhaust on{' '}
                <strong className="text-rose-300">Day {effectiveSimMetrics.brokeDay}</strong> at current burn rate.
              </p>
              <div className="text-slate-300 pt-1 space-y-1">
                <span className="font-medium text-white">Actionable trade-offs to survive:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li>
                    Drop daily discretionary spend from {formatINR(baseMetrics.safeDailyAllowance)}/day to{' '}
                    <strong className="text-rose-300">{formatINR(effectiveSimMetrics.safeDailyAllowance)}/day</strong>.
                  </li>
                  <li>Or fund it from your Earphones sinking fund to protect liquid cash.</li>
                  <li>Or delay purchase to Day 26 to shorten the recovery period.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Trade-Off Analysis</span>
              </div>
              <p>
                This {formatINR(draft.amount)} expense reduces your daily limit by{' '}
                <strong className="text-rose-400">{formatINR(Math.abs(dailyDelta))}/day</strong> for the next {daysRemaining} days.
              </p>
              <p className="text-slate-400">
                Month-end cushion shifts from {formatINR(baseMetrics.projectedMonthEndBalance)} to{' '}
                {formatINR(effectiveSimMetrics.projectedMonthEndBalance)}. Emergency buffer remains safe.
              </p>
            </div>
          )}

          {/* Plan A vs Plan B Comparison */}
          {comparisonMode && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-400">Side-by-Side: Plan A vs Plan B</span>
                <span className="text-slate-400">Trade-Off Comparison</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 space-y-1">
                  <div className="font-semibold text-white">Plan A (Current)</div>
                  <div className="text-slate-400">{draft.title}</div>
                  <div className="font-mono text-emerald-400 font-bold">{formatINR(draft.amount)} on D{draft.day}</div>
                  <div className="text-[11px] text-slate-300 pt-1">
                    Daily Allowance: {formatINR(effectiveSimMetrics.safeDailyAllowance)}/d
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Regret: {effectiveSimMetrics.regretDays} days
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/60 border border-emerald-500/40 space-y-1">
                  <div className="font-semibold text-white">Plan B (Delay & Split)</div>
                  <div className="text-slate-400">{planBDraft.title}</div>
                  <div className="font-mono text-teal-400 font-bold">{formatINR(planBDraft.amount)} on D{planBDraft.day}</div>
                  <div className="text-[11px] text-slate-300 pt-1">
                    Daily Allowance: {formatINR(planBMetrics.safeDailyAllowance)}/d
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    Saves +{formatINR(draft.amount - planBDraft.amount)} in cash!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
