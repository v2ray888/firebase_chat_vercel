'use client';

import { aiSuggestedResponses } from '@/ai/flows/ai-suggested-responses';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AiSuggestionsProps {
  customerQuery: string;
  chatHistory: string;
  onSuggestionClick: (suggestion: string) => void;
}

export function AiSuggestions({ customerQuery, chatHistory, onSuggestionClick }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSuggestions() {
      if (customerQuery) {
        setLoading(true);
        try {
          // This is a mock call. In a real scenario, you'd provide more detailed past cases.
          const pastCases = "客户上个月遇到了类似的问题，通过清除缓存解决了。";
          const response = await aiSuggestedResponses({
            customerQuery,
            chatHistory,
            pastCases,
          });
          setSuggestions(response.suggestedResponses);
        } catch (error) {
          console.error("未能获取AI建议:", error);
          // Handle error gracefully in a real app, maybe show a toast.
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }

    if (customerQuery) {
        const timer = setTimeout(() => {
            getSuggestions();
        }, 500); // Debounce to avoid rapid calls
        return () => clearTimeout(timer);
    } else {
        setSuggestions([]);
        setLoading(false);
    }
    
  }, [customerQuery, chatHistory]);

  return (
    <div className="border-t">
      <CardHeader className="flex-row items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <CardTitle className="font-headline text-base">AI 建议</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        )}
        {!loading && suggestions.length === 0 && customerQuery && (
          <p className="text-sm text-muted-foreground">此查询没有可用的建议。</p>
        )}
         {!loading && suggestions.length === 0 && !customerQuery && (
          <p className="text-sm text-muted-foreground">等待客户的下一条消息以生成建议。</p>
        )}
        {!loading &&
          suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full h-auto text-left justify-start py-2"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
      </CardContent>
    </div>
  );
}
