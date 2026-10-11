export type TransactionCategory =
  | 'Food & Dining'
  | 'Transit & Commute'
  | 'Rent & Hostel'
  | 'Utilities & Wi-Fi'
  | 'Subscriptions'
  | 'College & Study'
  | 'Social & Night Out'
  | 'Shopping & Gear'
  | 'Health & Emergency'
  | 'Gigs & Cashback';

export type SpendingClassification = 'need' | 'want' | 'savings';

export interface Transaction {
  id: string;
  day: number; // Day 1 to 30
  title: string;
  amount: number;
  category: TransactionCategory;
  classification: SpendingClassification;
  type: 'expense' | 'income';
  timestamp: string;
  note?: string;
  isSimulated?: boolean;
}

export interface Commitment {
  id: string;
  title: string;
  amount: number;
  dueDay: number; // 1 to 30
  category: TransactionCategory;
  isPaid: boolean;
  isSubscription: boolean;
  frequency: 'Monthly';
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentSaved: number;
  monthlyAllocation: number; // e.g. ₹500/mo
  dailyContribution: number; // e.g. ₹16.7/day
  priority: 'emergency_buffer' | 'essential_goal' | 'lifestyle';
  lockedUntilEnd: boolean;
  deadlineDay: number;
  color: string;
}

export interface UnexpectedScenario {
  id: string;
  title: string;
  description: string;
  amount: number; // Negative for unexpected expense, positive for windfall
  category: TransactionCategory;
  severity: 'minor' | 'moderate' | 'major';
}

export interface DecisionSimulationInput {
  title: string;
  amount: number;
  category: TransactionCategory;
  classification: SpendingClassification;
  type: 'one_off' | 'recurring_monthly' | 'income';
  day: number; // Day 1 to 30
  targetGoalDeduction?: string; // If dipping into a savings goal
}

export interface GoalDelayDetail {
  goalId: string;
  goalTitle: string;
  absorbedFromGoal: number;
  spilloverFromLiquid: number;
  delayDays: number;
  shortfallAtDay30: number;
  missesDeadline: boolean;
  newSaved: number;
  previousSaved: number;
  dailyContribution: number;
}

export interface FinancialHealthBreakdown {
  score: number; // 0 to 100
  runwayScore: number; // 0 to 25
  budgetPacingScore: number; // 0 to 25
  commitmentsScore: number; // 0 to 25
  bufferResilienceScore: number; // 0 to 25
  status: 'thriving' | 'stable' | 'caution' | 'critical';
  cookedLabel: string; // "Locked In 🚀" | "Chilling 💅" | "Getting Simmered ⚠️" | "Fully Cooked 💀"
  riskFactors: string[];
  positiveHighlights: string[];
}

export interface SimulationMetrics {
  currentBalance: number;
  effectiveLiquid: number;
  safeDailyAllowance: number;
  projectedMonthEndBalance: number;
  remainingPlannedSavingsToFund: number;
  projectedDay30TotalSavings: number;
  brokeDay: number | null; // null if month finishes positive, otherwise day 1-30
  healthScore: number;
  riskStatus: 'thriving' | 'stable' | 'caution' | 'critical';
  genZCookedStatus: 'locked_in' | 'chilling' | 'simmering' | 'cooked';
  cookedLabel: string;
  regretDays: number; // "costs X days of daily allowance"
  impactOnGoalsSummary: string;
  goalDelays: GoalDelayDetail[];
  simulatedGoalBalances: Record<string, number>;
  breakdown: {
    runwayScore: number;
    budgetPacingScore: number;
    commitmentsScore: number;
    bufferResilienceScore: number;
  };
}

export interface BudgetChallenge {
  id: string;
  title: string;
  subtitle: string;
  estimatedSaving: number;
  durationDays: number;
  completed: boolean;
  active: boolean;
}

export interface PlanComparison {
  planA: {
    title: string;
    metrics: SimulationMetrics;
  };
  planB: {
    title: string;
    metrics: SimulationMetrics;
  };
}
