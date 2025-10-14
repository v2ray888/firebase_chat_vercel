'use client';

import { useState, useEffect } from 'react';
import type { Conversation, Message, User, Customer } from '@/types';
import { ConversationList } from '@/components/chat/conversation-list';
import { ChatWindow } from '@/components/chat/chat-window';
import { CaseDetails } from '@/components/chat/case-details';
import { AiSuggestions } from '@/components/chat/ai-suggestions';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [agent, setAgent] = useState<User | null>(null);

  useEffect(() => {
    // Mock fetching data. In a real app, this would be an API call.
    const mockCustomers: Customer[] = [
        { id: 'cust-1', name: 'Jamie Robert', email: 'jamie.robert@example.com', avatar: 'https://picsum.photos/seed/101/40/40' },
        { id: 'cust-2', name: 'Pat Taylor', email: 'pat.taylor@example.com', avatar: 'https://picsum.photos/seed/102/40/40' },
        { id: 'cust-3', name: 'Chris Garcia', email: 'chris.garcia@example.com', avatar: 'https://picsum.photos/seed/103/40/40' },
        { id: 'cust-4', name: 'Taylor Miller', email: 'taylor.miller@example.com', avatar: 'https://picsum.photos/seed/104/40/40' },
    ];
    
    const initialConversations: Conversation[] = [
      {
        id: 'conv-1',
        customer: mockCustomers[0],
        messages: [
          { id: 'msg-1-1', sender: 'user', content: '你好，我最近的订单遇到了问题。还没有送达。', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
          { id: 'msg-1-2', sender: 'agent', agentId: 'user-1', content: '你好 Jamie，听到这个消息我很难过。您能提供您的订单号吗？', timestamp: new Date(Date.now() - 1000 * 60 * 23).toISOString() },
          { id: 'msg-1-3', sender: 'user', content: '当然，是 #12345XYZ。', timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
          { id: 'msg-1-4', sender: 'agent', agentId: 'user-1', content: '谢谢你。让我为你查询一下状态。', timestamp: new Date(Date.now() - 1000 * 60 * 21).toISOString() },
          { id: 'msg-1-5', sender: 'user', content: '好的，我等着。', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() },
        ],
        case: { id: 'case-1', status: 'in-progress', summary: '关于延迟订单 #12345XYZ 的查询。' },
      },
      {
        id: 'conv-2',
        customer: mockCustomers[1],
        messages: [
          { id: 'msg-2-1', sender: 'user', content: '我想退货。', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
          { id: 'msg-2-2', sender: 'agent', agentId: 'user-2', content: '我可以帮忙。您想退货的商品是什么？', timestamp: new Date(Date.now() - 1000 * 60 * 118).toISOString() },
        ],
        case: { id: 'case-2', status: 'open', summary: '未指明商品的退货请求。' },
      },
      {
        id: 'conv-3',
        customer: mockCustomers[2],
        messages: [
          { id: 'msg-3-1', sender: 'user', content: '我的优惠码无效。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
          { id: 'msg-3-2', sender: 'system', content: '此对话已由 Alex Doe 解决。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
        ],
        case: { id: 'case-3', status: 'resolved', summary: '优惠码应用问题。' },
      },
      {
        id: 'conv-4',
        customer: mockCustomers[3],
        messages: [
          { id: 'msg-4-1', sender: 'user', content: '你们向加拿大发货吗？', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        ],
        case: { id: 'case-4', status: 'open', summary: '关于国际运输的问题。' },
      },
    ];

    const mockAgent: User = { id: 'user-1', name: 'Alex Doe', email: 'alex.doe@example.com', avatar: 'https://picsum.photos/seed/1/40/40', role: 'agent', status: 'online' };

    setConversations(initialConversations);
    if (initialConversations.length > 0) {
        setSelectedConvId(initialConversations[0].id);
    }
    setAgent(mockAgent);
  }, []);

  const selectedConversation = conversations.find(c => c.id === selectedConvId) || null;

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConvId(conversation.id);
  };

  const handleSendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!selectedConvId || !agent) return;

    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentId: agent.id,
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
            c.id === selectedConvId && c.case ? { ...c, case: { ...c.case, status } } : c
        )
    );
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    if (!agent) return;
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
          {selectedConversation && agent ? (
            <ChatWindow conversation={selectedConversation} onSendMessage={handleSendMessage} agentAvatar={agent.avatar} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">选择一个对话开始聊天</p>
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
              <p className="text-muted-foreground">案例详情将显示在此处</p>
            </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
