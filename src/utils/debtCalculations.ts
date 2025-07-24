import { Debt, DebtStrategy, PaymentSchedule, StrategyComparison } from '@/types/debt';

export const calculateSnowballStrategy = (debts: Debt[], extraPayment: number): DebtStrategy => {
  // Sort by balance (lowest first) for snowball method
  const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
  return calculateStrategy(sortedDebts, extraPayment, 'snowball');
};

export const calculateAvalancheStrategy = (debts: Debt[], extraPayment: number): DebtStrategy => {
  // Sort by interest rate (highest first) for avalanche method
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  return calculateStrategy(sortedDebts, extraPayment, 'avalanche');
};

const calculateStrategy = (sortedDebts: Debt[], extraPayment: number, type: 'snowball' | 'avalanche'): DebtStrategy => {
  if (sortedDebts.length === 0) {
    return {
      type,
      totalPayoff: 0,
      totalInterest: 0,
      payoffOrder: [],
      monthlySchedule: {},
    };
  }

  let totalInterest = 0;
  let currentMonth = 1;
  const monthlySchedule: { [debtId: string]: PaymentSchedule[] } = {};
  const workingDebts = sortedDebts.map(debt => ({ ...debt }));
  const payoffOrder: Debt[] = [];

  // Initialize schedules
  workingDebts.forEach(debt => {
    monthlySchedule[debt.id] = [];
  });

  while (workingDebts.length > 0) {
    let remainingExtraPayment = extraPayment;
    
    // Apply minimum payments to all debts
    workingDebts.forEach(debt => {
      const monthlyInterest = (debt.balance * (debt.interestRate / 100)) / 12;
      const principalPayment = Math.min(debt.minimumPayment - monthlyInterest, debt.balance);
      
      debt.balance -= principalPayment;
      totalInterest += monthlyInterest;

      monthlySchedule[debt.id].push({
        month: currentMonth,
        balance: Math.max(0, debt.balance),
        payment: Math.min(debt.minimumPayment, debt.balance + principalPayment),
        interestPaid: monthlyInterest,
        principalPaid: principalPayment,
        totalInterest: totalInterest,
      });
    });

    // Apply extra payment to the target debt (first in sorted order)
    if (workingDebts.length > 0 && remainingExtraPayment > 0) {
      const targetDebt = workingDebts[0];
      const extraPrincipal = Math.min(remainingExtraPayment, targetDebt.balance);
      
      targetDebt.balance -= extraPrincipal;
      
      // Update the last payment record to include extra payment
      const lastRecord = monthlySchedule[targetDebt.id][monthlySchedule[targetDebt.id].length - 1];
      lastRecord.payment += extraPrincipal;
      lastRecord.principalPaid += extraPrincipal;
      lastRecord.balance = Math.max(0, targetDebt.balance);
      
      remainingExtraPayment -= extraPrincipal;
    }

    // Remove paid-off debts
    const paidOffDebts = workingDebts.filter(debt => debt.balance <= 0);
    paidOffDebts.forEach(debt => {
      payoffOrder.push(debt);
      extraPayment += debt.minimumPayment; // Snowball effect
    });

    // Keep only remaining debts
    workingDebts.splice(0, workingDebts.length);
    workingDebts.push(...workingDebts.filter(debt => debt.balance > 0));

    currentMonth++;

    // Safety check to prevent infinite loops
    if (currentMonth > 1200) break;
  }

  return {
    type,
    totalPayoff: currentMonth - 1,
    totalInterest,
    payoffOrder,
    monthlySchedule,
  };
};

export const compareStrategies = (debts: Debt[], extraPayment: number): StrategyComparison => {
  const snowball = calculateSnowballStrategy(debts, extraPayment);
  const avalanche = calculateAvalancheStrategy(debts, extraPayment);
  
  const savingsWithAvalanche = snowball.totalInterest - avalanche.totalInterest;
  const timeReduction = snowball.totalPayoff - avalanche.totalPayoff;

  return {
    snowball,
    avalanche,
    savingsWithAvalanche,
    timeReduction,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPercentage = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};