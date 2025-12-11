export type TransactionType = 'income' | 'expense';

export interface Category {
  _id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault?: boolean;
}

export interface Account {
  _id: string;
  name: string;
  type: 'bank' | 'cash' | 'wallet';
  currentBalance: number;
  initialBalance: number;
  currency: string;
}

export interface Attachment {
  url: string;
  provider: 'local' | 'cloudinary';
  filename: string;
  size: number;
  mimetype: string;
}

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  // account: Account;
  date: string;
  notes?: string;
  attachments: Attachment[];
  tags?: string[];
  categorySource?: 'rule' | 'llm' | 'learning' | 'recurrence' | 'manual';
  categoryConfidence?: number;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface Budget {
  _id: string;
  month: number;
  year: number;
  totalLimit: number;
  totalSpent: number;
  categoryBudgets: {
    category: Category;
    limit: number;
    spent: number;
  }[];
}

export interface MonthlyStats {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
}

export interface CategoryStats {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  total: number;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'budget' | 'recurring' | 'summary';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Investment Types
export interface InvestmentSuggestion {
  title: string;
  description: string;
  suggestedAmount: number;
  type: string;
  risk: 'low' | 'medium' | 'high';
  expectedReturn: string;
  minAmount: number;
  maxAmount: number;
}

export interface SurplusData {
  income: number;
  expenses: number;
  surplus: number;
  savingsRate: number;
  month: number;
  year: number;
  manualSurplus?: number;
}

export interface FinancialProfile {
  _id: string;
  user: string;
  riskLevel: 'low' | 'medium' | 'high';
  isAutoRisk: boolean;
  monthlyIncome: number;
  monthlyBudget: number;
  avgSavingsRate: number;
  surplusHistory: number[];
  manualSurplus?: number;
  lastUpdated: string;
}

export interface InvestmentPlan {
  plan: string;
  suggestions: InvestmentSuggestion[];
}

export type NormalizedFundCategory = 'index' | 'equity' | 'balanced' | 'gold' | 'debt';

export interface CategoryPerformance {
  id: string;
  category: string;
  normalizedCategory: NormalizedFundCategory;
  avg1Month: number;
  avg3Month: number;
  avg1Year: number;
  updatedAt: string;
}

export interface AllocationBreakdown {
  category: string;
  label: string;
  percentage: number;
  monthlyAmount: number;
  annualizedReturn: number;
  fiveYearProjection: number;
  rationale: string;
}

export interface AIRecommendation {
  bestPerformingCategory: string;
  allocation: Record<string, number>;
  reasoning: string;
  summary: string;
  planHorizonYears: number;
  totalInvested: number;
  projectedValue: number;
  actionChecklist: string[];
  allocationBreakdown: AllocationBreakdown[];
  categoryPerformance: CategoryPerformance[];
}

export type GoalPriority = 'high' | 'medium' | 'low';

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  priority: GoalPriority;
  monthlyContribution: number;
  expectedMonths: number;
  expectedYears: number;
  categorySuggested: NormalizedFundCategory | string;
  minimumTenureApplied?: boolean;
  note?: string;
  status: 'in-progress' | 'achievable' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalPayload {
  name: string;
  targetAmount: number;
  priority: GoalPriority;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  settings: {
    currency: string;
    timezone: string;
    notificationsEnabled: boolean;
  };
  isPremium: boolean;
  premiumExpiresAt?: Date;
  tokenBalance: number;
  subscriptionId?: string;
  monthlyPdfUploads?: {
    count: number;
    lastReset: string;
  };
}

