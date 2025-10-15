(function() {
  // 获取 widget 容器元素
  const container = document.getElementById('neonsupport-widget-container');
  if (!container) {
    console.error('NeonSupport widget container not found');
    return;
  }

  // 获取 widget ID
  const scriptTag = document.currentScript;
  const widgetId = scriptTag ? scriptTag.getAttribute('data-widget-id') : null;
  if (!widgetId) {
    console.error('Widget ID not provided');
    return;
  }

  // 获取脚本标签上的data-base-url属性，如果没有则使用当前脚本的源
  const baseUrl = scriptTag ? scriptTag.getAttribute('data-base-url') : null;
  const widgetSrc = baseUrl 
    ? `${baseUrl}/widget/${widgetId}`
    : `${window.location.protocol}//${window.location.host}/widget/${widgetId}`;

  // 创建 iframe 来承载聊天小部件
  const iframe = document.createElement('iframe');
  iframe.src = widgetSrc;
  iframe.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 9999;
  `;

  // 添加最小化/最大化功能
  let isMinimized = false;
  
  // 创建最小化按钮
  const toggleButton = document.createElement('button');
  toggleButton.innerHTML = '×';
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: #64B5F6;
    color: white;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
  `;

  toggleButton.addEventListener('click', () => {
    isMinimized = !isMinimized;
    iframe.style.display = isMinimized ? 'none' : 'block';
    toggleButton.innerHTML = isMinimized ? '+' : '×';
    toggleButton.style.background = isMinimized ? '#4CAF50' : '#64B5F6';
  });

  // 将元素添加到页面
  document.body.appendChild(iframe);
  document.body.appendChild(toggleButton);

  // 处理跨域通信
  window.addEventListener('message', (event) => {
    // 验证消息来源（在实际应用中应该验证来源）
    if (event.data.type === 'NEONSUPPORT_WIDGET_READY') {
      console.log('NeonSupport widget is ready');
    }
  });

  // 页面加载完成后显示 widget
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      iframe.style.display = 'block';
    });
  } else {
    iframe.style.display = 'block';
  }
})();