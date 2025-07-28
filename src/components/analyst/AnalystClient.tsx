"use client";

import { useState, useMemo } from "react";
import React from 'react';
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Goal } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { analyzeGoals } from "@/ai/flows/goal-analyst-flow";
import { Skeleton } from "@/components/ui/skeleton";
import Markdown from "@/components/ui/markdown";
import { useAuth } from "@/hooks/use-auth";

export default function AnalystClient() {
  const { user } = useAuth();
  const [allGoals, _, goalsLoading] = useLocalStorage<Goal[]>("realgoal-goals", []);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const goals = useMemo(() => {
    if (!user) return [];
    return allGoals.filter(g => g.userId === user.uid);
  }, [allGoals, user]);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeGoals({ goals });
      setAnalysis(result.analysis);
    } catch (e) {
      console.error(e);
      setError("Ocorreu um erro ao analisar suas metas. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasGoals = goals && goals.length > 0;

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline">Análise de Metas com IA</h1>
          <p className="text-muted-foreground">Receba dicas e insights personalizados para alcançar seus objetivos.</p>
        </div>
        <Button onClick={handleAnalyze} disabled={isLoading || !hasGoals}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Analisar Minhas Metas
        </Button>
      </header>

      {goalsLoading ? (
        <Card className="mt-6">
            <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
            </CardContent>
        </Card>
      ) : !hasGoals ? (
         <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Bot className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhuma meta para analisar</h2>
            <p className="text-muted-foreground mb-4 max-w-sm">Crie algumas metas financeiras primeiro, e então a nossa IA poderá te ajudar a alcançá-las.</p>
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="p-6">
            {isLoading ? (
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                         <Skeleton className="h-4 w-[220px]" />
                    </div>
                </div>
            ) : error ? (
                <div className="text-center text-destructive">
                    <p>{error}</p>
                </div>
            ) : analysis ? (
                <Markdown content={analysis} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10">
                 <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Bot className="h-10 w-10 text-primary" />
                 </div>
                 <h2 className="text-xl font-semibold mb-2">Pronto para analisar suas metas!</h2>
                 <p className="text-muted-foreground max-w-md">
                    Clique no botão "Analisar Minhas Metas" para receber um feedback personalizado e dicas da nossa Inteligência Artificial.
                 </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
