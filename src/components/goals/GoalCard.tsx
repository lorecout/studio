"use client";

import { type Goal } from "@/types/goal";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onAddAmount: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}


export default function GoalCard({ goal, onEdit, onDelete, onAddAmount }: GoalCardProps) {
  const progress = goal.totalAmount > 0 ? Math.min((goal.currentAmount / goal.totalAmount) * 100, 100) : 0;
  
  const isOverdue = new Date(goal.deadline) < new Date() && progress < 100;
  const isCompleted = progress >= 100;

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <CardTitle className="text-lg font-bold font-headline leading-tight">{goal.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-primary">
                    {formatCurrency(goal.currentAmount)}
                </span>
                <span className="text-sm text-muted-foreground">
                    de {formatCurrency(goal.totalAmount)}
                </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between items-end mt-1">
                <span className="text-xs font-semibold text-accent">{progress.toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Prazo: {formatDate(goal.deadline)}</span>
            {isCompleted ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">Concluída</Badge>
            ) : isOverdue && (
                <Badge variant="destructive">Atrasada</Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onAddAmount} className="w-full" variant="outline" disabled={isCompleted}>
          <DollarSign className="mr-2 h-4 w-4" />
          Adicionar Valor
        </Button>
      </CardFooter>
    </Card>
  );
}
