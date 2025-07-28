export type Transaction = {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
  date: string; // ISO date string
};
