'use client';

import { useEffect, useState } from 'react';

export default function TestDbPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch conversations
        const convResponse = await fetch('/api/conversations');
        const convData = await convResponse.json();
        setConversations(convData);

        // Fetch settings
        const settingsResponse = await fetch('/api/settings');
        const settingsData = await settingsResponse.json();
        setSettings(settingsData);
      } catch (err) {
        setError('Failed to fetch data: ' + (err as Error).message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">数据库交互测试</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">应用设置</h2>
        {settings && (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>欢迎消息:</strong> {settings.welcomeMessage}</p>
            <p><strong>离线消息:</strong> {settings.offlineMessage}</p>
            <p><strong>接受新聊天:</strong> {settings.acceptNewChats ? '是' : '否'}</p>
            <p><strong>主色调:</strong> {settings.primaryColor}</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">对话列表</h2>
        {conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div key={conv.id} className="border rounded p-4">
                <h3 className="font-bold">{conv.customer.name}</h3>
                <p className="text-sm text-gray-600">{conv.customer.email}</p>
                <p className="mt-2"><strong>状态:</strong> {conv.case.status}</p>
                <p><strong>摘要:</strong> {conv.case.summary}</p>
                <p><strong>消息数量:</strong> {conv.messages.length}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>没有找到对话。</p>
        )}
      </section>
    </div>
  );
}