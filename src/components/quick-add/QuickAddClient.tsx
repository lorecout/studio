"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { quickAddTransactions, type QuickAddOutput } from "@/ai/flows/quick-add-flow";
import { Loader2, Wand2, FileInput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

export default function QuickAddClient() {
  const [text, setText] = useState("");
  const [parsedTransactions, setParsedTransactions] = useState<QuickAddOutput['transactions']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("realgoal-transactions", []);
  const { toast } = useToast();

  const handleProcessText = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setParsedTransactions([]);
    try {
      const result = await quickAddTransactions({ text });
      setParsedTransactions(result.transactions);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao processar texto",
        description: "A IA não conseguiu processar as informações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransactions = () => {
    const newTransactions: Transaction[] = parsedTransactions.map(tx => ({
        ...tx,
        id: crypto.randomUUID(),
        date: new Date().toISOString()
    }));

    setTransactions([...transactions, ...newTransactions]);
    
    toast({
        title: "Transações adicionadas!",
        description: `${newTransactions.length} novas transações foram salvas com sucesso.`
    });

    setText("");
    setParsedTransactions([]);
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-headline">Importação Rápida com IA</h1>
        <p className="text-muted-foreground">Digite ou cole suas despesas e receitas, e a IA as organizará para você.</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>1. Insira os dados</CardTitle>
              <CardDescription>
                Ex: "Padaria 25.50, Salário 5000, Aluguel 1500". Uma linha por item funciona melhor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Digite suas transações aqui..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
              />
              <Button onClick={handleProcessText} disabled={isLoading || !text.trim()} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Processar com IA
              </Button>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>2. Revise e Adicione</CardTitle>
              <CardDescription>
                Confira as transações que a IA identificou. Se estiver tudo certo, clique para adicionar.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {parsedTransactions.length > 0 ? (
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parsedTransactions.map((tx, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell><Badge variant="outline">{tx.category}</Badge></TableCell>
                                        <TableCell className={`text-right font-medium ${tx.type === 'expense' ? 'text-destructive' : 'text-green-600'}`}>{formatCurrency(tx.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <Button onClick={handleAddTransactions} className="w-full">
                            Adicionar {parsedTransactions.length} Transações
                        </Button>
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg h-full">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <FileInput className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Aguardando dados</h2>
                        <p className="text-muted-foreground max-w-sm">As transações processadas pela IA aparecerão aqui para sua revisão.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
