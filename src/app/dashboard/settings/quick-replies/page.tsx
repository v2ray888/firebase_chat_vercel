'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettingsContext } from '@/contexts/settings-context';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsQuickRepliesPage() {
  const { quickReplies, loading, saving, updateQuickReplies, handleSaveChanges, hasChanges } = useSettingsContext();
  const [localReplies, setLocalReplies] = useState(quickReplies);

  // 当 quickReplies 更新时，更新本地状态
  useEffect(() => {
    setLocalReplies(quickReplies);
  }, [quickReplies]);

  const handleAddReply = () => {
    const newReply = {
      id: Date.now(), // 临时 ID
      content: '',
      sortOrder: localReplies.length,  // 改为 camelCase
      createdAt: new Date().toISOString(),  // 改为 camelCase
      updatedAt: new Date().toISOString(),  // 改为 camelCase
    };
    const updatedReplies = [...localReplies, newReply];
    setLocalReplies(updatedReplies);
    // 同时更新上下文状态以确保 hasChanges 正确计算
    updateQuickReplies(updatedReplies);
  };

  const handleRemoveReply = (index: number) => {
    const newReplies = [...localReplies];
    newReplies.splice(index, 1);
    // 更新排序
    const updatedReplies = newReplies.map((reply, i) => ({
      ...reply,
      sortOrder: i  // 改为 camelCase
    }));
    setLocalReplies(updatedReplies);
    // 同时更新上下文状态以确保 hasChanges 正确计算
    updateQuickReplies(updatedReplies);
  };

  const handleContentChange = (index: number, content: string) => {
    const newReplies = [...localReplies];
    newReplies[index] = {
      ...newReplies[index],
      content,
      updatedAt: new Date().toISOString()  // 改为 camelCase
    };
    setLocalReplies(newReplies);
    // 同时更新上下文状态以确保 hasChanges 正确计算
    updateQuickReplies(newReplies);
  };

  const handleSave = async () => {
    // updateQuickReplies(localReplies); // 这行现在不需要了，因为已经在每次更改时更新了
    await handleSaveChanges();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">快捷回复设置</h2>
        <p className="text-muted-foreground">
          设置常用的回复模板，提高客服效率
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>快捷回复模板</CardTitle>
          <CardDescription>
            创建和管理常用的回复模板
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {localReplies.map((reply, index) => (
              <div key={reply.id} className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`quick-reply-${index}`}>快捷回复 {index + 1}</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`quick-reply-${index}`}
                      value={reply.content}
                      onChange={(e) => handleContentChange(index, e.target.value)}
                      placeholder="输入快捷回复内容..."
                      disabled={saving}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveReply(index)}
                      disabled={saving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddReply}
              disabled={saving}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加快捷回复
            </Button>
            
            {hasChanges && (
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '保存中...' : '保存更改'}
              </Button>
            )}
          </div>
          
          {localReplies.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>暂无快捷回复</p>
              <p className="text-sm mt-2">点击"添加快捷回复"按钮创建第一个快捷回复模板</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}