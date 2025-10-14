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
  prompt: `你是一个AI助手，旨在根据用户的查询和聊天记录生成一个初始提示。

用户查询: {{{query}}}
聊天记录: {{{chatHistory}}}

生成一个初始提示来开始聊天会话。考虑以前的聊天记录和用户查询，以创建一个合适的起点。`,
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
