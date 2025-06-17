
export interface CallRecord {
  callId: string;
  customerId: string;
  agentId: string;
  agentName: string;
  timestamp: Date;
  duration: number; // in minutes
  sentiment: 'positive' | 'neutral' | 'negative';
  emotions: string[];
  topics: string[];
  outcome: 'resolved' | 'unresolved' | 'escalated';
  churnRisk: number; // 0-1
  policyType: 'motor' | 'health' | 'travel' | 'home' | 'life';
  agentScore: number; // 1-10
  customerSegment: 'retail' | 'SME' | 'corporate';
}

const agents = [
  { id: 'A001', name: 'Sarah Johnson' },
  { id: 'A002', name: 'Mike Chen' },
  { id: 'A003', name: 'Emma Davis' },
  { id: 'A004', name: 'James Wilson' },
  { id: 'A005', name: 'Lisa Rodriguez' },
  { id: 'A006', name: 'Tom Anderson' },
  { id: 'A007', name: 'Rachel Kim' },
  { id: 'A008', name: 'David Brown' }
];

const topics = [
  'claims', 'delay', 'cancellation', 'pricing', 'renewal', 'policy_change',
  'payment', 'coverage', 'deductible', 'benefits', 'complaint', 'billing'
];

const emotions = [
  'anger', 'frustration', 'sadness', 'happiness', 'confusion', 
  'satisfaction', 'concern', 'relief', 'anxiety', 'neutral'
];

const policyTypes: CallRecord['policyType'][] = ['motor', 'health', 'travel', 'home', 'life'];
const segments: CallRecord['customerSegment'][] = ['retail', 'SME', 'corporate'];
const sentiments: CallRecord['sentiment'][] = ['positive', 'neutral', 'negative'];
const outcomes: CallRecord['outcome'][] = ['resolved', 'unresolved', 'escalated'];

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateCallData(count: number = 500): CallRecord[] {
  const calls: CallRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    // Generate timestamp within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Sentiment influences churn risk
    let baseChurnRisk = Math.random();
    if (sentiment === 'negative') baseChurnRisk = Math.min(0.9, baseChurnRisk + 0.4);
    if (sentiment === 'positive') baseChurnRisk = Math.max(0.1, baseChurnRisk - 0.3);
    if (outcome === 'escalated') baseChurnRisk = Math.min(0.95, baseChurnRisk + 0.3);
    
    calls.push({
      callId: `CALL-${String(i + 1).padStart(4, '0')}`,
      customerId: `CUST-${String(Math.floor(Math.random() * 200) + 1).padStart(4, '0')}`,
      agentId: agent.id,
      agentName: agent.name,
      timestamp,
      duration: Math.floor(Math.random() * 45) + 5, // 5-50 minutes
      sentiment,
      emotions: getRandomItems(emotions, Math.floor(Math.random() * 3) + 1),
      topics: getRandomItems(topics, Math.floor(Math.random() * 3) + 1),
      outcome,
      churnRisk: Math.round(baseChurnRisk * 100) / 100,
      policyType: policyTypes[Math.floor(Math.random() * policyTypes.length)],
      agentScore: Math.floor(Math.random() * 5) + 6, // 6-10
      customerSegment: segments[Math.floor(Math.random() * segments.length)]
    });
  }
  
  return calls;
}

export const callData = generateCallData(500);
