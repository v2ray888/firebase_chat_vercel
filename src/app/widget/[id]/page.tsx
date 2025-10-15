// 客户端组件
'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as Dialog from '@radix-ui/react-dialog';

function WidgetClient({ website, settings, widgetId }: { 
  website: any; 
  settings: any; 
  widgetId: string;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // 添加用于控制图片查看器模态框的状态
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 通知父窗口 widget 已准备就绪
  useEffect(() => {
    window.parent.postMessage({ type: 'NEONSUPPORT_WIDGET_READY' }, '*');
  }, []);
  
  const handleStartChat = () => {
    setIsChatOpen(true);
    // 添加欢迎消息
    setMessages([{
      id: 'welcome',
      content: settings.welcome_message,
      sender: 'system',
      timestamp: new Date().toISOString()
    }]);
  };
  
  // 模拟图片上传函数
  const uploadImage = async (file: File): Promise<string> => {
    // 在实际应用中，这里应该上传图片到服务器并返回URL
    // 为了演示，我们返回一个模拟的URL
    return new Promise((resolve) => {
      setTimeout(() => {
        // 使用一个测试图片URL
        resolve(`https://picsum.photos/seed/${Date.now()}/400/300`);
      }, 1000);
    });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !selectedImage) {
      return;
    }
    
    try {
      let imageUrl: string | null = null;
      
      // 如果有选择的图片，先上传
      if (selectedImage) {
        // 检查是否启用了图片上传功能
        if (!settings?.enable_image_upload) {
          alert('图片上传功能已被管理员禁用');
          return;
        }
        
        // 上传图片
        imageUrl = await uploadImage(selectedImage);
      }
      
      const messageData = {
        id: `user-${Date.now()}`,
        content: newMessage,
        sender: 'user',
        timestamp: new Date().toISOString(),
        imageUrl: imageUrl || null
      };
      
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      setImagePreview(null);
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // 这里应该发送消息到服务器
      // 暂时只在客户端模拟回复
      setTimeout(() => {
        const reply = {
          id: `agent-${Date.now()}`,
          content: '感谢您的消息！我们的客服将尽快回复您。',
          sender: 'agent',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, reply]);
      }, 1000);
    } catch (error) {
      console.error('发送消息失败:', error);
      // 在实际应用中，这里应该显示错误提示
    }
  };
  
  // 处理图片选择
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 检查是否启用了图片上传功能
    if (!settings?.enable_image_upload) {
      alert('图片上传功能已被管理员禁用');
      return;
    }
    
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      
      // 检查文件大小 (限制为5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 移除图片预览
  const removeImagePreview = () => {
    setImagePreview(null);
    setSelectedImage(null);
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
  
  if (!isChatOpen) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div 
          className="rounded-full w-16 h-16 flex items-center justify-center cursor-pointer shadow-lg"
          style={{ backgroundColor: settings.primary_color }}
          onClick={handleStartChat}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* 头部 */}
      <div 
        className="p-4 text-white rounded-t-lg flex justify-between items-center"
        style={{ backgroundColor: settings.primary_color }}
      >
        <div>
          <h3 className="font-bold">客服支持</h3>
          <p className="text-xs opacity-90">在线</p>
        </div>
        <button 
          onClick={() => setIsChatOpen(false)}
          className="text-white hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* 用户消息头像在左侧 */}
            {message.sender === 'user' && (
              <div className="mr-2 mt-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src="https://picsum.photos/seed/customer-preview/40/40" 
                    alt="客户头像" 
                  />
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    客
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            
            <div 
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : message.sender === 'system'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {/* 检查是否是图片消息 */}
              {message.imageUrl ? (
                <div className="flex flex-col">
                  <img 
                    src={message.imageUrl} 
                    alt="发送的图片" 
                    className="max-w-full h-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openImageViewer(message.imageUrl)}
                  />
                  {message.content && message.content !== '[图片]' && (
                    <p className="text-sm mt-2">{message.content}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            {/* 客服消息头像在右侧 */}
            {message.sender === 'agent' && (
              <div className="ml-2 mt-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src="https://picsum.photos/seed/agent-preview/40/40" 
                    alt="客服头像" 
                  />
                  <AvatarFallback className="bg-purple-500 text-white text-xs">
                    服
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 输入区域 */}
      <div className="border-t p-3">
        {/* 图片预览 */}
        {imagePreview && (
          <div className="mb-2 relative inline-block">
            <img 
              src={imagePreview} 
              alt="预览" 
              className="max-h-32 max-w-full rounded-md"
            />
            <button
              type="button"
              className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white rounded-full"
              onClick={removeImagePreview}
            >
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex space-x-1">
            {/* 只有在启用图片上传功能时才显示图片上传按钮 */}
            {settings?.enable_image_upload && (
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            )}
            {settings?.enable_image_upload && (
              <button
                type="button"
                className="bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              disabled={!newMessage.trim() && !selectedImage}
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
      
      {/* 添加图片查看器模态框 */}
      <Dialog.Root open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-4xl max-h-[90vh] p-0">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">图片预览</h3>
              <p className="text-sm text-muted-foreground">点击查看原图</p>
            </div>
            <div className="flex items-center justify-center p-4 bg-black/90 h-[calc(90vh-100px)]">
              <img 
                src={currentImageSrc} 
                alt="原图" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <Dialog.Close className="absolute top-4 right-4 text-white hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// 服务器组件
export default async function WidgetPage({ params }: { params: { id: string } }) {
  // 获取应用设置
  const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/settings`, {
    next: { revalidate: 60 } // 60秒重新验证缓存
  });
  
  if (!settingsResponse.ok) {
    console.error('Failed to fetch settings:', settingsResponse.status, settingsResponse.statusText);
    // 返回默认设置
    const defaultSettings = {
      primary_color: '#64B5F6',
      welcome_message: '您好！我们能为您做些什么？',
      enable_image_upload: true
    };
    
    return <WidgetClient website={null} settings={defaultSettings} widgetId={params.id} />;
  }
  
  const settings = await settingsResponse.json();
  
  // 返回客户端组件
  return <WidgetClient website={null} settings={settings} widgetId={params.id} />;
}