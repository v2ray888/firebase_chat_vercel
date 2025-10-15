'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Conversation, Message } from '@/types';
import { Send, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'caseId' | 'customerId' >) => void;
  agentAvatar: string;
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
}

export function ChatWindow({ conversation, onSendMessage, agentAvatar, isRightPanelOpen, toggleRightPanel }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [conversation.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage({
        senderType: 'agent',
        content: newMessage,
        userId: 'user-1', // This should come from logged in user session
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={conversation.customer.avatar} alt={conversation.customer.name} />
            <AvatarFallback>{conversation.customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{conversation.customer.name}</CardTitle>
            <CardDescription>{conversation.customer.email}</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleRightPanel}>
          {isRightPanelOpen ? <PanelRightClose /> : <PanelRightOpen />}
          <span className="sr-only">{isRightPanelOpen ? '隐藏详情' : '显示详情'}</span>
        </Button>
      </CardHeader>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {conversation.messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
                message.senderType === 'agent' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.senderType === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={conversation.customer.avatar} />
                  <AvatarFallback>{conversation.customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2',
                  message.senderType === 'agent' ? 'bg-primary text-primary-foreground' : 'bg-card border',
                  message.senderType === 'system' && 'w-full bg-transparent border-none text-center text-xs text-muted-foreground'
                )}
              >
                <p className="text-sm">{message.content}</p>
                 {message.senderType !== 'system' && (
                  <p className={cn(
                      'text-xs mt-1',
                      message.senderType === 'agent' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                    {format(new Date(message.timestamp), 'p')}
                  </p>
                )}
              </div>
              {message.senderType === 'agent' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={agentAvatar} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            placeholder="在此处输入您的消息..."
            className="pr-20 resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                }
            }}
          />
          <Button type="submit" size="icon" className="absolute top-1/2 -translate-y-1/2 right-3" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">发送</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
