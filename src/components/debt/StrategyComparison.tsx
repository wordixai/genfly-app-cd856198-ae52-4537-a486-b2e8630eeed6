import { useDebtStore } from '@/hooks/useDebtStore';
import { compareStrategies, formatCurrency } from '@/utils/debtCalculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDownIcon, ClockIcon, DollarSignIcon, TargetIcon } from 'lucide-react';

export const StrategyComparison = () => {
  const { debts, extraPayment } = useDebtStore();

  if (debts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <TargetIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Add debts to see strategy comparisons</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const comparison = compareStrategies(debts, extraPayment);
  const { snowball, avalanche, savingsWithAvalanche, timeReduction } = comparison;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDownIcon className="h-5 w-5" />
            Strategy Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Snowball Method */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Snowball Method</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Psychological
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Pay off smallest balances first for quick wins and motivation
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payoff Time</span>
                  <span className="font-semibold">{snowball.totalPayoff} months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Interest</span>
                  <span className="font-semibold">{formatCurrency(snowball.totalInterest)}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm">Payoff Order:</span>
                  {snowball.payoffOrder.slice(0, 3).map((debt, index) => (
                    <div key={debt.id} className="flex items-center justify-between text-xs">
                      <span>{index + 1}. {debt.name}</span>
                      <span>{formatCurrency(debt.balance)}</span>
                    </div>
                  ))}
                  {snowball.payoffOrder.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{snowball.payoffOrder.length - 3} more...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Avalanche Method */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Avalanche Method</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Mathematical
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Pay off highest interest rates first to minimize total cost
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payoff Time</span>
                  <span className="font-semibold">{avalanche.totalPayoff} months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Interest</span>
                  <span className="font-semibold">{formatCurrency(avalanche.totalInterest)}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm">Payoff Order:</span>
                  {avalanche.payoffOrder.slice(0, 3).map((debt, index) => (
                    <div key={debt.id} className="flex items-center justify-between text-xs">
                      <span>{index + 1}. {debt.name}</span>
                      <span>{debt.interestRate.toFixed(2)}%</span>
                    </div>
                  ))}
                  {avalanche.payoffOrder.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{avalanche.payoffOrder.length - 3} more...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-4">Avalanche vs Snowball Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <DollarSignIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Interest Savings</p>
                  <p className="font-semibold text-green-600">
                    {savingsWithAvalanche > 0 ? formatCurrency(savingsWithAvalanche) : 'No savings'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ClockIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Savings</p>
                  <p className="font-semibold text-blue-600">
                    {timeReduction > 0 ? `${timeReduction} months` : 'Same time'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};