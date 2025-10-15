'use client';

import { useState } from 'react';

export default function TestImageUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    
    if (!file) {
      alert('请选择一个图片文件');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('上传失败');
      }
      
      const data = await response.json();
      setUploadedImageUrl(data.url);
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">图片上传测试</h1>
      
      <div className="mb-6">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          className="mb-4"
        />
        
        {imagePreview && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">图片预览:</h2>
            <img 
              src={imagePreview} 
              alt="预览" 
              className="max-w-xs max-h-64 border rounded"
            />
          </div>
        )}
        
        <button 
          onClick={handleUpload}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isUploading ? '上传中...' : '上传图片'}
        </button>
      </div>
      
      {uploadedImageUrl && (
        <div>
          <h2 className="text-lg font-semibold mb-2">上传结果:</h2>
          <img 
            src={uploadedImageUrl} 
            alt="上传的图片" 
            className="max-w-xs max-h-64 border rounded"
          />
          <p className="mt-2">图片URL长度: {uploadedImageUrl.length} 字符</p>
          <p className="text-sm text-gray-500">URL前缀: {uploadedImageUrl.substring(0, 50)}...</p>
        </div>
      )}
    </div>
  );
}
