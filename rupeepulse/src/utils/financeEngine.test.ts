import { describe, it, expect } from 'vitest';
import {
  simulate,
  INITIAL_BUDGET,
  INITIAL_COMMITMENTS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_TRANSACTIONS,
  FinancialStateContext,
} from './financeEngine';
import { DecisionSimulationInput } from '../types/finance';

function createBaseState(currentDay = 12): FinancialStateContext {
  return {
    startingBudget: INITIAL_BUDGET,
    currentDay,
    transactions: INITIAL_TRANSACTIONS,
    commitments: INITIAL_COMMITMENTS,
    savingsGoals: INITIAL_SAVINGS_GOALS,
    unexpectedHistory: [],
    activeSimulation: null,
  };
}

describe('RupeePulse Financial Engine', () => {
  it('Issue 1 (v2 & v3 baseline): Fresh visitor base state on Day 12 has healthy baseline', () => {
    const state = createBaseState(12);
    const result = simulate(state, null);

    // Baseline allowance reserves upcoming bills and planned goal contributions
    expect(result.metrics.safeDailyAllowance).toBeGreaterThanOrEqual(90);
    expect(result.metrics.effectiveLiquid).toBeGreaterThanOrEqual(1700);
    expect(result.health.score).toBeGreaterThanOrEqual(60);
    expect(['Locked In 🚀', 'Chilling 💅']).toContain(result.health.cookedLabel);
  });

  it('Issue 2: Recurring bills are deducted ONCE, not double-charged', () => {
    const state = createBaseState(12);
    const baseResult = simulate(state, null);

    const recurringAction: DecisionSimulationInput = {
      title: 'Gym Membership',
      amount: 799,
      category: 'Subscriptions',
      classification: 'want',
      type: 'recurring_monthly',
      day: 15,
    };

    const simResult = simulate(state, recurringAction);

    // Liquid pool drop must be exactly ₹799, NOT ₹1,598!
    const liquidDrop = baseResult.metrics.effectiveLiquid - simResult.metrics.effectiveLiquid;
    expect(liquidDrop).toBe(799);

    // Safe daily allowance drop must be ~799 / 19 days ≈ ₹42/day
    const allowanceDrop = baseResult.metrics.safeDailyAllowance - simResult.metrics.safeDailyAllowance;
    expect(allowanceDrop).toBeCloseTo(799 / 19, 0);
  });

  it('Issue 3 & 4: Day 30 deficit is not clamped to zero, and dual trajectories exist', () => {
    const state = createBaseState(12);
    const result = simulate(state, null);

    // Check dual trajectories exist in projectedBalances
    expect(result.projectedBalances.length).toBe(30);
    expect(result.projectedBalances[29].allowanceTrajectoryBalance).toBeDefined();
    expect(result.projectedBalances[29].balance).toBeDefined();

    // If an aggressive expense causes deficit, month-end forecast reflects actual negative deficit
    const bigExpense: DecisionSimulationInput = {
      title: 'Luxury Leather Jacket',
      amount: 3500,
      category: 'Shopping & Gear',
      classification: 'want',
      type: 'one_off',
      day: 12,
    };

    const simResult = simulate(state, bigExpense);
    expect(simResult.metrics.projectedMonthEndBalance).toBeLessThan(0);
    expect(simResult.metrics.brokeDay).not.toBeNull();
  });

  it('Issue 5 & v3 Issue 2: Goal dipping computes realistic delay, cash spillover, and deadline shortfall', () => {
    const state = createBaseState(12);
    // ANC Earphones goal has target ₹1,200, currentSaved ₹400, dailyContribution ₹13.3/day
    const goalDippingAction: DecisionSimulationInput = {
      title: 'Earphones Upgrade',
      amount: 1200,
      category: 'Shopping & Gear',
      classification: 'want',
      type: 'one_off',
      day: 12,
      targetGoalDeduction: 'goal-gear',
    };

    const result = simulate(state, goalDippingAction);
    const goalDelay = result.metrics.goalDelays.find((g) => g.goalId === 'goal-gear');

    expect(goalDelay).toBeDefined();
    expect(goalDelay?.absorbedFromGoal).toBe(400);
    expect(goalDelay?.spilloverFromLiquid).toBe(800);
    expect(goalDelay?.delayDays).toBeGreaterThan(20);
    expect(goalDelay?.missesDeadline).toBe(true);
    expect(result.metrics.impactOnGoalsSummary).toContain('absorbed from ANC Bluetooth Earphones');
    expect(result.metrics.impactOnGoalsSummary).toContain('paid from cash');
    expect(result.metrics.impactOnGoalsSummary).toContain('Day 30 deadline (misses deadline)');
  });

  it('Issue 6: Future execution day is respected (Day 20 vs Day 12)', () => {
    const state = createBaseState(12);

    const futureBill: DecisionSimulationInput = {
      title: 'Concert after mid-terms',
      amount: 800,
      category: 'Social & Night Out',
      classification: 'want',
      type: 'one_off',
      day: 20,
    };

    const result = simulate(state, futureBill);
    // On Day 15 (before Day 20), simulated running balance has NOT yet deducted the ₹800
    const day15Base = result.projectedBalances.find((p) => p.day === 15)?.balance;
    const day15Sim = result.projectedBalances.find((p) => p.day === 15)?.simulatedBalance;
    expect(day15Sim).toBe(day15Base);

    // On Day 20, simulated running balance is deducted
    const day20Base = result.projectedBalances.find((p) => p.day === 20)?.balance;
    const day20Sim = result.projectedBalances.find((p) => p.day === 20)?.simulatedBalance;
    expect(day20Sim).toBeLessThan(day20Base!);
  });

  it('Issue 7: Financial health provides transparent 4-pillar breakdown with smooth scoring', () => {
    const state = createBaseState(12);

    const moderateExpense: DecisionSimulationInput = {
      title: 'Weekend Outing',
      amount: 1200,
      category: 'Social & Night Out',
      classification: 'want',
      type: 'one_off',
      day: 12,
    };

    const simResult = simulate(state, moderateExpense);

    // Pillar breakdown exists
    expect(simResult.metrics.breakdown).toBeDefined();
    expect(simResult.metrics.breakdown.runwayScore).toBeGreaterThan(5); // Smooth, not dropped to 2!
    expect(simResult.metrics.breakdown.commitmentsScore).toBe(25); // Bills still safe!
    expect(simResult.metrics.breakdown.bufferResilienceScore).toBe(17); // Emergency shield safe!
  });

  it('v3 Issue 1: Windfall text acceleration divides by real daily savings contribution rate', () => {
    const state = createBaseState(12);
    const windfallAction: DecisionSimulationInput = {
      title: 'Freelance Design Gig',
      amount: 1500,
      category: 'Gigs & Cashback',
      classification: 'savings',
      type: 'income',
      day: 12,
    };

    const result = simulate(state, windfallAction);
    // Real total daily savings pace across goals is ~40/day. 1500 / 40 ≈ 38 days, NOT 50 days!
    expect(result.metrics.impactOnGoalsSummary).toContain('accelerates savings schedule by ~38 days across goals!');
    expect(result.metrics.impactOnGoalsSummary).not.toContain('~50 days');
  });

  it('v3 Issue 3: Goal contributions are funded, reserved in allowance, and grow in projection', () => {
    const state = createBaseState(12);
    const result = simulate(state, null);

    // Planned contributions for 19 remaining days: 19 * 40 = ₹760
    expect(result.metrics.remainingPlannedSavingsToFund).toBe(760);
    // Day 30 total savings = 1600 (locked) + 760 (funded) = 2360
    expect(result.metrics.projectedDay30TotalSavings).toBe(2360);

    // In projectedBalances, goal savings grow over time
    const day12Goals = result.projectedBalances.find((p) => p.day === 12)?.projectedGoalSavings;
    const day30Goals = result.projectedBalances.find((p) => p.day === 30)?.projectedGoalSavings;
    expect(day12Goals).toBe(1600);
    expect(day30Goals).toBe(2360);

    // Following safe allowance pace preserves 100% of the goals at Day 30 (within ₹1-2 rounding)
    const day30AllowanceBalance = result.projectedBalances[29].allowanceTrajectoryBalance;
    expect(Math.abs(day30AllowanceBalance - 2360)).toBeLessThanOrEqual(2);
  });
});
