'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestWidgetImage() {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  const loadWidget = () => {
    // 创建一个测试网站ID
    const testWebsiteId = 'test-website-id';
    
    // 动态创建iframe来加载小部件
    const iframe = document.createElement('iframe');
    iframe.src = `/widget/${testWebsiteId}`;
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '320px';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '10000';
    
    document.body.appendChild(iframe);
    setIsWidgetLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">测试客户端图片发送功能</h1>
        
        <div className="space-y-4">
          <p>这个页面用于测试客户端（小部件）发送图片的功能。</p>
          
          {!isWidgetLoaded ? (
            <Button onClick={loadWidget}>加载聊天小部件</Button>
          ) : (
            <p className="text-green-600">聊天小部件已加载，请在页面右下角查看。</p>
          )}
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">测试说明</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>点击"加载聊天小部件"按钮在页面右下角显示聊天窗口</li>
              <li>点击聊天图标打开对话窗口</li>
              <li>在输入框旁边有一个回形针图标，点击可以选择图片</li>
              <li>选择图片后会显示预览</li>
              <li>可以同时发送图片和文字消息</li>
              <li>图片消息会在聊天界面中显示为图像</li>
            </ul>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">功能特点</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>支持常见的图片格式（JPG, PNG, GIF, WebP等）</li>
              <li>图片大小限制为5MB</li>
              <li>可以预览选择的图片</li>
              <li>支持删除已选择的图片</li>
              <li>图片和文本可以同时发送</li>
              <li>图片消息在聊天界面中以图像形式显示</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}