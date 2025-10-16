// 服务器组件
import WidgetClient from './widget-client';
import { sql } from '@/lib/db';

// 服务器组件
export default async function WidgetPage({ params }: { params: { id: string } }) {
  try {
    // 首先验证widget ID是否存在
    const website = await sql`SELECT * FROM websites WHERE id = ${params.id}`;
    
    if (website.length === 0) {
      console.error('Widget ID not found:', params.id);
      // 返回默认设置
      const defaultSettings = {
        primaryColor: '#64B5F6',
        welcomeMessage: '您好！我们能为您做些什么？',
        widgetTitle: '客服支持',
        widgetSubtitle: '我们通常在几分钟内回复',
        enableImageUpload: true
      };
      
      return <WidgetClient settings={defaultSettings} />;
    }
    
    // 获取应用设置
    const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/settings`, {
      next: { revalidate: 60 } // 60秒重新验证缓存
    });
    
    let settings;
    if (!settingsResponse.ok) {
      console.error('Failed to fetch settings:', settingsResponse.status, settingsResponse.statusText);
      // 返回默认设置
      settings = {
        primaryColor: '#64B5F6',
        welcomeMessage: '您好！我们能为您做些什么？',
        widgetTitle: '客服支持',
        widgetSubtitle: '我们通常在几分钟内回复',
        enableImageUpload: true
      };
    } else {
      settings = await settingsResponse.json();
    }
    
    // 返回客户端组件
    return <WidgetClient settings={settings} />;
  } catch (error) {
    console.error('Error in WidgetPage:', error);
    // 返回默认设置
    const defaultSettings = {
      primaryColor: '#64B5F6',
      welcomeMessage: '您好！我们能为您做些什么？',
      widgetTitle: '客服支持',
      widgetSubtitle: '我们通常在几分钟内回复',
      enableImageUpload: true
    };
    
    return <WidgetClient settings={defaultSettings} />;
  }
}