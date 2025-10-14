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
      { id: 'msg-1-1', sender: 'user', content: '你好，我最近的订单遇到了问题。还没有送达。', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
      { id: 'msg-1-2', sender: 'agent', agentId: 'user-1', content: '你好 Jamie，听到这个消息我很难过。您能提供您的订单号吗？', timestamp: new Date(Date.now() - 1000 * 60 * 23).toISOString() },
      { id: 'msg-1-3', sender: 'user', content: '当然，是 #12345XYZ。', timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
      { id: 'msg-1-4', sender: 'agent', agentId: 'user-1', content: '谢谢你。让我为你查询一下状态。', timestamp: new Date(Date.now() - 1000 * 60 * 21).toISOString() },
      { id: 'msg-1-5', sender: 'user', content: '好的，我等着。', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() },
    ],
    case: { id: 'case-1', status: 'in-progress', summary: '关于延迟订单 #12345XYZ 的查询。' },
  },
  {
    id: 'conv-2',
    customer: customers[1],
    messages: [
      { id: 'msg-2-1', sender: 'user', content: '我想退货。', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: 'msg-2-2', sender: 'agent', agentId: 'user-2', content: '我可以帮忙。您想退货的商品是什么？', timestamp: new Date(Date.now() - 1000 * 60 * 118).toISOString() },
    ],
    case: { id: 'case-2', status: 'open', summary: '未指明商品的退货请求。' },
  },
  {
    id: 'conv-3',
    customer: customers[2],
    messages: [
      { id: 'msg-3-1', sender: 'user', content: '我的优惠码无效。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: 'msg-3-2', sender: 'system', content: '此对话已由 Alex Doe 解决。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
    ],
    case: { id: 'case-3', status: 'resolved', summary: '优惠码应用问题。' },
  },
  {
    id: 'conv-4',
    customer: customers[3],
    messages: [
      { id: 'msg-4-1', sender: 'user', content: '你们向加拿大发货吗？', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    ],
    case: { id: 'case-4', status: 'open', summary: '关于国际运输的问题。' },
  },
];
