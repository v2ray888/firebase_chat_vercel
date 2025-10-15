import { NextResponse } from 'next/server';

// 将Buffer转换为base64的函数
function bufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// 处理图片上传，返回base64格式的图片数据
export async function POST(request: Request) {
  try {
    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: '没有提供文件' }, { status: 400 });
    }
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '只支持图片文件' }, { status: 400 });
    }
    
    // 验证文件大小 (5MB限制)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过5MB' }, { status: 400 });
    }
    
    // 将文件转换为base64
    const arrayBuffer = await file.arrayBuffer();
    const base64String = bufferToBase64(arrayBuffer);
    const imageDataUrl = `data:${file.type};base64,${base64String}`;
    
    return NextResponse.json({ 
      url: imageDataUrl,
      message: '图片上传成功'
    });
  } catch (error) {
    console.error('图片上传失败:', error);
    return NextResponse.json({ error: '图片上传失败' }, { status: 500 });
  }
}