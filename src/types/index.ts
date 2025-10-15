export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'agent' | 'admin';
  status: 'online' | 'offline';
  password?: string;
  created_at?: string;
  updated_at?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at?: string;
  updated_at?: string;
};

export type Message = {
  id: string;
  case_id: string;
  sender_type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  user_id?: string; // agent's id
  customer_id?: string;
};

export type Case = {
  id: string;
  customer_id: string;
  status: 'open' | 'in-progress' | 'resolved';
  summary: string;
  created_at: string;
  updated_at: string;
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
  user_id: string;
  created_at: string;
  updated_at: string;
};
