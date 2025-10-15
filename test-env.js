require('dotenv').config();

console.log('Environment variables check:');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);

if (process.env.GEMINI_API_KEY) {
  console.log('API Key starts with:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
}