'use server';
/**
 * @fileOverview An AI flow for quickly adding transactions from a text input.
 *
 * - quickAddTransactions - A function that parses a text input and returns a list of transactions.
 * - QuickAddInput - The input type for the quickAddTransactions function.
 * - QuickAddOutput - The return type for the quickAddTransactions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuickAddInputSchema = z.object({
  text: z.string().describe('The unstructured text containing transaction information.'),
});
export type QuickAddInput = z.infer<typeof QuickAddInputSchema>;

const TransactionSchema = z.object({
    description: z.string().describe("Descrição da transação (ex: 'Almoço no restaurante')"),
    amount: z.number().describe("Valor da transação (ex: 45.50)"),
    category: z.string().describe("Categoria da transação (ex: 'Alimentação', 'Transporte', 'Salário')"),
    type: z.enum(['income', 'expense']).describe("Tipo da transação: 'income' para entradas, 'expense' para saídas"),
    date: z.string().optional().describe("Data da transação ou vencimento no formato ISO (YYYY-MM-DD). Se não especificada, a IA não deve preencher."),
});

const QuickAddOutputSchema = z.object({
  transactions: z.array(TransactionSchema),
});
export type QuickAddOutput = z.infer<typeof QuickAddOutputSchema>;

export async function quickAddTransactions(
  input: QuickAddInput
): Promise<QuickAddOutput> {
  return await quickAddFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quickAddPrompt',
  input: { schema: QuickAddInputSchema },
  output: { schema: QuickAddOutputSchema },
  prompt: `
    Você é um assistente de finanças especialista em extrair informações de transações de um texto.
    Sua tarefa é analisar o texto fornecido e converter cada item em um objeto de transação estruturado.

    **Instruções:**
    1. Leia o texto e identifique cada transação individual.
    2. Para cada transação, extraia a descrição, o valor, a categoria, o tipo e, opcionalmente, a data.
    3. **Descrição:** O que foi a transação.
    4. **Valor:** O montante numérico. Se não for especificado, assuma 0.
    5. **Categoria:** Tente inferir uma categoria apropriada (ex: 'Alimentação', 'Transporte', 'Lazer', 'Salário', 'Moradia'). Se não conseguir, use 'Outros'.
    6. **Tipo:** Determine se é uma despesa ('expense') ou uma receita ('income'). A maioria será despesa, a menos que palavras como 'salário', 'bônus', 'recebi', 'venda' indiquem o contrário.
    7. **Data:** Identifique se há uma data de vencimento ou data da transação (ex: "vence dia 10", "pagar no dia 5", "compra de ontem"). Hoje é {{request.time}}. Se o dia mencionado já passou no mês atual, assuma que é para o próximo mês. Retorne a data no formato YYYY-MM-DD. Se nenhuma data for mencionada, não preencha o campo 'date'.
    8. Retorne um array de objetos de transação. Se nenhuma transação for encontrada, retorne um array vazio.

    **Texto do Usuário:**
    {{{text}}}
    `,
});

const quickAddFlow = ai.defineFlow(
  {
    name: 'quickAddFlow',
    inputSchema: QuickAddInputSchema,
    outputSchema: QuickAddOutputSchema,
  },
  async (input) => {
    if (!input.text.trim()) {
        return { transactions: [] };
    }
    const llmResponse = await prompt(input);
    return llmResponse.output!;
  }
);
