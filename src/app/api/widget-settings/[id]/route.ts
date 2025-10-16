import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // 验证网站ID
    const website = await sql`SELECT * FROM websites WHERE id = ${params.id}`;
    
    if (website.length === 0) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }
    
    // 获取应用设置
    const settingsResult = await sql`SELECT * FROM app_settings WHERE id = 1`;
    
    if (settingsResult.length === 0) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }
    
    const settings = settingsResult[0];
    
    // 返回格式化的设置
    const formattedSettings = {
      primaryColor: settings.primary_color || '#64B5F6',
      welcomeMessage: settings.welcome_message || '您好！我们能为您做些什么？',
      widgetTitle: settings.widget_title || '客服支持',
      widgetSubtitle: settings.widget_subtitle || '我们通常在几分钟内回复',
      showBranding: settings.show_branding !== false,
      autoOpenWidget: settings.auto_open_widget === true,
      enableImageUpload: settings.enable_image_upload !== false,
      typingIndicatorMessage: settings.typing_indicator_message || '客服正在输入...',
      connectionMessage: settings.connection_message || '已连接到客服',
      workStartTime: settings.work_start_time || '09:00',
      workEndTime: settings.work_end_time || '18:00',
      awayMessage: settings.away_message || '我现在不在，但我稍后会回复您。'
    };
    
    return NextResponse.json(formattedSettings);
  } catch (error) {
    console.error('Error fetching widget settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}