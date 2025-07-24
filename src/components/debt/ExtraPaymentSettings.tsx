import { useState } from 'react';
import { useDebtStore } from '@/hooks/useDebtStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/debtCalculations';

export const ExtraPaymentSettings = () => {
  const { extraPayment, setExtraPayment } = useDebtStore();
  const [inputValue, setInputValue] = useState(extraPayment.toString());

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setExtraPayment(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= 5000) {
      setExtraPayment(numValue);
    }
  };

  const adjustPayment = (amount: number) => {
    const newValue = Math.max(0, Math.min(5000, extraPayment + amount));
    setExtraPayment(newValue);
    setInputValue(newValue.toString());
  };

  const quickAmounts = [0, 50, 100, 200, 500];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircleIcon className="h-5 w-5" />
          Extra Monthly Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="extra-payment">Monthly Extra Payment</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustPayment(-50)}
                disabled={extraPayment <= 0}
              >
                <MinusCircleIcon className="h-4 w-4" />
              </Button>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="extra-payment"
                  type="number"
                  min="0"
                  max="5000"
                  step="25"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustPayment(50)}
                disabled={extraPayment >= 5000}
              >
                <PlusCircleIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Adjust with slider</Label>
            <Slider
              value={[extraPayment]}
              onValueChange={handleSliderChange}
              min={0}
              max={5000}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span className="font-medium">{formatCurrency(extraPayment)}</span>
              <span>$5,000</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Quick Select</Label>
          <div className="grid grid-cols-5 gap-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                variant={extraPayment === amount ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setExtraPayment(amount);
                  setInputValue(amount.toString());
                }}
                className="text-xs"
              >
                {amount === 0 ? 'None' : formatCurrency(amount)}
              </Button>
            ))}
          </div>
        </div>

        {extraPayment > 0 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              Adding <strong>{formatCurrency(extraPayment)}</strong> extra per month will significantly 
              accelerate your debt payoff and reduce total interest paid.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};