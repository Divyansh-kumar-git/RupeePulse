import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  CreditCard,
  Target,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { Commitment, SavingsGoal, TransactionCategory } from '../types/finance';
import { formatINR } from '../utils/financeEngine';

interface CommitmentsAndGoalsProps {
  commitments: Commitment[];
  savingsGoals: SavingsGoal[];
  onToggleCommitmentPaid: (id: string) => void;
  onDeleteCommitment: (id: string) => void;
  onAddCommitment: (commitment: Omit<Commitment, 'id'>) => void;
  onUpdateGoalSaved: (id: string, delta: number) => void;
  onAddSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onDeleteGoal: (id: string) => void;
  currentDay: number;
}

export const CommitmentsAndGoals: React.FC<CommitmentsAndGoalsProps> = ({
  commitments,
  savingsGoals,
  onToggleCommitmentPaid,
  onDeleteCommitment,
  onAddCommitment,
  onUpdateGoalSaved,
  onAddSavingsGoal,
  onDeleteGoal,
  currentDay,
}) => {
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // Bill Form State
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState<number>(199);
  const [billDueDay, setBillDueDay] = useState<number>(20);
  const [billCategory, setBillCategory] = useState<TransactionCategory>('Subscriptions');
  const [isSubscription, setIsSubscription] = useState(true);

  // Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState<number>(1000);
  const [goalInitial, setGoalInitial] = useState<number>(200);
  const [goalPriority, setGoalPriority] = useState<'emergency_buffer' | 'essential_goal' | 'lifestyle'>('essential_goal');

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billTitle.trim()) return;
    onAddCommitment({
      title: billTitle.trim(),
      amount: billAmount,
      dueDay: billDueDay,
      category: billCategory,
      isPaid: false,
      isSubscription,
      frequency: 'Monthly',
    });
    setBillTitle('');
    setShowAddBillModal(false);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const monthly = Math.max(100, Math.round(goalTarget / 3));
    const daily = Math.max(3.3, Math.round((monthly / 30) * 10) / 10);

    onAddSavingsGoal({
      title: goalTitle.trim(),
      targetAmount: goalTarget,
      currentSaved: goalInitial,
      monthlyAllocation: monthly,
      dailyContribution: daily,
      priority: goalPriority,
      lockedUntilEnd: goalPriority === 'emergency_buffer',
      deadlineDay: 30,
      color: goalPriority === 'emergency_buffer' ? '#10b981' : '#06b6d4',
    });
    setGoalTitle('');
    setShowAddGoalModal(false);
  };

  const totalMonthlyCommitments = commitments.reduce((sum, c) => sum + c.amount, 0);
  const totalUpcomingUnpaid = commitments
    .filter((c) => !c.isPaid && c.dueDay >= currentDay)
    .reduce((sum, c) => sum + c.amount, 0);

  const subscriptions = commitments.filter((c) => c.isSubscription);
  const totalSubscriptionsMonthly = subscriptions.reduce((sum, c) => sum + c.amount, 0);
  const subscriptionsDailyDrain = Math.round((totalSubscriptionsMonthly / 30) * 10) / 10;

  const totalSavingsLocked = savingsGoals.reduce((sum, g) => sum + g.currentSaved, 0);
  const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="space-y-6">
      {/* Subscriptions Daily Drain Banner (Gen Z Differentiator) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Subscriptions Audit
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono font-semibold text-cyan-400">
                ₹{subscriptionsDailyDrain}/day drain
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {subscriptions.length} recurring subs total{' '}
              <strong className="text-white font-mono">{formatINR(totalSubscriptionsMonthly)}/mo</strong>.
              Canceling an unused pass directly restores daily spending power!
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddBillModal(true)}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          + Add Commitment
        </button>
      </div>

      {/* Two Column Layout: Bills & Commitments (Left) and Sinking Funds (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Fixed Commitments & Subscriptions */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Monthly Commitments & Bills</h3>
                <p className="text-xs text-slate-300">
                  {formatINR(totalUpcomingUnpaid)} pending · Total: {formatINR(totalMonthlyCommitments)}/mo
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddBillModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bill</span>
            </button>
          </div>

          <p className="text-xs text-slate-300">
            Fixed obligations are reserved upfront from your nominal balance so daily living funds remain accurate.
          </p>

          {/* List of Commitments */}
          <div className="space-y-2.5 pt-1">
            {commitments.map((commitment) => {
              const dailyCost = Math.round((commitment.amount / 30) * 10) / 10;

              return (
                <div
                  key={commitment.id}
                  className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    commitment.isPaid
                      ? 'bg-slate-900/40 border-slate-800/60 text-slate-400 opacity-80'
                      : 'bg-slate-800/50 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleCommitmentPaid(commitment.id)}
                      className={`p-1 rounded transition-colors ${
                        commitment.isPaid
                          ? 'text-emerald-400 bg-emerald-500/15'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={commitment.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span className={commitment.isPaid ? 'line-through text-slate-400' : 'text-white'}>
                          {commitment.title}
                        </span>
                        {commitment.isSubscription && (
                          <span className="text-[10px] text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-1.5 py-0.2 rounded font-mono">
                            ₹{dailyCost}/d
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                        <span>Due: Day {commitment.dueDay}</span>
                        <span>·</span>
                        <span>{commitment.category}</span>
                        {commitment.isPaid && <span className="text-emerald-400 font-medium">· Paid</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white tabular-nums">
                      {formatINR(commitment.amount)}
                    </span>
                    <button
                      onClick={() => onDeleteCommitment(commitment.id)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                      title="Cancel Subscription / Remove Commitment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Savings Goals & Sinking Funds */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Savings Goals & Sinking Funds</h3>
                <p className="text-xs text-slate-300">
                  {formatINR(totalSavingsLocked)} locked · Target: {formatINR(totalSavingsTarget)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Goal</span>
            </button>
          </div>

          <p className="text-xs text-slate-300">
            Sinking funds ringfence your money so you don&apos;t accidentally spend your emergency stash on weekend food.
          </p>

          {/* List of Goals */}
          <div className="space-y-3 pt-1">
            {savingsGoals.map((goal) => {
              const progressPct = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));

              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{goal.title}</span>
                        {goal.priority === 'emergency_buffer' ? (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <Lock className="w-2.5 h-2.5" /> Emergency Shield
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Flexible Goal</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Target deadline: Day {goal.deadlineDay} of cycle
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-white tabular-nums">
                        {formatINR(goal.currentSaved)} <span className="text-slate-400 font-normal">/ {formatINR(goal.targetAmount)}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">{progressPct}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Quick Fund / Withdraw Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateGoalSaved(goal.id, 100)}
                        className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 hover:bg-slate-700 transition-colors"
                      >
                        +₹100
                      </button>
                      <button
                        onClick={() => onUpdateGoalSaved(goal.id, 250)}
                        className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 hover:bg-slate-700 transition-colors"
                      >
                        +₹250
                      </button>
                      {goal.currentSaved >= 100 && (
                        <button
                          onClick={() => onUpdateGoalSaved(goal.id, -100)}
                          className="px-2 py-0.5 rounded bg-slate-800 text-rose-300 hover:bg-slate-700 transition-colors"
                        >
                          -₹100
                        </button>
                      )}
                    </div>

                    {goal.priority !== 'emergency_buffer' && (
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        Delete Goal
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Add Commitment */}
      {showAddBillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-semibold text-white">Add Fixed Commitment / Subscription</h3>
            <form onSubmit={handleCreateBill} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300">Bill Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gym membership, Zepto Pass"
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300">Amount (₹)</label>
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    required
                    value={billAmount}
                    onChange={(e) => setBillAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Due Day (1-30)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={billDueDay}
                    onChange={(e) => setBillDueDay(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-300">Category</label>
                <select
                  value={billCategory}
                  onChange={(e) => setBillCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 mt-1"
                >
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Utilities & Wi-Fi">Utilities & Wi-Fi</option>
                  <option value="Rent & Hostel">Rent & Hostel</option>
                  <option value="Transit & Commute">Transit & Commute</option>
                  <option value="College & Study">College & Study</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isSub"
                  checked={isSubscription}
                  onChange={(e) => setIsSubscription(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                />
                <label htmlFor="isSub" className="text-xs text-slate-300">
                  Recurring digital subscription
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBillModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Goal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-semibold text-white">Create Sinking Fund Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Music Festival Ticket, Sneaker Drop"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300">Target Amount (₹)</label>
                  <input
                    type="number"
                    min={100}
                    max={5000}
                    required
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Initial Deposit (₹)</label>
                  <input
                    type="number"
                    min={0}
                    max={goalTarget}
                    required
                    value={goalInitial}
                    onChange={(e) => setGoalInitial(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
