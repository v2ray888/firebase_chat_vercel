(function() {
  // 获取 widget 容器元素
  const container = document.getElementById('neonsupport-widget-container');
  if (!container) {
    console.error('NeonSupport widget container not found');
    return;
  }

  // 获取 widget ID 和基础URL
  const scriptTag = document.currentScript;
  const widgetId = scriptTag ? scriptTag.getAttribute('data-widget-id') : null;
  const baseUrl = scriptTag ? scriptTag.getAttribute('data-base-url') : null;
  
  if (!widgetId) {
    console.error('Widget ID not provided. Please provide a valid UUID in the data-widget-id attribute.');
    console.log('Example valid widget IDs from database:');
    console.log('- 57f13bb3-7819-45db-9961-bce85b83f3d2');
    console.log('- 6f0937e0-3be2-4600-a711-8ac712c0e4da');
    console.log('- 4a1f426e-3643-43eb-8d2f-96c5515ac743');
    return;
  }

  // 默认设置
  const defaultSettings = {
    primaryColor: '#64B5F6',
    welcomeMessage: '您好！我们能为您做些什么？',
    widgetTitle: '客服支持',
    widgetSubtitle: '我们通常在几分钟内回复',
    showBranding: true,
    autoOpenWidget: false,
    enableImageUpload: true,
    typingIndicatorMessage: '客服正在输入...',
    connectionMessage: '已连接到客服',
    workStartTime: '09:00',
    workEndTime: '18:00',
    awayMessage: '我现在不在，但我稍后会回复您。'
  };

  // 状态变量
  let isOpen = false;
  let settings = defaultSettings;
  let messages = [
    {
      id: '1',
      content: settings.welcomeMessage,
      sender: 'agent',
      timestamp: new Date(),
    }
  ];
  // 客户信息（使用默认值）
  let customerInfo = {
    name: '访客',
    email: 'visitor@example.com'
  };
  // 对话ID
  let caseId = null;

  // 滚动到底部函数
  function scrollToBottom() {
    const messageArea = widgetContainer.querySelector('div[style*="overflow-y: auto"]');
    if (messageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }

  // 打开图片查看器
  function openImageViewer(src) {
    // 创建模态框覆盖层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    // 创建模态框内容
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    `;
    
    // 创建图片
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
    `;
    
    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 32px;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // 添加关闭事件
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    
    // 点击覆盖层关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
    
    // 按ESC键关闭
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 组装模态框
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // 渲染消息函数移到外层作用域
  function renderMessages() {
    // 只有在窗口打开时才渲染消息
    if (!isOpen) return;
    
    const messageArea = widgetContainer.querySelector('div[style*="overflow-y: auto"]');
    if (!messageArea) return;
    
    messageArea.innerHTML = '';
    messages.forEach(message => {
      const messageContainer = document.createElement('div');
      messageContainer.style.cssText = `
        display: flex;
        align-items: flex-start;
        gap: 8px;
        ${message.sender === 'user' ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
      `;
      
      if (message.sender === 'agent') {
        // 客服头像 - 使用与设置页面相同的URL
        const avatar = document.createElement('div');
        avatar.style.cssText = `
          height: 32px;
          width: 32px;
          border-radius: 50%;
          overflow: hidden;
        `;
        
        const avatarImg = document.createElement('img');
        avatarImg.src = `https://picsum.photos/seed/widget-support/40/40`;
        avatarImg.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
        `;
        
        avatar.appendChild(avatarImg);
        messageContainer.appendChild(avatar);
      }
      
      // 消息气泡
      const bubble = document.createElement('div');
      bubble.style.cssText = `
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 14px;
        max-width: 70%;
        ${message.sender === 'user' 
          ? `background-color: ${settings.primaryColor}; color: white;` 
          : 'background-color: #f1f1f1; color: #333;'}
      `;
      
      // 检查是否是图片消息
      if (message.imageUrl) {
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
          display: flex;
          flex-direction: column;
        `;
        
        const image = document.createElement('img');
        image.src = message.imageUrl;
        image.alt = '发送的图片';
        image.style.cssText = `
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          cursor: pointer;
        `;
        
        // 添加点击事件打开图片查看器
        image.addEventListener('click', () => {
          openImageViewer(message.imageUrl);
        });
        
        imageContainer.appendChild(image);
        
        // 如果有文本内容，也显示文本
        if (message.content && message.content !== '[图片]') {
          const text = document.createElement('p');
          text.style.cssText = `
            margin-top: 8px;
            margin-bottom: 0;
          `;
          text.textContent = message.content;
          imageContainer.appendChild(text);
        }
        
        bubble.appendChild(imageContainer);
      } else {
        bubble.textContent = message.content;
      }
      
      messageContainer.appendChild(bubble);
      
      if (message.sender === 'user') {
        // 用户头像 - 使用与设置页面相同的URL
        const avatar = document.createElement('div');
        avatar.style.cssText = `
          height: 32px;
          width: 32px;
          border-radius: 50%;
          overflow: hidden;
        `;
        
        const avatarImg = document.createElement('img');
        avatarImg.src = `https://picsum.photos/seed/widget-customer/40/40`;
        avatarImg.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
        `;
        
        avatar.appendChild(avatarImg);
        messageContainer.appendChild(avatar);
      }
      
      messageArea.appendChild(messageContainer);
    });
  }

  // 获取设置
  async function fetchSettings() {
    try {
      // 首先尝试从localStorage获取设置
      const storedSettings = localStorage.getItem('widgetSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        settings = { ...defaultSettings, ...parsedSettings };
        messages[0].content = settings.welcomeMessage;
        if (settings.autoOpenWidget) {
          isOpen = true;
        }
        renderWidget();
        return;
      }
      
      // 如果localStorage中没有设置，则尝试从API获取
      const response = await fetch(`/api/widget-settings/${widgetId}`);
      if (response.ok) {
        const fetchedSettings = await response.json();
        settings = { ...defaultSettings, ...fetchedSettings };
        messages[0].content = settings.welcomeMessage;
        if (settings.autoOpenWidget) {
          isOpen = true;
        }
        renderWidget();
      } else {
        console.warn('Failed to fetch settings, using defaults');
        renderWidget();
      }
    } catch (error) {
      console.warn('Error fetching settings, using defaults:', error);
      renderWidget();
    }
  }

  // 创建主容器
  const widgetContainer = document.createElement('div');
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  `;

  // 创建关闭状态下的按钮
  function createClosedWidget() {
    const button = document.createElement('button');
    button.style.cssText = `
      border: none;
      border-radius: 50%;
      height: 64px;
      width: 64px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      background-color: ${settings.primaryColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // 创建聊天图标
    const icon = document.createElement('div');
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
      </svg>
    `;
    
    button.appendChild(icon);
    button.addEventListener('click', () => {
      isOpen = true;
      renderWidget();
    });
    
    return button;
  }

  // 创建打开状态下的聊天窗口
  function createOpenWidget() {
    const card = document.createElement('div');
    card.style.cssText = `
      width: 320px;
      height: 384px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-radius: 0.75rem;
      background: white;
      border: 1px solid ${settings.primaryColor};
    `;

    // 头部
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 16px;
      border-radius: 0.75rem 0.75rem 0 0;
      color: white;
      background-color: ${settings.primaryColor};
    `;
    
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="font-weight: bold; margin: 0;">${settings.widgetTitle}</h3>
          <p style="font-size: 12px; margin: 0; opacity: 0.9;">${settings.widgetSubtitle}</p>
        </div>
        <button id="close-button" style="background: none; border: none; color: white; cursor: pointer; height: 32px; width: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // 消息区域
    const messageArea = document.createElement('div');
    messageArea.style.cssText = `
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    renderMessages();

    // 输入区域（直接显示消息输入表单）
    const inputArea = document.createElement('div');
    inputArea.style.cssText = `
      padding: 8px;
      border-top: 1px solid #eee;
    `;
    
    // 创建包含图片上传按钮的容器
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      position: relative;
      display: flex;
      align-items: center;
    `;
    
    // 图片预览容器
    const imagePreviewContainer = document.createElement('div');
    imagePreviewContainer.style.cssText = `
      display: none;
      margin-bottom: 8px;
      position: relative;
    `;
    
    // 图片预览
    const imagePreview = document.createElement('img');
    imagePreview.style.cssText = `
      max-height: 100px;
      max-width: 100px;
      border-radius: 4px;
      border: 1px solid #ddd;
    `;
    
    // 删除图片按钮
    const removeImageButton = document.createElement('button');
    removeImageButton.innerHTML = '×';
    removeImageButton.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    removeImageButton.addEventListener('click', () => {
      imagePreviewContainer.style.display = 'none';
      imagePreview.src = '';
      fileInput.value = '';
    });
    
    imagePreviewContainer.appendChild(imagePreview);
    imagePreviewContainer.appendChild(removeImageButton);
    
    // 文件输入
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.cssText = `
      position: absolute;
      left: 8px;
      opacity: 0;
      width: 28px;
      height: 28px;
      cursor: pointer;
    `;
    
    // 图片上传按钮
    const imageButton = document.createElement('button');
    imageButton.type = 'button';
    imageButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    `;
    imageButton.style.cssText = `
      background: none;
      color: ${settings.primaryColor};
      border: none;
      position: absolute;
      left: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      width: 28px;
    `;
    
    // 消息输入框
    const messageInputField = document.createElement('input');
    messageInputField.id = 'message-input';
    messageInputField.placeholder = '输入消息...';
    messageInputField.style.cssText = `
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 8px 60px 8px 40px;
      font-size: 14px;
    `;
    
    // 发送按钮
    const sendButton = document.createElement('button');
    sendButton.type = 'submit';
    sendButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    `;
    sendButton.style.cssText = `
      background: none;
      color: ${settings.primaryColor};
      border: none;
      position: absolute;
      right: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      width: 28px;
    `;
    
    // 组装输入区域
    inputContainer.appendChild(imagePreviewContainer);
    inputContainer.appendChild(fileInput);
    inputContainer.appendChild(imageButton);
    inputContainer.appendChild(messageInputField);
    inputContainer.appendChild(sendButton);
    
    // 添加文件选择事件监听器
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // 验证文件类型
        if (!file.type.match('image.*')) {
          alert('请选择图片文件');
          return;
        }
        
        // 验证文件大小 (最大5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('图片大小不能超过5MB');
          return;
        }
        
        // 创建预览
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
    
    inputArea.appendChild(inputContainer);
    
    // 品牌标识
    const branding = settings.showBranding ? `
      <div style="text-align: center; font-size: 12px; color: #999; margin-top: 4px;">
        由 霓虹 提供支持
      </div>
    ` : '';

    // 组装组件
    card.appendChild(header);
    card.appendChild(messageArea);
    card.appendChild(inputArea);
    
    // 只有在显示品牌标识时才添加
    if (settings.showBranding) {
      const brandingDiv = document.createElement('div');
      brandingDiv.style.cssText = `
        text-align: center;
        font-size: 12px;
        color: #999;
        padding: 4px 0;
      `;
      brandingDiv.textContent = '由 霓虹 提供支持';
      card.appendChild(brandingDiv);
    }

    // 添加关闭按钮功能
    const closeButton = header.querySelector('#close-button');
    closeButton.addEventListener('click', () => {
      isOpen = false;
      renderWidget();
    });

    // 添加事件监听器（直接使用消息表单）
    const messageForm = inputArea.querySelector('#message-form') || inputContainer.closest('form') || inputContainer;
    
    // 如果表单不存在，创建一个
    let formElement = messageForm.tagName === 'FORM' ? messageForm : document.createElement('form');
    if (formElement !== messageForm) {
      // 将输入容器移到表单内
      formElement.appendChild(inputContainer);
      inputArea.appendChild(formElement);
    }
    
    formElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const message = messageInputField.value.trim();
      if (message || imagePreview.src) {
        // 如果有图片，先上传图片
        let imageUrl = null;
        if (imagePreview.src && imagePreview.src.startsWith('data:')) {
          // 这里应该上传图片到服务器并获取URL
          // 为简化起见，我们使用预览数据URL，但在实际应用中应该上传到服务器
          imageUrl = imagePreview.src;
        }
        
        await sendMessage(message, imageUrl);
        messageInputField.value = '';
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '';
        fileInput.value = '';
      }
    });
    
    return card;
  }

  // 发送消息到服务器
  async function sendMessage(content, imageUrl = null) {
    try {
      // 添加用户消息到本地
      const userMessage = {
        id: `msg-${Date.now()}`,
        content: content,
        sender: 'user',
        timestamp: new Date(),
        imageUrl: imageUrl // 添加图片URL支持
      };
      
      messages.push(userMessage);
      renderMessages();
      
      // 滚动到底部
      scrollToBottom();
      
      // 发送到服务器
      const response = await fetch('/api/widget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          content: content,
          website_id: widgetId,
          image_url: imageUrl // 添加图片URL到请求
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        caseId = result.caseId;
        
        // 模拟客服回复
        setTimeout(() => {
          const agentMessage = {
            id: `msg-${Date.now() + 1}`,
            content: "感谢您的消息！客服将尽快回复您。",
            sender: 'agent',
            timestamp: new Date(),
          };
          messages.push(agentMessage);
          renderMessages();
          
          // 滚动到底部
          scrollToBottom();
        }, 1000);
      } else {
        console.error('Failed to send message to server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // 渲染小部件
  function renderWidget() {
    widgetContainer.innerHTML = '';
    if (isOpen) {
      widgetContainer.appendChild(createOpenWidget());
    } else {
      widgetContainer.appendChild(createClosedWidget());
    }
  }

  // 初始渲染
  renderWidget();
  
  // 将元素添加到页面
  container.appendChild(widgetContainer);
  
  // 获取设置
  fetchSettings();
})();