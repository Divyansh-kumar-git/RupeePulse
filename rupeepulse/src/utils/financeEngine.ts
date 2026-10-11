import {
  Commitment,
  DecisionSimulationInput,
  FinancialHealthBreakdown,
  GoalDelayDetail,
  SavingsGoal,
  SimulationMetrics,
  Transaction,
  UnexpectedScenario,
  BudgetChallenge,
} from '../types/finance';

export const INITIAL_BUDGET = 10000;
export const TOTAL_DAYS = 30;
export const LAST_RECORDED_SEED_DAY = 11;

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    day: 1,
    title: 'Room & Mess Share',
    amount: 2200,
    category: 'Rent & Hostel',
    classification: 'need',
    type: 'expense',
    timestamp: 'Day 1, 09:30 AM',
    note: 'Fixed accommodation commitment',
  },
  {
    id: 'tx-2',
    day: 2,
    title: 'Metro Smart Card Recharge',
    amount: 600,
    category: 'Transit & Commute',
    classification: 'need',
    type: 'expense',
    timestamp: 'Day 2, 11:15 AM',
  },
  {
    id: 'tx-3',
    day: 3,
    title: 'Semester Reference Books & Spiral Notes',
    amount: 340,
    category: 'College & Study',
    classification: 'need',
    type: 'expense',
    timestamp: 'Day 3, 04:20 PM',
  },
  {
    id: 'tx-4',
    day: 4,
    title: 'Campus Canteen Chai & Bun Maska',
    amount: 110,
    category: 'Food & Dining',
    classification: 'want',
    type: 'expense',
    timestamp: 'Day 4, 05:45 PM',
  },
  {
    id: 'tx-5',
    day: 5,
    title: 'Weekly Grocery Staples & Oats',
    amount: 460,
    category: 'Food & Dining',
    classification: 'need',
    type: 'expense',
    timestamp: 'Day 5, 07:10 PM',
  },
  {
    id: 'tx-6',
    day: 6,
    title: 'Weekend Late-Night Biryani Order',
    amount: 280,
    category: 'Food & Dining',
    classification: 'want',
    type: 'expense',
    timestamp: 'Day 6, 11:20 PM',
  },
  {
    id: 'tx-7',
    day: 7,
    title: 'Wi-Fi Fiber Share (Roomies)',
    amount: 400,
    category: 'Utilities & Wi-Fi',
    classification: 'need',
    type: 'expense',
    timestamp: 'Day 7, 02:00 PM',
  },
  {
    id: 'tx-8',
    day: 8,
    title: 'Graphic Tee from Flea Market',
    amount: 350,
    category: 'Shopping & Gear',
    classification: 'want',
    type: 'expense',
    timestamp: 'Day 8, 06:30 PM',
  },
  {
    id: 'tx-9',
    day: 9,
    title: 'Practical Lab File Prints & Photocopy',
    amount: 140,
    category: 'College & Study',
    classification: 'need',
    type: 'expense',
    timestamp: 'Day 9, 01:15 PM',
  },
  {
    id: 'tx-10',
    day: 10,
    title: 'Evening Coffee & Samosa split',
    amount: 85,
    category: 'Food & Dining',
    classification: 'want',
    type: 'expense',
    timestamp: 'Day 10, 05:00 PM',
  },
  {
    id: 'tx-11',
    day: 11,
    title: 'Movie Ticket with College Crew',
    amount: 280,
    category: 'Social & Night Out',
    classification: 'want',
    type: 'expense',
    timestamp: 'Day 11, 08:30 PM',
  },
];

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'cm-1',
    title: 'Room & Mess Share',
    amount: 2200,
    dueDay: 1,
    category: 'Rent & Hostel',
    isPaid: true,
    isSubscription: false,
    frequency: 'Monthly',
  },
  {
    id: 'cm-2',
    title: 'Wi-Fi Fiber Connection',
    amount: 400,
    dueDay: 7,
    category: 'Utilities & Wi-Fi',
    isPaid: true,
    isSubscription: true,
    frequency: 'Monthly',
  },
  {
    id: 'cm-3',
    title: 'Spotify Student Subscription',
    amount: 59,
    dueDay: 15,
    category: 'Subscriptions',
    isPaid: false,
    isSubscription: true,
    frequency: 'Monthly',
  },
  {
    id: 'cm-4',
    title: 'Unlimited 5G Data Recharge',
    amount: 299,
    dueDay: 19,
    category: 'Utilities & Wi-Fi',
    isPaid: false,
    isSubscription: true,
    frequency: 'Monthly',
  },
  {
    id: 'cm-5',
    title: 'Zepto Daily Pass / Quick Comm',
    amount: 99,
    dueDay: 23,
    category: 'Subscriptions',
    isPaid: false,
    isSubscription: true,
    frequency: 'Monthly',
  },
  {
    id: 'cm-6',
    title: 'Streaming Bundle (Prime Video share)',
    amount: 149,
    dueDay: 27,
    category: 'Subscriptions',
    isPaid: false,
    isSubscription: true,
    frequency: 'Monthly',
  },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-emergency',
    title: 'Rainy Day Emergency Shield',
    targetAmount: 1500,
    currentSaved: 1000,
    monthlyAllocation: 500,
    dailyContribution: 16.7, // ₹500 / 30
    priority: 'emergency_buffer',
    lockedUntilEnd: true,
    deadlineDay: 30,
    color: '#10b981', // emerald
  },
  {
    id: 'goal-gear',
    title: 'ANC Bluetooth Earphones',
    targetAmount: 1200,
    currentSaved: 400,
    monthlyAllocation: 400,
    dailyContribution: 13.3, // ₹400 / 30
    priority: 'essential_goal',
    lockedUntilEnd: false,
    deadlineDay: 28,
    color: '#06b6d4', // cyan
  },
  {
    id: 'goal-trip',
    title: 'Weekend Trek / Concert Fund',
    targetAmount: 800,
    currentSaved: 200,
    monthlyAllocation: 300,
    dailyContribution: 10.0, // ₹300 / 30
    priority: 'lifestyle',
    lockedUntilEnd: false,
    deadlineDay: 30,
    color: '#8b5cf6', // violet
  },
];

