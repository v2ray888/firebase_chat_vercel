'use client';

import { useState, useEffect } from 'react';
import type { Conversation, Message, User, Customer } from '@/types';
import { ConversationList } from '@/components/chat/conversation-list';
import { ChatWindow } from '@/components/chat/chat-window';
import { CaseDetails } from '@/components/chat/case-details';
import { AiSuggestions } from '@/components/chat/ai-suggestions';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [agent, setAgent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [convResponse, agentResponse] = await Promise.all([
          fetch('/api/conversations'),
          // In a real app, you'd fetch the currently logged-in agent
          fetch('/api/users').then(res => res.json().then(users => users.find((u: User) => u.email === 'alex.doe@example.com')))
        ]);
        
        if (!convResponse.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const convData: Conversation[] = await convResponse.json();
        
        setConversations(convData);
        if (convData.length > 0) {
          setSelectedConvId(convData[0].id);
        }

        if (agentResponse) {
          setAgent(agentResponse);
        } else {
          // Fallback or handle case where agent is not found
           const mockAgent: User = { id: '72890a1a-4530-4355-8854-82531580e0a5', name: 'Alex Doe', email: 'alex.doe@example.com', avatar: 'https://picsum.photos/seed/1/40/40', role: 'agent', status: 'online' };
           setAgent(mockAgent);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally, set some error state to show in the UI
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedConversation = conversations.find(c => c.id === selectedConvId) || null;

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConvId(conversation.id);
  };

  const handleSendMessage = (message: Omit<Message, 'id' | 'timestamp' | 'case_id'>) => {
    if (!selectedConvId || !agent) return;

    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      case_id: selectedConvId,
      user_id: agent.id,
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConvId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );
     // TODO: API call to persist the message
  };

  const handleUpdateStatus = (status: 'open' | 'in-progress' | 'resolved') => {
    if (!selectedConvId) return;

    setConversations(prev =>
        prev.map(c =>
            c.id === selectedConvId && c.case ? { ...c, case: { ...c.case, status } } : c
        )
    );
     // TODO: API call to persist the status change
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    if (!agent) return;
    handleSendMessage({
        sender_type: 'agent',
        content: suggestion,
        user_id: agent.id,
    });
  };

  const lastCustomerMessage = selectedConversation?.messages.filter(m => m.sender_type === 'user').slice(-1)[0];

  if (loading) {
    return (
        <div className="p-4 grid gap-4 grid-cols-4 h-full max-h-[calc(100vh-4rem)] items-stretch">
             <Skeleton className="col-span-1 h-full" />
             <Skeleton className="col-span-2 h-full" />
             <Skeleton className="col-span-1 h-full" />
        </div>
    )
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full max-h-[calc(100vh-4rem)] items-stretch p-4 gap-4">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
        <Card className="h-full">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        </Card>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45} minSize={30}>
          {selectedConversation && agent ? (
            <Card className="flex h-full flex-col">
                <ChatWindow conversation={selectedConversation} onSendMessage={handleSendMessage} agentAvatar={agent.avatar} />
            </Card>
          ) : (
             <Card className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">选择一个对话开始聊天</p>
            </Card>
          )}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        {selectedConversation ? (
          <Card className="flex h-full flex-col">
            <div className="flex-shrink-0">
                <CaseDetails conversation={selectedConversation} onUpdateStatus={handleUpdateStatus} />
            </div>
            <div className="flex-grow overflow-y-auto">
                <AiSuggestions
                    customerQuery={lastCustomerMessage?.content || ''}
                    chatHistory={selectedConversation.messages.map(m => `${m.sender_type}: ${m.content}`).join('\n')}
                    onSuggestionClick={handleSuggestionClick}
                />
            </div>
          </Card>
        ) : (
            <Card className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">案例详情将显示在此处</p>
            </Card>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
