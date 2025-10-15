import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Received test image message:', data);
    
    // 模拟保存到数据库
    const savedMessage = {
      id: `msg-${Date.now()}`,
      caseId: data.caseId || 'test-case-id',
      senderType: data.senderType || 'agent',
      content: data.content || '',
      imageUrl: data.imageUrl || null,
      timestamp: new Date().toISOString(),
      userId: data.userId || null,
      customerId: data.customerId || null
    };
    
    console.log('Saved message:', savedMessage);
    
    return NextResponse.json(savedMessage, { status: 201 });
  } catch (error: any) {
    console.error('Failed to process test message:', error);
    return NextResponse.json({ message: '内部服务器错误', error: error.message }, { status: 500 });
  }
}