export const PRESET_UNEXPECTED_SCENARIOS: UnexpectedScenario[] = [
  {
    id: 'sc-1',
    title: 'Laptop Charger Blew Up',
    description: 'Replacement 65W GaN charger required immediately before submission week.',
    amount: -1250,
    category: 'Health & Emergency',
    severity: 'major',
  },
  {
    id: 'sc-2',
    title: 'Emergency Medical & Cough Meds',
    description: 'Sudden viral flu, doctor consult fee + antibiotic prescription.',
    amount: -550,
    category: 'Health & Emergency',
    severity: 'moderate',
  },
  {
    id: 'sc-3',
    title: 'Roommate Birthday Cake & Split',
    description: 'Surprise celebration organized by the wing.',
    amount: -350,
    category: 'Social & Night Out',
    severity: 'minor',
  },
  {
    id: 'sc-4',
    title: 'Freelance Reel Editing Gig',
    description: 'Local coffee brand paid for a 30-sec Instagram reel edit!',
    amount: 1500,
    category: 'Gigs & Cashback',
    severity: 'major',
  },
  {
    id: 'sc-5',
    title: 'Broken Phone Screen Protector & Case',
    description: 'Dropped phone on campus pavement, tempered glass shattered.',
    amount: -250,
    category: 'Shopping & Gear',
    severity: 'minor',
  },
  {
    id: 'sc-6',
    title: 'Old Loan Returned by Senior',
    description: 'A college senior UPIed back the money borrowed during tech fest.',
    amount: 600,
    category: 'Gigs & Cashback',
    severity: 'moderate',
  },
];

