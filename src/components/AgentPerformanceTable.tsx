
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallRecord } from '@/data/callData';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

interface AgentPerformanceTableProps {
  data: CallRecord[];
}

const AgentPerformanceTable: React.FC<AgentPerformanceTableProps> = ({ data }) => {
  const agentStats = React.useMemo(() => {
    const agentMap = new Map();
    
    data.forEach(call => {
      if (!agentMap.has(call.agentId)) {
        agentMap.set(call.agentId, {
          agentId: call.agentId,
          agentName: call.agentName,
          calls: [],
          totalCalls: 0,
          resolvedCalls: 0,
          escalatedCalls: 0,
          avgSentimentScore: 0,
          avgChurnRisk: 0,
          avgDuration: 0
        });
      }
      
      const agent = agentMap.get(call.agentId);
      agent.calls.push(call);
      agent.totalCalls++;
      
      if (call.outcome === 'resolved') agent.resolvedCalls++;
      if (call.outcome === 'escalated') agent.escalatedCalls++;
    });
    
    return Array.from(agentMap.values()).map(agent => {
      const sentimentScores = agent.calls.map(call => {
        switch (call.sentiment) {
          case 'positive': return 1;
          case 'neutral': return 0.5;
          case 'negative': return 0;
          default: return 0.5;
        }
      });
      
      agent.avgSentimentScore = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
      agent.avgChurnRisk = agent.calls.reduce((sum, call) => sum + call.churnRisk, 0) / agent.calls.length;
      agent.avgDuration = agent.calls.reduce((sum, call) => sum + call.duration, 0) / agent.calls.length;
      agent.resolutionRate = (agent.resolvedCalls / agent.totalCalls) * 100;
      agent.escalationRate = (agent.escalatedCalls / agent.totalCalls) * 100;
      
      return agent;
    }).sort((a, b) => b.totalCalls - a.totalCalls);
  }, [data]);

  const getPerformanceColor = (value: number, type: 'sentiment' | 'resolution' | 'churn') => {
    switch (type) {
      case 'sentiment':
        if (value >= 0.7) return 'text-green-600';
        if (value >= 0.5) return 'text-yellow-600';
        return 'text-red-600';
      case 'resolution':
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-yellow-600';
        return 'text-red-600';
      case 'churn':
        if (value <= 0.3) return 'text-green-600';
        if (value <= 0.6) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Agent Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Agent</th>
                <th className="text-left p-3 font-medium">Total Calls</th>
                <th className="text-left p-3 font-medium">Resolution Rate</th>
                <th className="text-left p-3 font-medium">Escalation Rate</th>
                <th className="text-left p-3 font-medium">Avg Sentiment</th>
                <th className="text-left p-3 font-medium">Avg Churn Risk</th>
                <th className="text-left p-3 font-medium">Avg Duration</th>
                <th className="text-left p-3 font-medium">Performance</th>
              </tr>
            </thead>
            <tbody>
              {agentStats.map((agent, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{agent.agentName}</div>
                      <div className="text-sm text-gray-500 font-mono">{agent.agentId}</div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{agent.totalCalls}</td>
                  <td className="p-3">
                    <span className={getPerformanceColor(agent.resolutionRate, 'resolution')}>
                      {agent.resolutionRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={agent.escalationRate > 20 ? 'text-red-600' : 'text-gray-600'}>
                      {agent.escalationRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            agent.avgSentimentScore >= 0.7 ? 'bg-green-500' :
                            agent.avgSentimentScore >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${agent.avgSentimentScore * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm ${getPerformanceColor(agent.avgSentimentScore, 'sentiment')}`}>
                        {(agent.avgSentimentScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={getPerformanceColor(agent.avgChurnRisk, 'churn')}>
                      {(agent.avgChurnRisk * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3">{agent.avgDuration.toFixed(1)}m</td>
                  <td className="p-3">
                    {agent.resolutionRate >= 80 && agent.avgChurnRisk < 0.4 ? (
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Excellent
                      </Badge>
                    ) : agent.resolutionRate >= 60 && agent.avgChurnRisk < 0.6 ? (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Good
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Needs Attention
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentPerformanceTable;
