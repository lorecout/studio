export type Transaction = {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'expense';
  date: string; // ISO date string
};