export const INITIAL_CHALLENGES: BudgetChallenge[] = [
  {
    id: 'ch-1',
    title: 'Zero-Zomato 48-Hour Sprint',
    subtitle: 'Eat all meals at college mess or cook noodles. Save on delivery markups.',
    estimatedSaving: 450,
    durationDays: 2,
    active: true,
    completed: false,
  },
  {
    id: 'ch-2',
    title: 'Tapri Chai & Coffee Ceiling (₹30/day)',
    subtitle: 'Cap daily campus beverage spend. Adds ₹300+ breathing room to liquid pool.',
    estimatedSaving: 320,
    durationDays: 7,
    active: false,
    completed: false,
  },
  {
    id: 'ch-3',
    title: 'Ghost Subscription Audit',
    subtitle: 'Review & toggle off streaming/quick-commerce apps not used this week.',
    estimatedSaving: 248,
    durationDays: 1,
    active: false,
    completed: false,
  },
];

export interface FinancialStateContext {
  startingBudget: number;
  currentDay: number;
  transactions: Transaction[];
  commitments: Commitment[];
  savingsGoals: SavingsGoal[];
  unexpectedHistory: UnexpectedScenario[];
  activeSimulation: DecisionSimulationInput | null;
}

/**
 * Pure simulation function: calculates financial metrics, dual burndown trajectories,
 * goal delays relative to deadline, planned savings funding, and 4-pillar health scores.
 */
