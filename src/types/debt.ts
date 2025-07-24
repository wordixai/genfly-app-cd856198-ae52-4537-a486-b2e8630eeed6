export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit_card' | 'student_loan' | 'personal_loan' | 'mortgage' | 'auto_loan' | 'other';
}

export interface PaymentSchedule {
  month: number;
  balance: number;
  payment: number;
  interestPaid: number;
  principalPaid: number;
  totalInterest: number;
}

export interface DebtStrategy {
  type: 'snowball' | 'avalanche';
  totalPayoff: number;
  totalInterest: number;
  payoffOrder: Debt[];
  monthlySchedule: { [debtId: string]: PaymentSchedule[] };
}

export interface StrategyComparison {
  snowball: DebtStrategy;
  avalanche: DebtStrategy;
  savingsWithAvalanche: number;
  timeReduction: number;
}