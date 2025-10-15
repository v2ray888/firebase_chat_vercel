'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
// 添加 Avatar 组件的导入
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WidgetPreviewProps {
  primaryColor: string;
  welcomeMessage: string;
  widgetTitle?: string;
  widgetSubtitle?: string;
  autoOpen?: boolean;
  showBranding?: boolean;
  enableImageUpload?: boolean;
}

// 定义消息类型
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  imageUrl?: string; // 添加图片URL属性
}

export function WidgetPreview({ 
  primaryColor, 
  welcomeMessage,
  widgetTitle = "客服支持",
  widgetSubtitle = "我们通常在几分钟内回复",
  autoOpen = false,
  showBranding = true,
  enableImageUpload = true
}: WidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: welcomeMessage || "您好！我们能为您做些什么？",
      sender: 'agent',
      timestamp: new Date(),
    }
  ]);
  // 添加文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 添加处理图片上传的函数
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 添加处理文件选择的函数
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 创建预览消息
      const previewMessage: Message = {
        id: Date.now().toString(),
        content: "图片消息",
        sender: 'user',
        timestamp: new Date(),
      };
      
      // 添加预览消息到消息列表
      setMessages(prev => [...prev, previewMessage]);
      
      try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append('file', file);
        
        // 上传图片
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (result.url) {
          // 更新消息以显示上传的图片
          setMessages(prev => prev.map(msg => 
            msg.id === previewMessage.id 
              ? { ...msg, content: "图片消息", imageUrl: result.url } 
              : msg
          ));
          
          // 模拟客服回复
          setTimeout(() => {
            const agentMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: "感谢您的图片！这是我们模拟的回复。",
              sender: 'agent',
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, agentMessage]);
          }, 1000);
        }
      } catch (error) {
        console.error('图片上传失败:', error);
        // 如果上传失败，更新消息内容
        setMessages(prev => prev.map(msg => 
          msg.id === previewMessage.id 
            ? { ...msg, content: "图片上传失败" } 
            : msg
        ));
      }
    }
    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 发送消息的函数
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      // 添加用户消息
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // 模拟客服回复
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "感谢您的消息！这是我们模拟的回复。",
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentMessage]);
      }, 1000);
    }
  };

  return (
    <div className="relative h-96 w-full rounded-lg bg-muted/30 flex items-center justify-center p-4">
        <div className="absolute bottom-4 right-4">
            {!isOpen && (
                <Button 
                    className="rounded-full h-16 w-16 shadow-lg" 
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-8 w-8 text-primary-foreground" />
                </Button>
            )}
            {isOpen && (
                <Card className="w-80 h-96 flex flex-col shadow-2xl rounded-xl" style={{ borderColor: primaryColor }}>
                    <div className="p-4 rounded-t-xl text-primary-foreground" style={{ backgroundColor: primaryColor }}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{widgetTitle}</h3>
                                <p className="text-xs">{widgetSubtitle}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                    <CardContent className="flex-1 p-4 space-y-3 overflow-y-auto">
                      {messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex items-start gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender === 'agent' && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://picsum.photos/seed/widget-support/40/40" />
                              <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                          )}
                          <div 
                            className={`p-2 rounded-lg text-sm max-w-[70%] ${
                              message.sender === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            {message.imageUrl ? (
                              <div>
                                <p>{message.content}</p>
                                <img 
                                  src={message.imageUrl} 
                                  alt="上传的图片" 
                                  className="mt-2 max-w-full h-auto rounded-md"
                                />
                              </div>
                            ) : (
                              message.content
                            )}
                          </div>
                          {message.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://picsum.photos/seed/widget-customer/40/40" />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </CardContent>
                    <div className="p-2 border-t">
                      {/* 添加隐藏的文件输入元素 */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                      <form onSubmit={handleSendMessage} className="relative flex items-center">
                        {enableImageUpload && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 mr-1"
                            onClick={handleImageUpload}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <input 
                          className="flex-1 border rounded-md p-2 text-sm" 
                          placeholder="输入消息..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button 
                          type="submit" 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 absolute right-1"
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                      {showBranding && (
                        <div className="text-center text-xs text-muted-foreground mt-1">
                          由 霓虹 提供支持
                        </div>
                      )}
                    </div>
                </Card>
            )}
        </div>
    </div>
  );
}