export function simulate(
  state: FinancialStateContext,
  simulatedAction?: DecisionSimulationInput | null
) {
  const simulation = simulatedAction !== undefined ? simulatedAction : state.activeSimulation;
  const currentDay = state.currentDay;
  const remainingDays = Math.max(1, TOTAL_DAYS - currentDay + 1);

  // 1. Calculate actual historical income & spend up to effectiveRecordDay
  const effectiveRecordDay = Math.min(currentDay, LAST_RECORDED_SEED_DAY);

  let actualIncomeSoFar = state.startingBudget;
  let actualExpensesSoFar = 0;
  const categorySpending: Record<string, { total: number; need: number; want: number }> = {};

  for (const tx of state.transactions) {
    if (tx.day <= effectiveRecordDay) {
      if (tx.type === 'income') {
        actualIncomeSoFar += tx.amount;
      } else {
        actualExpensesSoFar += tx.amount;
        if (!categorySpending[tx.category]) {
          categorySpending[tx.category] = { total: 0, need: 0, want: 0 };
        }
        categorySpending[tx.category].total += tx.amount;
        if (tx.classification === 'need') {
          categorySpending[tx.category].need += tx.amount;
        } else if (tx.classification === 'want') {
          categorySpending[tx.category].want += tx.amount;
        }
      }
    }
  }

  // Calculate clean discretionary daily spending pace:
  // Exclude one-off capital commitments like rent (₹2,200), Wi-Fi (₹400), metro recharge (₹600), textbooks (₹340)
  const nonDiscretionaryCategories = new Set([
    'Rent & Hostel',
    'Utilities & Wi-Fi',
    'Transit & Commute',
    'College & Study',
  ]);

  const purelyDiscretionarySpend = state.transactions
    .filter((tx) => tx.day <= effectiveRecordDay && tx.type === 'expense' && !nonDiscretionaryCategories.has(tx.category))
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Discretionary pace per day (~₹100/day)
  const dailyDiscretionaryBurnRate = Math.max(
    80,
    Math.round(purelyDiscretionarySpend / Math.max(1, effectiveRecordDay))
  );

  // 2. Time-Traveling Scrubber Projection:
  // If scrubbing past Day 11, synthesize intermediate completed days
  let simulatedIntermediateDiscretionary = 0;
  let simulatedIntermediateCommitments = 0;

  if (currentDay > LAST_RECORDED_SEED_DAY) {
    for (let d = LAST_RECORDED_SEED_DAY + 1; d < currentDay; d++) {
      simulatedIntermediateDiscretionary += dailyDiscretionaryBurnRate;
      const dayCommitments = state.commitments.filter((c) => !c.isPaid && c.dueDay === d);
      simulatedIntermediateCommitments += dayCommitments.reduce((sum, c) => sum + c.amount, 0);
    }
  }

  // Base nominal bank balance at currentDay
  const baseCurrentBankBalance = Math.max(
    0,
    actualIncomeSoFar - actualExpensesSoFar - simulatedIntermediateDiscretionary - simulatedIntermediateCommitments
  );

  // 3. Upcoming Unpaid Commitments (due on or after currentDay)
  let unpaidUpcomingCommitments = state.commitments
    .filter((c) => !c.isPaid && c.dueDay >= currentDay)
    .reduce((sum, c) => sum + c.amount, 0);

  // Single-deduction rule for recurring monthly bills:
  const isSimulatedRecurringUpcoming =
    simulation &&
    simulation.type === 'recurring_monthly' &&
    simulation.day >= currentDay;

  if (isSimulatedRecurringUpcoming) {
    unpaidUpcomingCommitments += simulation.amount;
  }

  // 4. Planned Goal Contributions Funding (Fix Issue 3):
  // Calculate total daily savings contribution rate across all goals
  const totalDailySavingsPace = state.savingsGoals.reduce(
    (sum, g) => sum + g.dailyContribution,
    0
  ); // ~40.0/day

  // Remaining planned savings to fund across remainingDays
  const remainingPlannedSavingsToFund = Math.round(totalDailySavingsPace * remainingDays);

  // 5. Savings Goals, Goal Dipping, and Deadline Framing (Fix Issue 1 & 2):
  const simulatedGoalBalances: Record<string, number> = {};
  const goalDelays: GoalDelayDetail[] = [];
  let totalLockedSavings = 0;
  let impactOnGoalsSummary = 'All savings goals intact and on track for Day 30 deadline.';

  for (const goal of state.savingsGoals) {
    let saved = goal.currentSaved;

    if (simulation && simulation.targetGoalDeduction === goal.id) {
      const absorbed = Math.min(saved, simulation.amount);
      const spillover = simulation.amount - absorbed;
      saved = Math.max(0, saved - absorbed);

      const delayDays = Math.max(1, Math.ceil(absorbed / Math.max(1, goal.dailyContribution)));
      const projectedDay30Saved = Math.round(saved + (remainingDays * goal.dailyContribution));
      const shortfallAtDay30 = Math.max(0, goal.targetAmount - projectedDay30Saved);
      const missesDeadline = shortfallAtDay30 > 0;
      const previousSaved = goal.currentSaved;

      goalDelays.push({
        goalId: goal.id,
        goalTitle: goal.title,
        absorbedFromGoal: absorbed,
        spilloverFromLiquid: spillover,
        delayDays,
        shortfallAtDay30,
        missesDeadline,
        newSaved: saved,
        previousSaved,
        dailyContribution: goal.dailyContribution,
      });

      if (missesDeadline) {
        impactOnGoalsSummary = `${formatINR(absorbed)} absorbed from ${goal.title}, ${formatINR(spillover)} paid from cash. Leaves goal ${formatINR(shortfallAtDay30)} short at Day 30 deadline (misses deadline).`;
      } else {
        impactOnGoalsSummary = `${formatINR(absorbed)} absorbed from ${goal.title}, ${formatINR(spillover)} paid from cash. Still on track to meet Day 30 target!`;
      }
    }

    simulatedGoalBalances[goal.id] = saved;
    totalLockedSavings += saved;
  }

  // 6. Apply Simulation to Bank Balance
  let simBankBalance = baseCurrentBankBalance;

  if (simulation) {
    if (simulation.type === 'income') {
      simBankBalance += simulation.amount;
      // Fix Issue 1: Windfall acceleration divided by real goal daily contribution rate
      if (simulation.targetGoalDeduction) {
        const targetGoal = state.savingsGoals.find((g) => g.id === simulation.targetGoalDeduction);
        const pace = targetGoal ? Math.max(1, targetGoal.dailyContribution) : totalDailySavingsPace;
        const acceleratedDays = Math.round(simulation.amount / pace);
        impactOnGoalsSummary = `Windfall of +${formatINR(simulation.amount)} accelerates ${targetGoal ? targetGoal.title : 'savings'} schedule by ~${acceleratedDays} days!`;
      } else {
        const acceleratedDays = Math.round(simulation.amount / Math.max(1, totalDailySavingsPace));
        impactOnGoalsSummary = `Windfall of +${formatINR(simulation.amount)} accelerates savings schedule by ~${acceleratedDays} days across goals!`;
      }
    } else if (simulation.type === 'one_off') {
      if (simulation.day <= currentDay) {
        simBankBalance -= simulation.amount;
      }
    }
  }

  // Future one-off reserved
  let futureOneOffReserved = 0;
  if (simulation && simulation.type === 'one_off' && simulation.day > currentDay) {
    if (simulation.targetGoalDeduction) {
      const g = state.savingsGoals.find((goal) => goal.id === simulation.targetGoalDeduction);
      const absorbed = g ? Math.min(g.currentSaved, simulation.amount) : 0;
      futureOneOffReserved = simulation.amount - absorbed;
    } else {
      futureOneOffReserved = simulation.amount;
    }
  }

  // 7. Effective Liquid Balance & Safe Daily Allowance (Fix Issue 3):
  // Liquid Pool reserves: upcoming bills + current locked savings + remaining planned savings contributions!
  const baseEffectiveLiquid = Math.max(
    0,
    baseCurrentBankBalance -
      state.commitments.filter((c) => !c.isPaid && c.dueDay >= currentDay).reduce((s, c) => s + c.amount, 0) -
      state.savingsGoals.reduce((s, g) => s + g.currentSaved, 0) -
      remainingPlannedSavingsToFund
  );

  const baseSafeDailyAllowance = Math.max(
    1,
    Math.round((baseEffectiveLiquid / remainingDays) * 10) / 10
  );

  const simEffectiveLiquid = Math.max(
    0,
    simBankBalance - unpaidUpcomingCommitments - totalLockedSavings - remainingPlannedSavingsToFund - futureOneOffReserved
  );

  const safeDailyAllowance = Math.max(0, Math.round((simEffectiveLiquid / remainingDays) * 10) / 10);

  // 8. Regret Metric
  let regretDays = 0;
  if (simulation && simulation.type !== 'income') {
    regretDays = Math.round((simulation.amount / baseSafeDailyAllowance) * 10) / 10;
  }

  // 9. Dual-Trajectory Burndown & Day 30 Goals Verification (Fix Issue 3 & 4):
  const projectedBalances: {
    day: number;
    balance: number;
    simulatedBalance?: number;
    allowanceTrajectoryBalance: number;
    projectedGoalSavings: number;
    safeAllowance: number;
    daySpend: number;
  }[] = [];

  let runningPaceBase = state.startingBudget;
  let runningPaceSim = state.startingBudget;
  let runningAllowanceSim = state.startingBudget;
  let brokeDay: number | null = null;

  for (let d = 1; d <= TOTAL_DAYS; d++) {
    let daySpend = 0;

    if (d <= effectiveRecordDay) {
      // Historical actual
      const dayTxs = state.transactions.filter((tx) => tx.day === d);
      for (const tx of dayTxs) {
        if (tx.type === 'income') {
          runningPaceBase += tx.amount;
          runningPaceSim += tx.amount;
          runningAllowanceSim += tx.amount;
        } else {
          runningPaceBase -= tx.amount;
          runningPaceSim -= tx.amount;
          runningAllowanceSim -= tx.amount;
          daySpend += tx.amount;
        }
      }
    } else {
      // Future days
      const dayCommitments = state.commitments.filter((c) => !c.isPaid && c.dueDay === d);
      const commitSum = dayCommitments.reduce((sum, c) => sum + c.amount, 0);

      // Trajectory Line A: at current discretionary pace
      runningPaceBase -= (dailyDiscretionaryBurnRate + commitSum);
      runningPaceSim -= (dailyDiscretionaryBurnRate + commitSum);

      // Trajectory Line B: strictly adhering to safe allowance + scheduled bills
      runningAllowanceSim -= (safeDailyAllowance + commitSum);

      daySpend = Math.round(safeDailyAllowance + commitSum);

      if (simulation && simulation.type === 'recurring_monthly' && d === simulation.day) {
        runningPaceSim -= simulation.amount;
        runningAllowanceSim -= simulation.amount;
        daySpend += simulation.amount;
      }
    }

    if (simulation && simulation.type === 'one_off' && d === simulation.day) {
      runningPaceSim -= simulation.amount;
      if (d > currentDay) {
        runningAllowanceSim -= simulation.amount;
      }
      daySpend += simulation.amount;
    } else if (simulation && simulation.type === 'income' && d === simulation.day) {
      runningPaceSim += simulation.amount;
      runningAllowanceSim += simulation.amount;
    }

    if (runningPaceSim <= 0 && brokeDay === null && d >= currentDay) {
      brokeDay = d;
    }

    const projectedGoalSavings =
      d <= currentDay
        ? totalLockedSavings
        : Math.round(
            totalLockedSavings +
              ((d - currentDay) / Math.max(1, TOTAL_DAYS - currentDay)) *
                remainingPlannedSavingsToFund
          );

    projectedBalances.push({
      day: d,
      balance: Math.round(runningPaceBase),
      simulatedBalance: Math.round(runningPaceSim),
      allowanceTrajectoryBalance: Math.round(runningAllowanceSim),
      projectedGoalSavings,
      safeAllowance: d >= currentDay ? safeDailyAllowance : 0,
      daySpend,
    });
  }

  // Day 30 un-clamped forecast
  const projectedMonthEndBalance = Math.round(runningPaceSim);
  const projectedDay30TotalSavings = Math.round(totalLockedSavings + remainingPlannedSavingsToFund);

  // 10. Financial Health Scoring (0 - 100)
  // Runway Score (0 - 25): Smooth ratio of safe daily allowance vs base allowance
  const runwayRatio = safeDailyAllowance / Math.max(1, baseSafeDailyAllowance);
  const runwayScore = Math.min(25, Math.max(2, Math.round(runwayRatio * 25)));

  const expectedPacingRatio = currentDay / TOTAL_DAYS;
  const actualSpendRatio = (state.startingBudget - simBankBalance) / state.startingBudget;
  const pacingDelta = actualSpendRatio - expectedPacingRatio;
  let budgetPacingScore = 20;
  if (pacingDelta <= -0.05) budgetPacingScore = 25;
  else if (pacingDelta <= 0.05) budgetPacingScore = 21;
  else if (pacingDelta <= 0.15) budgetPacingScore = 16;
  else if (pacingDelta <= 0.25) budgetPacingScore = 11;
  else budgetPacingScore = 6;

  let commitmentsScore = 25;
  if (simBankBalance < unpaidUpcomingCommitments) {
    commitmentsScore = 4;
  } else if (simBankBalance < unpaidUpcomingCommitments * 1.3) {
    commitmentsScore = 14;
  } else {
    commitmentsScore = 25;
  }

  const emergencyGoal = state.savingsGoals.find((g) => g.priority === 'emergency_buffer');
  let bufferScore = 15;
  if (emergencyGoal) {
    const currentEmergency = simulatedGoalBalances[emergencyGoal.id] ?? emergencyGoal.currentSaved;
    const fundedPct = currentEmergency / emergencyGoal.targetAmount;
    bufferScore = Math.min(25, Math.max(0, Math.round(fundedPct * 25)));
  }

  const totalHealthScore = Math.min(
    100,
    Math.max(0, runwayScore + budgetPacingScore + commitmentsScore + bufferScore)
  );

  let riskStatus: 'thriving' | 'stable' | 'caution' | 'critical' = 'stable';
  let genZCookedStatus: 'locked_in' | 'chilling' | 'simmering' | 'cooked' = 'chilling';
  let cookedLabel = 'Chilling 💅';

  if (totalHealthScore >= 78) {
    riskStatus = 'thriving';
    genZCookedStatus = 'locked_in';
    cookedLabel = 'Locked In 🚀';
  } else if (totalHealthScore >= 58) {
    riskStatus = 'stable';
    genZCookedStatus = 'chilling';
    cookedLabel = 'Chilling 💅';
  } else if (totalHealthScore >= 40) {
    riskStatus = 'caution';
    genZCookedStatus = 'simmering';
    cookedLabel = 'Getting Simmered ⚠️';
  } else {
    riskStatus = 'critical';
    genZCookedStatus = 'cooked';
    cookedLabel = 'Fully Cooked 💀';
  }

  const riskFactors: string[] = [];
  const positiveHighlights: string[] = [];

  if (safeDailyAllowance < 75) {
    riskFactors.push(`Daily safe spending is squeezed down to ${formatINR(safeDailyAllowance)}/day.`);
  } else {
    positiveHighlights.push(`Comfortable daily safe allowance of ${formatINR(safeDailyAllowance)}/day maintained.`);
  }

  if (projectedMonthEndBalance < 0) {
    riskFactors.push(`At current burn rate, short by ${formatINR(Math.abs(projectedMonthEndBalance))} at month end.`);
  } else {
    positiveHighlights.push(`Positive cashflow runway projected through Day 30.`);
  }

  if (unpaidUpcomingCommitments > 0) {
    if (simBankBalance > unpaidUpcomingCommitments * 1.5) {
      positiveHighlights.push(`All ${formatINR(unpaidUpcomingCommitments)} in upcoming bills are 100% safeguarded.`);
    } else {
      riskFactors.push(`Tight cover for upcoming bills (${formatINR(unpaidUpcomingCommitments)} due soon).`);
    }
  }

  const breakdown = {
    runwayScore,
    budgetPacingScore,
    commitmentsScore,
    bufferResilienceScore: bufferScore,
  };

  const metrics: SimulationMetrics = {
    currentBalance: Math.round(simBankBalance),
    effectiveLiquid: Math.round(simEffectiveLiquid),
    safeDailyAllowance,
    projectedMonthEndBalance,
    remainingPlannedSavingsToFund,
    projectedDay30TotalSavings,
    brokeDay,
    healthScore: totalHealthScore,
    riskStatus,
    genZCookedStatus,
    cookedLabel,
    regretDays,
    impactOnGoalsSummary,
    goalDelays,
    simulatedGoalBalances,
    breakdown,
  };

  const health: FinancialHealthBreakdown = {
    score: totalHealthScore,
    runwayScore,
    budgetPacingScore,
    commitmentsScore,
    bufferResilienceScore: bufferScore,
    status: riskStatus,
    cookedLabel,
    riskFactors,
    positiveHighlights,
  };

  const dailyAllowanceHistory = [];
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    const dayActual = state.transactions
      .filter((t) => t.day === d && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    dailyAllowanceHistory.push({
      day: d,
      safeAllowance: safeDailyAllowance,
      actualSpend: dayActual,
      projectedSpend: d > currentDay ? dailyDiscretionaryBurnRate : dayActual,
    });
  }

  return {
    metrics,
    health,
    categorySpending,
    dailyAllowanceHistory,
    projectedBalances,
  };
}

export const computeFinancialEngine = simulate;

export function formatINR(val: number): string {
  const rounded = Math.round(val);
  const isNegative = rounded < 0;
  const abs = Math.abs(rounded);
  const formatted = abs.toLocaleString('en-IN');
  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}
