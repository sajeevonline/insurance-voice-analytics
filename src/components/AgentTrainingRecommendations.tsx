
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallRecord } from '@/data/callData';
import { BookUser, AlertTriangle, TrendingDown, Users } from 'lucide-react';

interface AgentTrainingRecommendationsProps {
  data: CallRecord[];
}

interface TrainingRecommendation {
  agent: string;
  recommendations: {
    area: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    icon: React.ReactNode;
  }[];
}

const AgentTrainingRecommendations: React.FC<AgentTrainingRecommendationsProps> = ({ data }) => {
  const trainingData = React.useMemo(() => {
    const agents = [...new Set(data.map(call => call.agentName))];
    
    return agents.map(agent => {
      const agentCalls = data.filter(call => call.agentName === agent);
      const recommendations: TrainingRecommendation['recommendations'] = [];
      
      // Calculate metrics
      const totalCalls = agentCalls.length;
      const escalationRate = (agentCalls.filter(call => call.outcome === 'escalated').length / totalCalls) * 100;
      const resolutionRate = (agentCalls.filter(call => call.outcome === 'resolved').length / totalCalls) * 100;
      const avgSentiment = agentCalls.reduce((sum, call) => {
        const sentimentScore = call.sentiment === 'positive' ? 1 : call.sentiment === 'neutral' ? 0 : -1;
        return sum + sentimentScore;
      }, 0) / totalCalls;
      const negativeCalls = agentCalls.filter(call => call.sentiment === 'negative').length;
      
      // Topic-specific performance
      const topicPerformance = ['claims', 'pricing', 'cancellation', 'billing', 'delay'].map(topic => {
        const topicCalls = agentCalls.filter(call => call.topics.includes(topic));
        const topicEscalations = topicCalls.filter(call => call.outcome === 'escalated').length;
        return {
          topic,
          escalationRate: topicCalls.length > 0 ? (topicEscalations / topicCalls.length) * 100 : 0,
          callCount: topicCalls.length
        };
      });
      
      // High escalation rate
      if (escalationRate > 25) {
        recommendations.push({
          area: 'De-escalation Techniques',
          priority: 'high',
          reason: `${escalationRate.toFixed(1)}% escalation rate (above 25% threshold)`,
          icon: <AlertTriangle className="h-4 w-4" />
        });
      }
      
      // Low resolution rate
      if (resolutionRate < 60) {
        recommendations.push({
          area: 'Problem Resolution Skills',
          priority: 'high',
          reason: `${resolutionRate.toFixed(1)}% resolution rate (below 60% target)`,
          icon: <TrendingDown className="h-4 w-4" />
        });
      }
      
      // Poor sentiment management
      if (avgSentiment < -0.3 || negativeCalls > totalCalls * 0.4) {
        recommendations.push({
          area: 'Customer Empathy & Communication',
          priority: 'medium',
          reason: `${negativeCalls} negative sentiment calls (${((negativeCalls/totalCalls)*100).toFixed(1)}%)`,
          icon: <Users className="h-4 w-4" />
        });
      }
      
      // Topic-specific training needs
      topicPerformance.forEach(({ topic, escalationRate: topicEscalationRate, callCount }) => {
        if (topicEscalationRate > 30 && callCount > 5) {
          recommendations.push({
            area: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Expertise`,
            priority: topicEscalationRate > 50 ? 'high' : 'medium',
            reason: `${topicEscalationRate.toFixed(1)}% escalation rate for ${topic} topics`,
            icon: <BookUser className="h-4 w-4" />
          });
        }
      });
      
      // Emotion handling
      const emotionCalls = agentCalls.filter(call => 
        call.emotions.some(emotion => ['anger', 'frustration', 'anxiety'].includes(emotion))
      );
      const emotionEscalations = emotionCalls.filter(call => call.outcome === 'escalated').length;
      
      if (emotionCalls.length > 0 && (emotionEscalations / emotionCalls.length) > 0.4) {
        recommendations.push({
          area: 'Emotional Intelligence & Conflict Resolution',
          priority: 'medium',
          reason: `${((emotionEscalations/emotionCalls.length)*100).toFixed(1)}% escalation rate with emotional customers`,
          icon: <Users className="h-4 w-4" />
        });
      }
      
      // Sort by priority
      recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      
      return {
        agent,
        recommendations: recommendations.slice(0, 4) // Limit to top 4 recommendations
      };
    }).filter(item => item.recommendations.length > 0);
  }, [data]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookUser className="h-5 w-5" />
          Agent Training Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {trainingData.map((agentData, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg mb-3">{agentData.agent}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agentData.recommendations.map((rec, recIndex) => (
                  <div key={recIndex} className="bg-white rounded-lg p-3 border shadow-sm">
                    <div className="flex items-start gap-2 mb-2">
                      {rec.icon}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{rec.area}</h4>
                          <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{rec.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {trainingData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookUser className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No specific training recommendations needed based on current performance metrics.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentTrainingRecommendations;
