'use server';
/**
 * @fileOverview An AI agent that suggests relevant search queries based on user input and the current product catalog.
 *
 * - suggestSearchQueries - A function that handles the generation of suggested search queries.
 * - SuggestedSearchQueriesInput - The input type for the suggestSearchQueries function.
 * - SuggestedSearchQueriesOutput - The return type for the suggestSearchQueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedSearchQueriesInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user input to generate suggested search queries for.'),
  productCatalog: z
    .string()
    .describe('The current product catalog as a string.'),
});
export type SuggestedSearchQueriesInput = z.infer<typeof SuggestedSearchQueriesInputSchema>;

const SuggestedSearchQueriesOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('An array of suggested search queries.'),
});
export type SuggestedSearchQueriesOutput = z.infer<typeof SuggestedSearchQueriesOutputSchema>;

export async function suggestSearchQueries(input: SuggestedSearchQueriesInput): Promise<SuggestedSearchQueriesOutput> {
  return suggestSearchQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSearchQueriesPrompt',
  input: {schema: SuggestedSearchQueriesInputSchema},
  output: {schema: SuggestedSearchQueriesOutputSchema},
  prompt: `You are an expert in e-commerce search query suggestions.

You will be provided with the user's current input, and the current product catalog.

Based on this information, you will generate an array of suggested search queries that the user can use to quickly find the products they are interested in.

User Input: {{{userInput}}}

Product Catalog: {{{productCatalog}}}

Suggestions:`,
});

const suggestSearchQueriesFlow = ai.defineFlow(
  {
    name: 'suggestSearchQueriesFlow',
    inputSchema: SuggestedSearchQueriesInputSchema,
    outputSchema: SuggestedSearchQueriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
