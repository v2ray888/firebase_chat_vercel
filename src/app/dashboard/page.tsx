'use client';

import { useState } from 'react';
import { conversations as initialConversations, users } from '@/lib/data';
import type { Conversation, Message } from '@/types';
import { ConversationList } from '@/components/chat/conversation-list';
import { ChatWindow } from '@/components/chat/chat-window';
import { CaseDetails } from '@/components/chat/case-details';
import { AiSuggestions } from '@/components/chat/ai-suggestions';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConversations[0]?.id || null);

  const selectedConversation = conversations.find(c => c.id === selectedConvId) || null;
  const agent = users[0]; // Mock current agent

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConvId(conversation.id);
  };

  const handleSendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!selectedConvId) return;

    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConvId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );
  };

  const handleUpdateStatus = (status: 'open' | 'in-progress' | 'resolved') => {
    if (!selectedConvId) return;

    setConversations(prev =>
        prev.map(c =>
            c.id === selectedConvId ? { ...c, case: { ...c.case, status } } : c
        )
    );
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage({
        sender: 'agent',
        content: suggestion,
        agentId: agent.id,
    });
  };

  const lastCustomerMessage = selectedConversation?.messages.filter(m => m.sender === 'user').slice(-1)[0];

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full max-h-[calc(100vh-4rem)] items-stretch">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
        <div className="h-full overflow-y-auto">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45} minSize={30}>
        <div className="flex h-full flex-col">
          {selectedConversation ? (
            <ChatWindow conversation={selectedConversation} onSendMessage={handleSendMessage} agentAvatar={agent.avatar} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        {selectedConversation ? (
          <div className="flex h-full flex-col">
            <div className="flex-shrink-0">
                <CaseDetails conversation={selectedConversation} onUpdateStatus={handleUpdateStatus} />
            </div>
            <div className="flex-grow overflow-y-auto">
                <AiSuggestions
                    customerQuery={lastCustomerMessage?.content || ''}
                    chatHistory={selectedConversation.messages.map(m => `${m.sender}: ${m.content}`).join('\n')}
                    onSuggestionClick={handleSuggestionClick}
                />
            </div>
          </div>
        ) : (
            <div className="flex h-full items-center justify-center border-l">
              <p className="text-muted-foreground">Case details will appear here</p>
            </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
