require('dotenv').config();

async function testAI() {
  console.log('Testing AI functionality...');
  console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('Error: GEMINI_API_KEY is not set');
    return;
  }
  
  // 测试API密钥格式
  if (!process.env.GEMINI_API_KEY.startsWith('AIza')) {
    console.log('Warning: API key format may be incorrect');
  }
  
  try {
    console.log('Testing direct API call...');
    
    // 直接测试API调用
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, this is a test message.'
          }]
        }]
      })
    });
    
    console.log('API Response status:', response.status);
    const data = await response.text();
    console.log('API Response data:', data.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('Direct API call error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testAI().catch(console.error);