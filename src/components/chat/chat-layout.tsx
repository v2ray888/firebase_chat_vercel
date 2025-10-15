'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import type { Conversation, Message, User } from '@/types';
import { ConversationList } from './conversation-list';
import { ChatWindow } from './chat-window';
import { Card } from '../ui/card';
import { CaseDetails } from './case-details';
import { AiSuggestions } from './ai-suggestions';
import { useEffect, useState } from 'react';

interface ChatLayoutProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  agent: User;
  isRightPanelOpen: boolean;
  onSelectConversation: (conversationId: string) => void;
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'caseId'>) => void;
  onUpdateStatus: (status: 'open' | 'in-progress' | 'resolved') => void;
  onSuggestionClick: (suggestion: string) => void;
  toggleRightPanel: () => void;
}

export function ChatLayout({
  conversations,
  selectedConversation,
  agent,
  isRightPanelOpen,
  onSelectConversation,
  onSendMessage,
  onUpdateStatus,
  onSuggestionClick,
  toggleRightPanel,
}: ChatLayoutProps) {
  const [enableImageUpload, setEnableImageUpload] = useState(true);
  
  // 获取设置以确定是否启用图片上传功能
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          setEnableImageUpload(settings.enableImageUpload ?? true);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // 默认启用图片上传功能
        setEnableImageUpload(true);
      }
    };
    
    fetchSettings();
  }, []);
  
  const lastCustomerMessage = selectedConversation?.messages.filter(m => m.senderType === 'user').slice(-1)[0];

  const handleSelect = (conversation: Conversation) => {
    onSelectConversation(conversation.id);
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full items-stretch bg-background">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
        <div className="h-full p-4">
            <Card className="h-full">
            <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelect}
            />
            </Card>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full p-4 pl-0">
          <div className="flex-1">
            {selectedConversation ? (
              <Card className="flex h-full flex-col">
                <ChatWindow
                  conversation={selectedConversation}
                  onSendMessage={onSendMessage}
                  agentAvatar={agent.avatar}
                  isRightPanelOpen={isRightPanelOpen}
                  toggleRightPanel={toggleRightPanel}
                  enableImageUpload={enableImageUpload}
                />
              </Card>
            ) : (
              <Card className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">选择一个对话开始聊天</p>
              </Card>
            )}
          </div>
          <div
            className={cn(
              'transition-all duration-300 ease-in-out h-full',
              isRightPanelOpen ? 'w-80 ml-4' : 'w-0',
              'overflow-hidden'
            )}
          >
            {selectedConversation && (
              <Card className="flex h-full flex-col">
                <div className="flex-shrink-0">
                  <CaseDetails
                    conversation={selectedConversation}
                    onUpdateStatus={onUpdateStatus}
                  />
                </div>
                <div className="flex-grow overflow-y-auto">
                  <AiSuggestions
                    customerQuery={lastCustomerMessage?.content || ''}
                    chatHistory={selectedConversation.messages
                      .map(m => `${m.senderType}: ${m.content}`)
                      .join('\n')}
                    onSuggestionClick={onSuggestionClick}
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}