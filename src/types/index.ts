export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'agent' | 'admin';
  status: 'online' | 'offline';
  password?: string;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  caseId: string;
  senderType: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  userId?: string; // agent's id
  customerId?: string;
  imageUrl?: string; // 添加图片URL字段
};

export type Case = {
  id: string;
  customerId: string;
  status: 'open' | 'in-progress' | 'resolved';
  summary: string;
  createdAt: string;
  updatedAt: string;
};

export type Conversation = {
  id: string; // This will be the case_id
  customer: Customer;
  messages: Message[];
  case: Case;
};

export type Website = {
  id: string;
  name: string;
  url: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type AppSettings = {
  id: number;
<<<<<<< HEAD
  primaryColor: string;
  welcomeMessage: string;
  offlineMessage: string;
  acceptNewChats: boolean;
  createdAt: string;
  updatedAt: string;
  widgetTitle: string;
  widgetSubtitle: string;
  autoOpenWidget: boolean;
  showBranding: boolean;
  typingIndicatorMessage: string;
  connectionMessage: string;
  workStartTime: string;
  workEndTime: string;
  autoOffline: boolean;
  awayMessage: string;
  enableAiSuggestions: boolean;
  enableImageUpload: boolean; // 添加图片上传功能开关
}
=======
  primary_color: string;
  welcome_message: string;
  offline_message: string;
  accept_new_chats: boolean;
  createdAt: string;
  updatedAt: string;
}
>>>>>>> 397514edb21c0d3505dba3525893063086b66a55
