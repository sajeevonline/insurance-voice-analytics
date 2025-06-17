
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallRecord } from '@/data/callData';

interface TrainingNeedsMatrixProps {
  data: CallRecord[];
}

const TrainingNeedsMatrix: React.FC<TrainingNeedsMatrixProps> = ({ data }) => {
  const matrixData = React.useMemo(() => {
    const agents = [...new Set(data.map(call => call.agentName))];
    const topics = ['claims', 'pricing', 'cancellation', 'delay', 'billing'];
    
    return agents.map(agent => {
      const agentCalls = data.filter(call => call.agentName === agent);
      const agentEscalations = agentCalls.filter(call => call.outcome === 'escalated');
      
      const topicScores = topics.map(topic => {
        const topicEscalations = agentEscalations.filter(call => call.topics.includes(topic)).length;
        const topicTotal = agentCalls.filter(call => call.topics.includes(topic)).length;
        const escalationRate = topicTotal > 0 ? (topicEscalations / topicTotal) * 100 : 0;
        
        return {
          topic,
          escalationRate: Math.round(escalationRate),
          count: topicEscalations
        };
      });
      
      return {
        agent,
        topics: topicScores
      };
    });
  }, [data]);

  const getIntensityColor = (rate: number) => {
    if (rate === 0) return 'bg-green-100 text-green-800';
    if (rate < 20) return 'bg-yellow-100 text-yellow-800';
    if (rate < 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Needs Matrix (Agent Escalation Rates by Topic)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 font-medium">Agent</th>
                <th className="text-center p-3 font-medium">Claims</th>
                <th className="text-center p-3 font-medium">Pricing</th>
                <th className="text-center p-3 font-medium">Cancellation</th>
                <th className="text-center p-3 font-medium">Delay</th>
                <th className="text-center p-3 font-medium">Billing</th>
              </tr>
            </thead>
            <tbody>
              {matrixData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{row.agent}</td>
                  {row.topics.map((topicData, topicIndex) => (
                    <td key={topicIndex} className="p-3 text-center">
                      <Badge className={`${getIntensityColor(topicData.escalationRate)} text-xs`}>
                        {topicData.escalationRate}%
                      </Badge>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-600">
          <span>Escalation Rate:</span>
          <Badge className="bg-green-100 text-green-800">0-19%</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">20-39%</Badge>
          <Badge className="bg-red-100 text-red-800">40%+</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingNeedsMatrix;
