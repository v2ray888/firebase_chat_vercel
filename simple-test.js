console.log('Testing network connectivity...');

// 测试基本网络连接
require('https').get('https://www.google.com', (res) => {
  console.log('Google response status:', res.statusCode);
}).on('error', (err) => {
  console.error('Network error:', err.message);
});