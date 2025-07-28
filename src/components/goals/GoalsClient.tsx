"use client";

import { useState } from "react";
import { type Goal } from "@/types/goal";
import { type Transaction } from "@/types/transaction";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import GoalCard from "./GoalCard";
import GoalDialog from "./GoalDialog";
import AddAmountDialog from "./AddAmountDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsClient() {
  const [goals, setGoals, goalsLoading] = useLocalStorage<Goal[]>("realgoal-goals", []);
  const [transactions, setTransactions, txsLoading] = useLocalStorage<Transaction[]>("realgoal-transactions", []);
  
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [addAmountDialogOpen, setAddAmountDialogOpen] = useState(false);
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setGoalDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setGoalDialogOpen(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };
  
  const handleOpenAddAmount = (goal: Goal) => {
    setSelectedGoal(goal);
    setAddAmountDialogOpen(true);
  };

  const handleSaveGoal = (goalData: Omit<Goal, "id" | "currentAmount"> & { id?: string, initialAmount: number }) => {
    if (selectedGoal) { // Editing existing goal
      setGoals(
        goals.map((g) =>
          g.id === selectedGoal.id
            ? { ...g, name: goalData.name, totalAmount: goalData.totalAmount, deadline: goalData.deadline }
            : g
        )
      );
    } else { // Creating new goal
      const newGoal: Goal = {
        id: crypto.randomUUID(),
        name: goalData.name,
        totalAmount: goalData.totalAmount,
        currentAmount: goalData.initialAmount || 0,
        deadline: goalData.deadline,
      };
      setGoals([...goals, newGoal]);
      if (goalData.initialAmount > 0) {
        const newTransaction: Transaction = {
          id: crypto.randomUUID(),
          description: `Valor inicial para a meta: ${newGoal.name}`,
          amount: goalData.initialAmount,
          category: "Investimentos/Metas",
          type: 'expense',
          date: new Date().toISOString(),
        };
        setTransactions([...transactions, newTransaction]);
      }
    }
    setGoalDialogOpen(false);
    setSelectedGoal(null);
  };

  const handleAddAmount = (amount: number) => {
    if (!selectedGoal) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: `Adicionado à meta: ${selectedGoal.name}`,
      amount: amount,
      category: "Investimentos/Metas",
      type: 'expense',
      date: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);

    setGoals(goals.map(g => 
        g.id === selectedGoal.id 
        ? {...g, currentAmount: g.currentAmount + amount}
        : g
    ));

    setAddAmountDialogOpen(false);
    setSelectedGoal(null);
  }

  const isLoading = goalsLoading || txsLoading;

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline">Minhas Metas Financeiras</h1>
          <p className="text-muted-foreground">Crie e acompanhe seu progresso para alcançar seus sonhos.</p>
        </div>
        <Button onClick={handleCreateGoal} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Nova Meta
        </Button>
      </header>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-lg" />)}
        </div>
      ) : goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => handleEditGoal(goal)}
              onDelete={() => handleDeleteGoal(goal.id)}
              onAddAmount={() => handleOpenAddAmount(goal)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Target className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhuma meta encontrada</h2>
            <p className="text-muted-foreground mb-4 max-w-sm">Comece a planejar seu futuro. Crie sua primeira meta financeira para realizar seus sonhos.</p>
            <Button onClick={handleCreateGoal}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Primeira Meta
            </Button>
        </div>
      )}

      <GoalDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        onSave={handleSaveGoal}
        goalToEdit={selectedGoal}
      />

      <AddAmountDialog
        open={addAmountDialogOpen}
        onOpenChange={setAddAmountDialogOpen}
        onSave={handleAddAmount}
        goalName={selectedGoal?.name || ""}
      />
    </div>
  );
}
