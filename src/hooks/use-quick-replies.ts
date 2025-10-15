'use client';

import { useState, useEffect, useMemo } from 'react';

export interface QuickReply {
  id: number;
  content: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 全局缓存
let cachedQuickReplies: QuickReply[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export function useQuickReplies() {
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [loading, setLoading] = useState(true);

  // 使用 useMemo 优化默认快捷回复
  const defaultQuickReplies = useMemo(() => [
    { id: 1, content: "您好！我们能为您做些什么？", sortOrder: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, content: "感谢您的耐心等待。", sortOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, content: "我们目前不在。请留言，我们会尽快回复您。", sortOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, content: "这个问题我需要进一步了解，请提供更多详细信息。", sortOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ], []);

  useEffect(() => {
    // 检查缓存
    const now = Date.now();
    if (cachedQuickReplies && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      setQuickReplies(cachedQuickReplies);
      setLoading(false);
      return;
    }

    const fetchQuickReplies = async () => {
      try {
        const response = await fetch('/api/quick-replies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // 更新缓存
        cachedQuickReplies = data;
        cacheTimestamp = now;
        
        setQuickReplies(data);
      } catch (error) {
        console.error('Failed to fetch quick replies:', error);
        // 使用默认的快捷回复
        setQuickReplies(defaultQuickReplies);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickReplies();
  }, [defaultQuickReplies]);

  return { quickReplies, loading };
}