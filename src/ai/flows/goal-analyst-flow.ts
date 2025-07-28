'use server';
/**
 * @fileOverview An AI flow for analyzing financial goals.
 *
 * - analyzeGoals - A function that provides an analysis of the user's financial goals.
 * - GoalAnalystInput - The input type for the analyzeGoals function.
 * - GoalAnalystOutput - The return type for the analyzeGoals function.
 */

import { ai } from '@/ai/genkit';
import { Goal, GoalSchema } from '@/types/goal';
import { z } from 'zod';

const GoalAnalystInputSchema = z.object({
  goals: z.array(GoalSchema),
});
export type GoalAnalystInput = z.infer<typeof GoalAnalystInputSchema>;

const GoalAnalystOutputSchema = z.object({
  analysis: z.
    string()
    .describe(
      'An analysis of the financial goals, providing tips and suggestions. The response should be in Markdown format.'
    ),
});
export type GoalAnalystOutput = z.infer<typeof GoalAnalystOutputSchema>;

export async function analyzeGoals(
  input: GoalAnalystInput
): Promise<GoalAnalystOutput> {
  return await goalAnalystFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalAnalystPrompt',
  input: { schema: GoalAnalystInputSchema },
  output: { schema: GoalAnalystOutputSchema },
  prompt: `
    Você é um assistente financeiro amigável e motivador chamado "Analista de Metas AI".
    Sua tarefa é analisar as metas financeiras de um usuário e fornecer feedback construtivo, dicas e sugestões personalizadas em formato Markdown.

    **Instruções:**
    1.  Comece com uma saudação calorosa e encorajadora.
    2.  Analise o conjunto de metas fornecido. Considere o progresso, os prazos e os valores.
    3.  Forneça uma análise geral do status das metas.
    4.  Ofereça de 2 a 4 dicas práticas e acionáveis para ajudar o usuário a alcançar suas metas. As dicas devem ser relevantes para as metas específicas.
    5.  Se houver metas atrasadas, aborde-as de forma sensível e ofereça sugestões para colocá-las de volta nos trilhos.
    6.  Termine com uma nota positiva e motivacional.
    7.  Use formatação Markdown (negrito, itálico, listas) para tornar a leitura agradável.

    **Metas do Usuário:**
    {{#each goals}}
    - **Meta:** {{name}}
      - **Valor Alvo:** R$ {{totalAmount}}
      - **Valor Atual:** R$ {{currentAmount}}
      - **Prazo:** {{deadline}}
    {{/each}}
    `,
});

const goalAnalystFlow = ai.defineFlow(
  {
    name: 'goalAnalystFlow',
    inputSchema: GoalAnalystInputSchema,
    outputSchema: GoalAnalystOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    return llmResponse.output!;
  }
);
