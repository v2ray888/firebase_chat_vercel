'use client';

import { useState, useEffect } from 'react';
import type { Conversation, Message, User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatLayout } from '@/components/chat/chat-layout';

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [agent, setAgent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

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

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConvId(conversationId);
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

  if (loading || !agent) {
    return (
        <div className="p-4 grid gap-4 h-full items-stretch">
             <Skeleton className="h-full w-full" />
        </div>
    )
  }

  return (
    <div className="h-full">
      <ChatLayout
        conversations={conversations}
        selectedConversation={selectedConversation}
        agent={agent}
        isRightPanelOpen={isRightPanelOpen}
        onSelectConversation={handleSelectConversation}
        onSendMessage={handleSendMessage}
        onUpdateStatus={handleUpdateStatus}
        onSuggestionClick={handleSuggestionClick}
        toggleRightPanel={() => setIsRightPanelOpen(prev => !prev)}
      />
    </div>
  );
}
