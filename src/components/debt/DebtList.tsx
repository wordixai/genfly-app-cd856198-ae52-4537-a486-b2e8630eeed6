import { useDebtStore } from '@/hooks/useDebtStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon, CreditCardIcon, GraduationCapIcon, CarIcon, HomeIcon, DollarSignIcon, FileTextIcon } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/debtCalculations';

const DEBT_ICONS = {
  credit_card: CreditCardIcon,
  student_loan: GraduationCapIcon,
  personal_loan: DollarSignIcon,
  mortgage: HomeIcon,
  auto_loan: CarIcon,
  other: FileTextIcon,
};

const DEBT_COLORS = {
  credit_card: 'bg-red-100 text-red-800',
  student_loan: 'bg-blue-100 text-blue-800',
  personal_loan: 'bg-green-100 text-green-800',
  mortgage: 'bg-purple-100 text-purple-800',
  auto_loan: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export const DebtList = () => {
  const { debts, removeDebt } = useDebtStore();

  if (debts.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <CreditCardIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No debts added yet. Start by adding your first debt above.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Debt Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Debt</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Debts</p>
              <p className="text-2xl font-bold text-blue-600">{debts.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Min. Payments</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalMinimumPayment)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {debts.map((debt) => {
          const IconComponent = DEBT_ICONS[debt.type];
          return (
            <Card key={debt.id} className="debt-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{debt.name}</h3>
                      <Badge variant="secondary" className={DEBT_COLORS[debt.type]}>
                        {debt.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeDebt(debt.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Balance</p>
                    <p className="font-semibold">{formatCurrency(debt.balance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Interest Rate</p>
                    <p className="font-semibold">{formatPercentage(debt.interestRate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Min. Payment</p>
                    <p className="font-semibold">{formatCurrency(debt.minimumPayment)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};