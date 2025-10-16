'use client';

import { useEffect } from 'react';

export default function WidgetTestPage() {
  useEffect(() => {
    // 创建一个容器元素
    const container = document.createElement('div');
    container.id = 'neonsupport-widget-container';
    document.body.appendChild(container);

    // 动态加载 widget.js 脚本
    const script = document.createElement('script');
    script.src = '/widget.js';
    script.setAttribute('data-widget-id', '57f13bb3-7819-45db-9961-bce85b83f3d2');
    script.defer = true;
    document.body.appendChild(script);

    // 清理函数
    return () => {
      document.body.removeChild(container);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">小部件测试页面</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">说明</h2>
          <p className="text-gray-600 mb-4">
            这是一个用于测试简化版小部件的页面。小部件应该会出现在页面的右下角。
          </p>
          <p className="text-gray-600">
            如果小部件没有显示，请检查浏览器控制台是否有错误信息。
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">测试内容</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>小部件是否正确显示在右下角</li>
            <li>能否正常打开和关闭聊天窗口</li>
            <li>能否发送消息并收到回复</li>
            <li>界面样式是否符合预期</li>
          </ul>
        </div>
      </div>
    </div>
  );
}