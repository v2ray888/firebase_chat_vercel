export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'agent' | 'admin';
  status: 'online' | 'offline';
  password?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type Message = {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
};

export type Case = {
  id: string;
  status: 'open' | 'in-progress' | 'resolved';
  summary: string;
};

export type Conversation = {
  id: string;
  customer: Customer;
  messages: Message[];
  case: Case;
};
