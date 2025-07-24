import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Debt } from '@/types/debt';

interface DebtStore {
  debts: Debt[];
  extraPayment: number;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  setExtraPayment: (amount: number) => void;
  clearAllDebts: () => void;
}

export const useDebtStore = create<DebtStore>()(
  persist(
    (set) => ({
      debts: [],
      extraPayment: 0,
      
      addDebt: (debt) =>
        set((state) => ({
          debts: [
            ...state.debts,
            { ...debt, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      
      updateDebt: (id, updatedDebt) =>
        set((state) => ({
          debts: state.debts.map((debt) =>
            debt.id === id ? { ...debt, ...updatedDebt } : debt
          ),
        })),
      
      removeDebt: (id) =>
        set((state) => ({
          debts: state.debts.filter((debt) => debt.id !== id),
        })),
      
      setExtraPayment: (amount) =>
        set(() => ({
          extraPayment: amount,
        })),
      
      clearAllDebts: () =>
        set(() => ({
          debts: [],
          extraPayment: 0,
        })),
    }),
    {
      name: 'debt-wise-storage',
    }
  )
);