// Simple debug script to check message data
console.log('Checking message data format...');

// Simulate what might be happening in the database layer
const sampleMessages = [
  {
    id: '1',
    case_id: 'case-1',
    sender_type: 'agent',
    content: 'Hello from agent',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    case_id: 'case-1',
    sender_type: 'user',
    content: 'Hello from user',
    timestamp: new Date().toISOString()
  }
];

console.log('Sample messages from DB (snake_case):');
console.log(JSON.stringify(sampleMessages, null, 2));

// Simulate the transformation that should happen
const transformedMessages = sampleMessages.map(m => ({
  id: m.id,
  caseId: m.case_id,
  senderType: m.sender_type,
  content: m.content,
  timestamp: m.timestamp
}));

console.log('\nTransformed messages (camelCase):');
console.log(JSON.stringify(transformedMessages, null, 2));