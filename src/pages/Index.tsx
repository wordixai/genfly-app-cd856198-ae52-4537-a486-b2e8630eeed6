import { useState } from 'react';
import { useDebtStore } from '@/hooks/useDebtStore';
import { DebtForm } from '@/components/debt/DebtForm';
import { DebtList } from '@/components/debt/DebtList';
import { StrategyComparison } from '@/components/debt/StrategyComparison';
import { ExtraPaymentSettings } from '@/components/debt/ExtraPaymentSettings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingDownIcon, 
  PlusIcon, 
  ListIcon, 
  SettingsIcon, 
  TargetIcon,
  BanknotesIcon,
  InfoIcon
} from 'lucide-react';

const Index = () => {
  const { debts, clearAllDebts } = useDebtStore();
  const [activeTab, setActiveTab] = useState('overview');

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-debt rounded-lg">
                <TrendingDownIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">DebtWise</h1>
                <p className="text-sm text-muted-foreground">Strategic debt repayment planner</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {debts.length > 0 && (
                <>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Debt</p>
                    <p className="text-xl font-bold text-red-600">
                      ${totalDebt.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={clearAllDebts}
                    className="text-destructive hover:text-destructive"
                  >
                    Clear All
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TargetIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="debts" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              <span className="hidden sm:inline">My Debts</span>
              {debts.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {debts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Add Debt</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <StrategyComparison />
              </div>
              <div className="space-y-6">
                <ExtraPaymentSettings />
                
                {debts.length === 0 && (
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                          Get Started
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Add your debts to see personalized repayment strategies and compare 
                          the snowball vs avalanche methods.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab('add')}
                          className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          Add Your First Debt
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="debts">
            <DebtList />
          </TabsContent>

          <TabsContent value="add">
            <div className="max-w-2xl mx-auto">
              <DebtForm />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-lg mx-auto">
              <ExtraPaymentSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;