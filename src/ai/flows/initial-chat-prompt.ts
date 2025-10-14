'use server';

/**
 * @fileOverview Generates an initial chat prompt using AI based on user query and chat history.
 *
 * - generateInitialPrompt - A function that generates the initial chat prompt.
 * - InitialPromptInput - The input type for the generateInitialPrompt function.
 * - InitialPromptOutput - The return type for the generateInitialPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialPromptInputSchema = z.object({
  query: z.string().describe('The user query.'),
  chatHistory: z.string().describe('The chat history.'),
});
export type InitialPromptInput = z.infer<typeof InitialPromptInputSchema>;

const InitialPromptOutputSchema = z.object({
  initialPrompt: z.string().describe('The generated initial prompt.'),
});
export type InitialPromptOutput = z.infer<typeof InitialPromptOutputSchema>;

export async function generateInitialPrompt(input: InitialPromptInput): Promise<InitialPromptOutput> {
  return initialPromptFlow(input);
}

const initialPromptPrompt = ai.definePrompt({
  name: 'initialPromptPrompt',
  input: {schema: InitialPromptInputSchema},
  output: {schema: InitialPromptOutputSchema},
  prompt: `You are an AI assistant designed to generate an initial prompt based on the user's query and chat history.

User Query: {{{query}}}
Chat History: {{{chatHistory}}}

Generate an initial prompt to start the chat session. Consider the previous chat history and user query to create an appropriate starting point.`,
});

const initialPromptFlow = ai.defineFlow(
  {
    name: 'initialPromptFlow',
    inputSchema: InitialPromptInputSchema,
    outputSchema: InitialPromptOutputSchema,
  },
  async input => {
    const {output} = await initialPromptPrompt(input);
    return output!;
  }
);
