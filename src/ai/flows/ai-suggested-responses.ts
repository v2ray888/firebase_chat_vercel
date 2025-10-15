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
  try {
    return await aiSuggestedResponsesFlow(input);
  } catch (error) {
    console.error("AI建议响应错误:", error);
    // 在没有有效API密钥的情况下，提供默认建议
    return {
      suggestedResponses: [
        "您好！感谢您的咨询，我会尽快回复您。",
        "我理解您的问题，让我帮您解决。",
        "请稍等，我正在查看相关信息。"
      ]
    };
  }
}

const prompt = ai.definePrompt({
  name: 'aiSuggestedResponsesPrompt',
  input: {schema: AISuggestedResponsesInputSchema},
  output: {schema: AISuggestedResponsesOutputSchema},
  prompt: `你是一个AI助手，帮助客服人员高效地回应客户的咨询。

根据客户的查询、聊天记录和过去案例的相关信息，为客服人员提供一系列建议的回复。

客户查询: {{{customerQuery}}}
聊天记录: {{{chatHistory}}}
过去案例: {{{pastCases}}}

建议的回复:`, // Add handlebars
});

const aiSuggestedResponsesFlow = ai.defineFlow(
  {
    name: 'aiSuggestedResponsesFlow',
    inputSchema: AISuggestedResponsesInputSchema,
    outputSchema: AISuggestedResponsesOutputSchema,
  },
  async input => {
    // 检查是否有有效的API密钥
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      // 没有有效API密钥时，返回默认建议
      return {
        suggestedResponses: [
          "您好！感谢您的咨询，我会尽快回复您。",
          "我理解您的问题，让我帮您解决。",
          "请稍等，我正在查看相关信息。"
        ]
      };
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);