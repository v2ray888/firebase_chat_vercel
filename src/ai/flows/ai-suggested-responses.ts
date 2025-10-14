'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-suggested responses to customer support agents.
 *
 * - aiSuggestedResponses - A function that takes customer query and chat history as input and returns suggested responses.
 * - AISuggestedResponsesInput - The input type for the aiSuggestedResponses function.
 * - AISuggestedResponsesOutput - The return type for the aiSuggestedResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISuggestedResponsesInputSchema = z.object({
  customerQuery: z.string().describe('The latest query from the customer.'),
  chatHistory: z.string().describe('The chat history between the customer and the support agent.'),
  pastCases: z.string().describe('Relevant information from past cases.'),
});

export type AISuggestedResponsesInput = z.infer<typeof AISuggestedResponsesInputSchema>;

const AISuggestedResponsesOutputSchema = z.object({
  suggestedResponses: z.array(z.string()).describe('An array of suggested responses for the support agent.'),
});

export type AISuggestedResponsesOutput = z.infer<typeof AISuggestedResponsesOutputSchema>;

export async function aiSuggestedResponses(input: AISuggestedResponsesInput): Promise<AISuggestedResponsesOutput> {
  return aiSuggestedResponsesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestedResponsesPrompt',
  input: {schema: AISuggestedResponsesInputSchema},
  output: {schema: AISuggestedResponsesOutputSchema},
  prompt: `You are an AI assistant helping customer support agents respond to customer inquiries efficiently.\n\n  Based on the customer's query, chat history, and relevant information from past cases, provide a list of suggested responses that the agent can use.\n\n  Customer Query: {{{customerQuery}}}\n  Chat History: {{{chatHistory}}}\n  Past Cases: {{{pastCases}}}\n\n  Suggested Responses:`, // Add handlebars
});

const aiSuggestedResponsesFlow = ai.defineFlow(
  {
    name: 'aiSuggestedResponsesFlow',
    inputSchema: AISuggestedResponsesInputSchema,
    outputSchema: AISuggestedResponsesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
