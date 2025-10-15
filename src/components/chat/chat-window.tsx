'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Conversation, Message } from '@/types';
import { Send, PanelRightClose, PanelRightOpen, Image as ImageIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
// 添加 Dialog 组件的导入
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'caseId' | 'customerId' >) => void;
  agentAvatar: string;
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
  enableImageUpload?: boolean; // 添加图片上传功能开关
}

// 安全格式化时间的辅助函数
function safeFormatTime(dateString: string) {
  try {
    const date = new Date(dateString);
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '';
    }
    return format(date, 'p', { locale: zhCN });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
}

// 图片上传函数
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('图片上传失败');
  }
  
  const data = await response.json();
  return data.url;
}

export function ChatWindow({ 
  conversation, 
  onSendMessage, 
  agentAvatar, 
  isRightPanelOpen, 
  toggleRightPanel,
  enableImageUpload = true // 默认启用图片上传
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  // 添加用于控制图片查看器模态框的状态
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [conversation.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 发送文本消息
    if (newMessage.trim()) {
      onSendMessage({
        senderType: 'agent',
        content: newMessage,
        userId: 'user-1', // This should come from logged in user session
      });
      setNewMessage('');
    }
    
    // 发送图片消息
    if (imageFile) {
      setIsUploading(true);
      try {
        // 上传图片
        const imageUrl = await uploadImage(imageFile);
        
        // 发送图片消息
        onSendMessage({
          senderType: 'agent',
          content: '图片消息',
          userId: 'user-1',
          imageUrl: imageUrl
        });
        
        // 清除图片状态
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('图片上传失败:', error);
        alert('图片上传失败，请重试');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.match('image.*')) {
        alert('请选择图片文件');
        return;
      }
      
      // 验证文件大小 (最大5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }
      
      setImageFile(file);
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 添加打开图片查看器的函数
  const openImageViewer = (src: string) => {
    setCurrentImageSrc(src);
    setIsImageViewerOpen(true);
  };

  // 添加关闭图片查看器的函数
  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setCurrentImageSrc('');
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
                {message.imageUrl ? (
                  <div className="space-y-2">
                    <p className="text-sm">{message.content}</p>
                    {/* 修改图片显示，添加点击事件 */}
                    <img 
                      src={message.imageUrl} 
                      alt="上传的图片" 
                      className="max-w-full h-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openImageViewer(message.imageUrl!)}
                    />
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                 {message.senderType !== 'system' && message.timestamp && (
                  <p className={cn(
                      'text-xs mt-1',
                      message.senderType === 'agent' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                    {safeFormatTime(message.timestamp)}
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
      {/* 添加图片查看器模态框 */}
      <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>图片预览</DialogTitle>
            <DialogDescription>点击查看原图</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-black/90 h-[calc(90vh-100px)]">
            <img 
              src={currentImageSrc} 
              alt="原图" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
      <div className="border-t p-4 bg-background">
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview} 
              alt="预览" 
              className="max-h-32 max-w-full rounded-md border"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative">
          {enableImageUpload && !isUploading && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 -translate-y-1/2 left-3 h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">上传图片</span>
              </Button>
            </>
          )}
          <Textarea
            placeholder="在此处输入您的消息..."
            className={cn(
              "resize-none",
              enableImageUpload && !isUploading ? "pl-12 pr-20" : "pr-20"
            )}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                }
            }}
            disabled={isUploading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute top-1/2 -translate-y-1/2 right-3" 
            disabled={isUploading || (!newMessage.trim() && !imageFile)}
          >
            {isUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">发送</span>
          </Button>
        </form>
      </div>
    </div>
  );
}