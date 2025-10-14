import type { User, Customer, Conversation } from '@/types';

export const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', email: 'alex.doe@example.com', avatar: 'https://picsum.photos/seed/1/40/40', role: 'agent', status: 'online' },
  { id: 'user-2', name: 'Sam Smith', email: 'sam.smith@example.com', avatar: 'https://picsum.photos/seed/2/40/40', role: 'agent', status: 'offline' },
  { id: 'user-3', name: 'Jordan Lee', email: 'jordan.lee@example.com', avatar: 'https://picsum.photos/seed/3/40/40', role: 'admin', status: 'online' },
  { id: 'user-4', name: 'Casey Brown', email: 'casey.brown@example.com', avatar: 'https://picsum.photos/seed/4/40/40', role: 'agent', status: 'online' },
];

export const customers: Customer[] = [
    { id: 'cust-1', name: 'Jamie Robert', email: 'jamie.robert@example.com', avatar: 'https://picsum.photos/seed/101/40/40' },
    { id: 'cust-2', name: 'Pat Taylor', email: 'pat.taylor@example.com', avatar: 'https://picsum.photos/seed/102/40/40' },
    { id: 'cust-3', name: 'Chris Garcia', email: 'chris.garcia@example.com', avatar: 'https://picsum.photos/seed/103/40/40' },
    { id: 'cust-4', name: 'Taylor Miller', email: 'taylor.miller@example.com', avatar: 'https://picsum.photos/seed/104/40/40' },
];

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    customer: customers[0],
    messages: [
      { id: 'msg-1-1', sender: 'user', content: 'Hi, I\'m having trouble with my recent order. It hasn\'t arrived yet.', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
      { id: 'msg-1-2', sender: 'agent', agentId: 'user-1', content: 'Hello Jamie, I\'m sorry to hear that. Can you please provide me with your order number?', timestamp: new Date(Date.now() - 1000 * 60 * 23).toISOString() },
      { id: 'msg-1-3', sender: 'user', content: 'Sure, it\'s #12345XYZ.', timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
      { id: 'msg-1-4', sender: 'agent', agentId: 'user-1', content: 'Thank you. Let me check the status for you.', timestamp: new Date(Date.now() - 1000 * 60 * 21).toISOString() },
      { id: 'msg-1-5', sender: 'user', content: 'Okay, I will wait.', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() },
    ],
    case: { id: 'case-1', status: 'in-progress', summary: 'Inquiry about delayed order #12345XYZ.' },
  },
  {
    id: 'conv-2',
    customer: customers[1],
    messages: [
      { id: 'msg-2-1', sender: 'user', content: 'I want to return an item.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: 'msg-2-2', sender: 'agent', agentId: 'user-2', content: 'I can help with that. What is the item you\'d like to return?', timestamp: new Date(Date.now() - 1000 * 60 * 118).toISOString() },
    ],
    case: { id: 'case-2', status: 'open', summary: 'Return request for an unspecified item.' },
  },
  {
    id: 'conv-3',
    customer: customers[2],
    messages: [
      { id: 'msg-3-1', sender: 'user', content: 'My promo code isn\'t working.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: 'msg-3-2', sender: 'system', content: 'This conversation was resolved by Alex Doe.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
    ],
    case: { id: 'case-3', status: 'resolved', summary: 'Issue with promo code application.' },
  },
  {
    id: 'conv-4',
    customer: customers[3],
    messages: [
      { id: 'msg-4-1', sender: 'user', content: 'Do you ship to Canada?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    ],
    case: { id: 'case-4', status: 'open', summary: 'Question about international shipping.' },
  },
];
