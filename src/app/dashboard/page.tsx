'use client';

import { useState, useEffect } from 'react';
import type { Conversation, Message, User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatLayout } from '@/components/chat/chat-layout';
import { useToast } from '@/hooks/use-toast';


export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [agent, setAgent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const { toast } = useToast();

  const fetchConversations = async () => {
    try {
      const convResponse = await fetch('/api/conversations');
      if (!convResponse.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const convData: Conversation[] = await convResponse.json();
      
      // 更新对话列表，但保留我们刚刚发送的临时消息
      setConversations(prev => {
        // 对于每个从服务器获取的对话
        return convData.map(conv => {
          // 检查我们是否在本地有这个对话
          const localConv = prev.find(c => c.id === conv.id);
          
          if (localConv) {
            // 如果本地对话中有临时消息，我们需要保留它们直到服务器确认
            const tempMessages = localConv.messages.filter(m => m.id.startsWith('msg-'));
            
            // 合并服务器消息和本地临时消息
            // 但避免重复（如果服务器已经包含了临时消息）
            const serverMessages = conv.messages.filter(serverMsg => 
              !tempMessages.some(tempMsg => tempMsg.timestamp === serverMsg.timestamp && tempMsg.content === serverMsg.content)
            );
            
            return {
              ...conv,
              messages: [...serverMessages, ...tempMessages]
            };
          }
          
          // 如果本地没有这个对话，直接使用服务器数据
          return conv;
        });
      });
      
      if (!selectedConvId && convData.length > 0) {
        setSelectedConvId(convData[0].id);
      } else if (convData.length === 0) {
        setSelectedConvId(null);
      }

    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({ variant: 'destructive', title: '错误', description: '无法加载对话。' });
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await fetchConversations();

      try {
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const users = await usersResponse.json();
        const agentUser = users.find((u: User) => u.email === 'alex.doe@example.com');

        if (agentUser) {
          setAgent(agentUser);
        } else {
           const mockAgent: User = { id: '72890a1a-4530-4355-8854-82531580e0a5', name: 'Alex Doe', email: 'alex.doe@example.com', avatar: 'https://picsum.photos/seed/1/40/40', role: 'agent', status: 'online', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' };
           setAgent(mockAgent);
        }

      } catch (error) {
        console.error("Error fetching agent:", error);
        toast({ variant: 'destructive', title: '错误', description: '无法加载代理信息。' });
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

  const handleSendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'caseId'>) => {
    if (!selectedConvId || !agent) return;

    const tempId = `msg-${Date.now()}`;
    const newMessage: Message = {
      ...message,
      id: tempId,
      timestamp: new Date().toISOString(),
      caseId: selectedConvId,
      userId: agent.id,
    };
    
    // Optimistic update
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConvId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                case_id: selectedConvId,
                sender_type: 'agent',
                content: message.content,
                user_id: agent.id,
                image_url: message.imageUrl || null, // 添加imageUrl字段
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const savedMessage = await response.json();

        // Replace temporary message with saved one
        setConversations(prev =>
            prev.map(c => {
                if (c.id === selectedConvId) {
                    return {
                        ...c,
                        messages: c.messages.map(m => m.id === tempId ? savedMessage : m)
                    };
                }
                return c;
            })
        );
        
        // 只在需要时刷新对话列表，而不是每次都刷新
        // fetchConversations();
        
        // 或者，如果我们确实需要刷新，确保使用更新后的数据
        // 但要避免用旧数据覆盖新数据
        // 可以通过在fetchConversations中添加适当的缓存策略来实现


    } catch (error) {
        console.error("Failed to send message:", error);
        toast({ variant: 'destructive', title: '错误', description: '发送消息失败。' });
        // Revert optimistic update
        setConversations(prev =>
            prev.map(c =>
                c.id === selectedConvId ? { ...c, messages: c.messages.filter(m => m.id !== tempId) } : c
            )
        );
    }
  };

  const handleUpdateStatus = async (status: 'open' | 'in-progress' | 'resolved') => {
    if (!selectedConvId) return;

    const originalConversations = conversations;
    
    // Optimistic update
    setConversations(prev =>
        prev.map(c =>
            c.id === selectedConvId && c.case ? { ...c, case: { ...c.case, status } } : c
        )
    );

    try {
      const response = await fetch(`/api/cases/${selectedConvId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      toast({ title: '成功', description: '案例状态已更新。' });
      fetchConversations();
    } catch (error) {
       console.error("Failed to update status:", error);
       toast({ variant: 'destructive', title: '错误', description: '更新状态失败。' });
       setConversations(originalConversations); // Revert on failure
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    if (!agent) return;
    handleSendMessage({
        senderType: 'agent',
        content: suggestion,
        userId: agent.id,
    });
  };

  if (loading || !agent) {
    return (
        <div className="w-full h-full p-4">
             <Skeleton className="h-full w-full" />
        </div>
    )
  }

  return (
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
  );
}
