'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {conversations.map((item) => {
          const lastMessage = item.messages[item.messages.length - 1];
          const isSelected = selectedConversation?.id === item.id;
          return (
            <button
              key={item.id}
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                isSelected && 'bg-accent'
              )}
              onClick={() => onSelectConversation(item)}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={item.customer.avatar} alt={item.customer.name} />
                        <AvatarFallback>{item.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold">{item.customer.name}</div>
                </div>
                {lastMessage && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                  </div>
                )}
              </div>
              {lastMessage && (
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {lastMessage.sender === 'agent' && 'You: '}
                  {lastMessage.content}
                </div>
              )}
               <div className="flex items-center gap-2">
                 {item.case.status === 'open' && <span className="flex h-2 w-2 rounded-full bg-blue-500" />}
                 {item.case.status === 'in-progress' && <span className="flex h-2 w-2 rounded-full bg-yellow-500" />}
                 {item.case.status === 'resolved' && <span className="flex h-2 w-2 rounded-full bg-green-500" />}
                <span className="text-xs capitalize text-muted-foreground">{item.case.status.replace('-', ' ')}</span>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
