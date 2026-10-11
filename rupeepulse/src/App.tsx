import React, { useState, useMemo, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { TimelineScrubber } from './components/TimelineScrubber';
import { OverviewDashboard } from './components/OverviewDashboard';
import { DecisionSimulator } from './components/DecisionSimulator';
import { TrajectoryChart } from './components/TrajectoryChart';
import { CommitmentsAndGoals } from './components/CommitmentsAndGoals';
import { TransactionsLedger } from './components/TransactionsLedger';
import {
  UnexpectedShockModal,
  ShockResolutionChoice,
} from './components/UnexpectedShockModal';
import {
  BudgetChallenge,
  Commitment,
  DecisionSimulationInput,
  SavingsGoal,
  Transaction,
  UnexpectedScenario,
} from './types/finance';
import {
  computeFinancialEngine,
  formatINR,
  INITIAL_BUDGET,
  INITIAL_CHALLENGES,
  INITIAL_COMMITMENTS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_TRANSACTIONS,
  TOTAL_DAYS,
} from './utils/financeEngine';
import { CheckCircle2, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'rupeepulse_state_v2';

export default function App() {
  // Safe initial state loader from localStorage
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          currentDay: parsed.currentDay ?? 12,
          transactions: parsed.transactions ?? INITIAL_TRANSACTIONS,
          commitments: parsed.commitments ?? INITIAL_COMMITMENTS,
          savingsGoals: parsed.savingsGoals ?? INITIAL_SAVINGS_GOALS,
          challenges: parsed.challenges ?? INITIAL_CHALLENGES,
          startingBudget: parsed.startingBudget ?? INITIAL_BUDGET,
        };
      }
    } catch (e) {
      console.warn('Failed to load saved state from localStorage', e);
    }
    return {
      currentDay: 12,
      transactions: INITIAL_TRANSACTIONS,
      commitments: INITIAL_COMMITMENTS,
      savingsGoals: INITIAL_SAVINGS_GOALS,
      challenges: INITIAL_CHALLENGES,
      startingBudget: INITIAL_BUDGET,
    };
  };

  const initialState = loadSavedState();

  // Main Financial State
  const [startingBudget, setStartingBudget] = useState<number>(initialState.startingBudget);
  const [currentDay, setCurrentDay] = useState<number>(initialState.currentDay);
  const [transactions, setTransactions] = useState<Transaction[]>(initialState.transactions);
  const [commitments, setCommitments] = useState<Commitment[]>(initialState.commitments);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialState.savingsGoals);
  const [challenges, setChallenges] = useState<BudgetChallenge[]>(initialState.challenges);

  // Fresh visitors see real baseline without hypothetical amber banner
  const [activeSimulation, setActiveSimulation] = useState<DecisionSimulationInput | null>(null);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<
    'overview' | 'simulator' | 'trajectory' | 'commitments' | 'ledger'
  >('overview');
  const [isShockModalOpen, setIsShockModalOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence to localStorage
  useEffect(() => {
    try {
      const toSave = {
        currentDay,
        transactions,
        commitments,
        savingsGoals,
        challenges,
        startingBudget,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [currentDay, transactions, commitments, savingsGoals, challenges, startingBudget]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Base state context
  const stateContext = useMemo(
    () => ({
      startingBudget,
      currentDay,
      transactions,
      commitments,
      savingsGoals,
      unexpectedHistory: [],
      activeSimulation: null,
    }),
    [startingBudget, currentDay, transactions, commitments, savingsGoals]
  );

  // Computations
  const baseResult = useMemo(
    () => computeFinancialEngine(stateContext, null),
    [stateContext]
  );

  const simulatedResult = useMemo(
    () => computeFinancialEngine(stateContext, activeSimulation),
    [stateContext, activeSimulation]
  );

  // Active display result: if user has an active simulation, show simulated view
  const currentResult = activeSimulation ? simulatedResult : baseResult;

  // Handlers for Commitments
  const handleToggleCommitmentPaid = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPaid: !c.isPaid } : c))
    );
    showToast('Commitment status updated.');
  };

  const handleDeleteCommitment = (id: string) => {
    setCommitments((prev) => prev.filter((c) => c.id !== id));
    showToast('Subscription cancelled. Funds restored to safe daily allowance!');
  };

  const handleAddCommitment = (newCommitment: Omit<Commitment, 'id'>) => {
    const id = `cm-${Date.now()}`;
    setCommitments((prev) => [...prev, { ...newCommitment, id }]);
    showToast(`Added ${newCommitment.title} to commitments.`);
  };

  // Handlers for Goals
  const handleUpdateGoalSaved = (id: string, delta: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = Math.max(0, g.currentSaved + delta);
          return { ...g, currentSaved: updated };
        }
        return g;
      })
    );
    showToast(`Savings pocket adjusted by ${delta > 0 ? `+${formatINR(delta)}` : formatINR(delta)}.`);
  };

  const handleAddSavingsGoal = (newGoal: Omit<SavingsGoal, 'id'>) => {
    const id = `goal-${Date.now()}`;
    setSavingsGoals((prev) => [...prev, { ...newGoal, id }]);
    showToast(`Created savings goal: ${newGoal.title}`);
  };

  const handleDeleteGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Savings goal deleted.');
  };

  // Handlers for Transactions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const id = `tx-${Date.now()}`;
    const timestamp = `Day ${newTx.day}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setTransactions((prev) => [{ ...newTx, id, timestamp }, ...prev]);
    showToast(`Recorded ${newTx.title} (${formatINR(newTx.amount)}).`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed from ledger.');
  };

  // Handlers for Challenges
  const handleToggleChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
    showToast('Sprint challenge updated!');
  };

  // Handlers for Decision Simulation
  const handleCommitSimulation = (sim: DecisionSimulationInput) => {
    const id = `tx-sim-${Date.now()}`;
    const timestamp = `Day ${sim.day}, Just Now`;

    const newTx: Transaction = {
      id,
      day: sim.day,
      title: sim.title,
      amount: sim.amount,
      category: sim.category,
      classification: sim.classification,
      type: sim.type === 'income' ? 'income' : 'expense',
      timestamp,
      note: 'Committed from Decision Lab',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If recurring, also add to commitments
    if (sim.type === 'recurring_monthly') {
      const commitmentId = `cm-sim-${Date.now()}`;
      setCommitments((prev) => [
        ...prev,
        {
          id: commitmentId,
          title: sim.title,
          amount: sim.amount,
          dueDay: sim.day,
          category: sim.category,
          isPaid: true,
          isSubscription: true,
          frequency: 'Monthly',
        },
      ]);
    }

    // If pulled from goal, deduct from that goal
    if (sim.targetGoalDeduction) {
      setSavingsGoals((prev) =>
        prev.map((g) => {
          if (g.id === sim.targetGoalDeduction) {
            return { ...g, currentSaved: Math.max(0, g.currentSaved - sim.amount) };
          }
          return g;
        })
      );
    }

    setActiveSimulation(null);
    showToast(`Simulation committed! ${sim.title} applied to active budget.`);
  };

  // Handler for Life Shock with user financial strategy choices
  const handleApplyShock = (scenario: UnexpectedScenario, choice: ShockResolutionChoice) => {
    const isIncome = scenario.amount > 0;
    const absAmount = Math.abs(scenario.amount);
    const timestamp = `Day ${currentDay}, Surprise Event`;

    if (isIncome) {
      // Windfall
      const newTx: Transaction = {
        id: `tx-shock-${Date.now()}`,
        day: currentDay,
        title: `[Life Shock] ${scenario.title}`,
        amount: absAmount,
        category: scenario.category,
        classification: 'savings',
        type: 'income',
        timestamp,
        note: scenario.description,
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`Windfall added: +${formatINR(absAmount)}!`);
      return;
    }

    if (choice === 'emergency_shield') {
      // Absorb from emergency fund
      const emergencyGoal = savingsGoals.find((g) => g.priority === 'emergency_buffer');
      if (emergencyGoal) {
        const absorbed = Math.min(emergencyGoal.currentSaved, absAmount);
        const spillover = absAmount - absorbed;

        setSavingsGoals((prev) =>
          prev.map((g) =>
            g.id === emergencyGoal.id
              ? { ...g, currentSaved: Math.max(0, g.currentSaved - absorbed) }
              : g
          )
        );

        if (spillover > 0) {
          const spillTx: Transaction = {
            id: `tx-shock-${Date.now()}`,
            day: currentDay,
            title: `[Shock Spillover] ${scenario.title}`,
            amount: spillover,
            category: scenario.category,
            classification: 'need',
            type: 'expense',
            timestamp,
            note: `${formatINR(absorbed)} absorbed by Shield; ${formatINR(spillover)} spilled into liquid cash.`,
          };
          setTransactions((prev) => [spillTx, ...prev]);
        }

        showToast(
          `Shock resolved: ${formatINR(absorbed)} absorbed by Emergency Shield without touching daily allowance!`
        );
      }
    } else if (choice === 'split_borrow') {
      // Pay 50% now
      const halfAmount = Math.round(absAmount * 0.5);
      const splitTx: Transaction = {
        id: `tx-shock-${Date.now()}`,
        day: currentDay,
        title: `[Life Shock 50% Split] ${scenario.title}`,
        amount: halfAmount,
        category: scenario.category,
        classification: 'need',
        type: 'expense',
        timestamp,
        note: `Paid ${formatINR(halfAmount)} now; remaining ${formatINR(halfAmount)} deferred to next cycle.`,
      };
      setTransactions((prev) => [splitTx, ...prev]);
      showToast(`Shock split: Paid ${formatINR(halfAmount)} today, softening immediate allowance impact.`);
    } else {
      // Standard liquid pay
      const liquidTx: Transaction = {
        id: `tx-shock-${Date.now()}`,
        day: currentDay,
        title: `[Life Shock] ${scenario.title}`,
        amount: absAmount,
        category: scenario.category,
        classification: 'need',
        type: 'expense',
        timestamp,
        note: scenario.description,
      };
      setTransactions((prev) => [liquidTx, ...prev]);
      showToast(`Shock paid from liquid cash (${formatINR(absAmount)}).`);
    }
  };

  // Helper to jump to simulator with prefilled data
  const handleNavigateToSimulator = (presetAmount?: number, presetTitle?: string) => {
    if (presetAmount && presetTitle) {
      setActiveSimulation({
        title: presetTitle,
        amount: presetAmount,
        category: 'Social & Night Out',
        classification: 'want',
        type: 'one_off',
        day: currentDay,
        targetGoalDeduction: '',
      });
    }
    setActiveTab('simulator');
  };

  // Reset entire cycle
  const handleResetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentDay(12);
    setTransactions(INITIAL_TRANSACTIONS);
    setCommitments(INITIAL_COMMITMENTS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setChallenges(INITIAL_CHALLENGES);
    setStartingBudget(INITIAL_BUDGET);
    setActiveSimulation(null);
    showToast('Reset cycle to default ₹10,000 baseline state.');
  };

  const emergencyGoal = savingsGoals.find((g) => g.priority === 'emergency_buffer');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation adhering to Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulate={() => setActiveTab('simulator')}
        onOpenAddTx={() => setIsAddTxModalOpen(true)}
        onTriggerShock={() => setIsShockModalOpen(true)}
        healthScore={currentResult.health.score}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 space-y-6">
        {/* Timeline Scrubber */}
        <TimelineScrubber
          currentDay={currentDay}
          onDayChange={(d) => setCurrentDay(d)}
          brokeDay={currentResult.metrics.brokeDay}
        />

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <OverviewDashboard
            metrics={currentResult.metrics}
            health={currentResult.health}
            currentDay={currentDay}
            transactions={transactions}
            challenges={challenges}
            onToggleChallenge={handleToggleChallenge}
            onNavigateToSimulator={handleNavigateToSimulator}
            onNavigateToTrajectory={() => setActiveTab('trajectory')}
            onNavigateToGoals={() => setActiveTab('commitments')}
            hasActiveSimulation={activeSimulation !== null}
            onClearSimulation={() => setActiveSimulation(null)}
          />
        )}

        {/* Tab 2: Decision Simulator (Decision Lab) */}
        {activeTab === 'simulator' && (
          <DecisionSimulator
            currentDay={currentDay}
            baseMetrics={baseResult.metrics}
            simulatedMetrics={simulatedResult.metrics}
            activeSimulation={activeSimulation}
            onUpdateSimulation={setActiveSimulation}
            onCommitSimulation={handleCommitSimulation}
            savingsGoals={savingsGoals}
            stateContext={stateContext}
          />
        )}

        {/* Tab 3: 30-Day Trajectory */}
        {activeTab === 'trajectory' && (
          <TrajectoryChart
            currentDay={currentDay}
            onDaySelect={(d) => setCurrentDay(d)}
            projectedBalances={currentResult.projectedBalances}
            commitments={commitments}
            transactions={transactions}
            metrics={currentResult.metrics}
            hasActiveSimulation={activeSimulation !== null}
          />
        )}

        {/* Tab 4: Commitments & Goals */}
        {activeTab === 'commitments' && (
          <CommitmentsAndGoals
            commitments={commitments}
            savingsGoals={savingsGoals}
            onToggleCommitmentPaid={handleToggleCommitmentPaid}
            onDeleteCommitment={handleDeleteCommitment}
            onAddCommitment={handleAddCommitment}
            onUpdateGoalSaved={handleUpdateGoalSaved}
            onAddSavingsGoal={handleAddSavingsGoal}
            onDeleteGoal={handleDeleteGoal}
            currentDay={currentDay}
          />
        )}

        {/* Tab 5: Transactions Ledger */}
        {activeTab === 'ledger' && (
          <TransactionsLedger
            transactions={transactions}
            currentDay={currentDay}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            safeDailyAllowance={currentResult.metrics.safeDailyAllowance}
            showAddModalDirectly={isAddTxModalOpen}
            onCloseAddModal={() => setIsAddTxModalOpen(false)}
          />
        )}
      </main>

      {/* Floating Add Transaction Modal when triggered from header */}
      {isAddTxModalOpen && activeTab !== 'ledger' && (
        <TransactionsLedger
          transactions={transactions}
          currentDay={currentDay}
          onAddTransaction={handleAddTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          safeDailyAllowance={currentResult.metrics.safeDailyAllowance}
          showAddModalDirectly={true}
          onCloseAddModal={() => setIsAddTxModalOpen(false)}
        />
      )}

      {/* Life Shock Simulator Modal with Response Strategy Choices */}
      <UnexpectedShockModal
        isOpen={isShockModalOpen}
        onClose={() => setIsShockModalOpen(false)}
        onApplyShock={handleApplyShock}
        emergencyFundAmount={emergencyGoal?.currentSaved || 0}
        currentLiquid={currentResult.metrics.effectiveLiquid}
      />

      {/* Mobile Bottom Navigation Bar without Tab Clipping */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400 mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>RupeePulse — Gen Z Financial Simulation Engine (₹10,000 / 30-Day Budget Cycle)</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetToDefaults}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Simulate before you swipe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
