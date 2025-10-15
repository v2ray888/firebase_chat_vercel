export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'agent' | 'admin';
  status: 'online' | 'offline';
  password?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Message = {
  id: string;
  caseId: string;
  senderType: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  userId?: string; // agent's id
  customerId?: string;
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
