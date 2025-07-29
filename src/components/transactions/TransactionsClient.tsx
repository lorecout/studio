"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Transaction } from "@/types/transaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRight, CheckCircle, Clock, PlusCircle, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import TransactionDialog from "./TransactionDialog";
import { useAuth } from "@/hooks/use-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


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

interface BalanceCardProps {
    title: string;
    value: number;
    variant: 'income' | 'expense' | 'balance';
    className?: string;
}

function BalanceCard({ title, value, variant, className }: BalanceCardProps) {
    const variantClasses = {
        income: 'text-green-600',
        expense: 'text-destructive',
        balance: 'text-primary'
    };

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${variantClasses[variant]}`}>{formatCurrency(value)}</div>
            </CardContent>
        </Card>
    );
}

export default function TransactionsClient() {
  const { user } = useAuth();
  const [transactions, setTransactions, isLoading] = useLocalStorage<Transaction[]>("realgoal-transactions", []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const userTransactions = useMemo(() => {
    if (!transactions || !user) return [];
    return [...transactions]
        .filter(tx => tx.userId === user.uid)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, user]);
  
  const handleNewTransaction = () => {
    setTransactionToEdit(null);
    setDialogOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setTransactionToEdit(tx);
    setDialogOpen(true);
  };

  const handleDeleteTransaction = (txId: string) => {
    setTransactions(current => (current ?? []).filter(tx => tx.id !== txId));
  };

  const handleConfirmPayment = (txId: string) => {
    setTransactions((currentTransactions) =>
      (currentTransactions ?? []).map(tx =>
        tx.id === txId ? { ...tx, status: 'paid' } : tx
      )
    );
  };

  const handleSaveTransaction = (data: Omit<Transaction, "id" | "status" | "userId">, id?: string) => {
    if (!user) return;
    if (id) {
        // Editing
        setTransactions(current => (current ?? []).map(tx => tx.id === id ? {...tx, ...data } : tx));
    } else {
        // Creating
        const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            status: data.type === 'income' ? 'paid' : 'pending',
            userId: user.uid,
            ...data,
        };
        setTransactions((prevTxs) => [...(prevTxs || []), newTransaction]);
    }
    setDialogOpen(false);
  };

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    if (!userTransactions) return { totalIncome: 0, totalExpense: 0, balance: 0 };
    
    const { income, expense } = userTransactions.reduce(
      (totals, tx) => {
        if (tx.type === 'income' && tx.status === 'paid') {
          totals.income += tx.amount;
        } else if (tx.type === 'expense' && tx.status === 'paid') {
          totals.expense += tx.amount;
        }
        return totals;
      },
      { income: 0, expense: 0 }
    );
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [userTransactions]);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline">Painel Financeiro</h1>
          <p className="text-muted-foreground">Acompanhe suas receitas, despesas e o balanço geral.</p>
        </div>
        <Button onClick={handleNewTransaction} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Transação
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <BalanceCard title="Receitas (Confirmadas)" value={totalIncome} variant="income" />
            <BalanceCard title="Despesas (Pagas)" value={totalExpense} variant="expense" />
            <BalanceCard title="Saldo" value={balance} variant="balance" />
          </>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[50vh]">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : userTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="font-medium">{tx.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {tx.status === 'paid' ? (
                          <Badge variant="secondary" className="text-green-700 bg-green-100">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Confirmado
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-amber-700 bg-amber-100">
                            <Clock className="mr-1 h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${tx.type === 'expense' ? 'text-destructive' : 'text-green-600'}`}>
                        {tx.type === 'income' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {tx.status === 'pending' && (
                          <Button variant="ghost" size="sm" onClick={() => handleConfirmPayment(tx.id)} className="mr-2">
                            Confirmar
                          </Button>
                        )}
                         <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditTransaction(tx)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Essa ação não pode ser desfeita. Isso excluirá permanentemente a transação.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteTransaction(tx.id)}>Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <ArrowLeftRight className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Nenhuma transação encontrada</h2>
                <p className="text-muted-foreground mb-4 max-w-sm">Use a "Importação Rápida" ou adicione manualmente sua primeira transação.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}
