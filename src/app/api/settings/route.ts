import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    // 获取设置，如果不存在则创建默认设置
    let result = await sql`SELECT * FROM app_settings WHERE id = 1`;
    
    if (result.length === 0) {
      // 创建默认设置
      result = await sql`
        INSERT INTO app_settings (id, primary_color, welcome_message, offline_message, accept_new_chats, widget_title, widget_subtitle, auto_open_widget, show_branding, typing_indicator_message, connection_message, work_start_time, work_end_time, auto_offline, away_message, enable_ai_suggestions, enable_image_upload)
        VALUES (1, '#64B5F6', '您好！我们能为您做些什么？', '我们目前不在。请留言，我们会尽快回复您。', true, '客服支持', '我们通常在几分钟内回复', false, true, '客服正在输入...', '已连接到客服', '09:00', '18:00', false, '我现在不在，但我稍后会回复您。', true, true)
        RETURNING *
      `;
    }
    
    // 确保所有字段都存在，使用默认值填充缺失的字段
    // 由于数据库连接已配置自动转换 snake_case 到 camelCase，直接使用 camelCase 字段名
    const completeSettings = {
      id: result[0].id,
      primaryColor: result[0].primaryColor || '#64B5F6',
      welcomeMessage: result[0].welcomeMessage || '您好！我们能为您做些什么？',
      offlineMessage: result[0].offlineMessage || '我们目前不在。请留言，我们会尽快回复您。',
      acceptNewChats: typeof result[0].acceptNewChats === 'boolean' 
        ? result[0].acceptNewChats 
        : true,
      widgetTitle: result[0].widgetTitle || '客服支持',
      widgetSubtitle: result[0].widgetSubtitle || '我们通常在几分钟内回复',
      autoOpenWidget: typeof result[0].autoOpenWidget === 'boolean'
        ? result[0].autoOpenWidget
        : false,
      showBranding: typeof result[0].showBranding === 'boolean'
        ? result[0].showBranding
        : true,
      typingIndicatorMessage: result[0].typingIndicatorMessage || '客服正在输入...',
      connectionMessage: result[0].connectionMessage || '已连接到客服',
      workStartTime: result[0].workStartTime || '09:00',
      workEndTime: result[0].workEndTime || '18:00',
      autoOffline: typeof result[0].autoOffline === 'boolean'
        ? result[0].autoOffline
        : false,
      awayMessage: result[0].awayMessage || '我现在不在，但我稍后会回复您。',
      enableAiSuggestions: typeof result[0].enableAiSuggestions === 'boolean'
        ? result[0].enableAiSuggestions
        : true,
      enableImageUpload: typeof result[0].enableImageUpload === 'boolean'  // 添加图片上传开关
        ? result[0].enableImageUpload
        : true,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt
    };

    // 设置正确的字符编码
    const response = NextResponse.json(completeSettings);
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
    return response;
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 准备更新数据，只包含提供的字段
    const updateData: any = {};
    
    // 映射请求字段到数据库字段（camelCase 到 snake_case）
    const fieldMap: Record<string, string> = {
      'primaryColor': 'primary_color',
      'welcomeMessage': 'welcome_message',
      'offlineMessage': 'offline_message',
      'acceptNewChats': 'accept_new_chats',
      'widgetTitle': 'widget_title',
      'widgetSubtitle': 'widget_subtitle',
      'autoOpenWidget': 'auto_open_widget',
      'showBranding': 'show_branding',
      'typingIndicatorMessage': 'typing_indicator_message',
      'connectionMessage': 'connection_message',
      'workStartTime': 'work_start_time',
      'workEndTime': 'work_end_time',
      'autoOffline': 'auto_offline',
      'awayMessage': 'away_message',
      'enableAiSuggestions': 'enable_ai_suggestions',
      'enableImageUpload': 'enable_image_upload'  // 添加图片上传开关
    };
    
    // 只处理存在于fieldMap中的字段
    for (const [key, value] of Object.entries(data)) {
      if (fieldMap[key]) {
        updateData[fieldMap[key]] = value;
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: '没有提供有效的设置字段' }, { status: 400 });
    }
    
    // 更新设置
    const result = await sql`
      UPDATE app_settings 
      SET ${sql(updateData)}, updated_at = NOW()
      WHERE id = 1
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ message: '未找到设置记录' }, { status: 404 });
    }
    
    // 重新验证相关路径
    revalidatePath('/dashboard/settings');
    revalidatePath('/api/settings');
    
    // 返回更新后的设置
    const updatedSettings = {
      id: result[0].id,
      primaryColor: result[0].primaryColor || '#64B5F6',
      welcomeMessage: result[0].welcomeMessage || '您好！我们能为您做些什么？',
      offlineMessage: result[0].offlineMessage || '我们目前不在。请留言，我们会尽快回复您。',
      acceptNewChats: typeof result[0].acceptNewChats === 'boolean' 
        ? result[0].acceptNewChats 
        : true,
      widgetTitle: result[0].widgetTitle || '客服支持',
      widgetSubtitle: result[0].widgetSubtitle || '我们通常在几分钟内回复',
      autoOpenWidget: typeof result[0].autoOpenWidget === 'boolean'
        ? result[0].autoOpenWidget
        : false,
      showBranding: typeof result[0].showBranding === 'boolean'
        ? result[0].showBranding
        : true,
      typingIndicatorMessage: result[0].typingIndicatorMessage || '客服正在输入...',
      connectionMessage: result[0].connectionMessage || '已连接到客服',
      workStartTime: result[0].workStartTime || '09:00',
      workEndTime: result[0].workEndTime || '18:00',
      autoOffline: typeof result[0].autoOffline === 'boolean'
        ? result[0].autoOffline
        : false,
      awayMessage: result[0].awayMessage || '我现在不在，但我稍后会回复您。',
      enableAiSuggestions: typeof result[0].enableAiSuggestions === 'boolean'
        ? result[0].enableAiSuggestions
        : true,
      enableImageUpload: typeof result[0].enableImageUpload === 'boolean'  // 添加图片上传开关
        ? result[0].enableImageUpload
        : true,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt
    };

    // 设置正确的字符编码
    const response = NextResponse.json(updatedSettings);
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
    return response;
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
