
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CallRecord } from '@/data/callData';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface HighRiskTableProps {
  data: CallRecord[];
}

const HighRiskTable: React.FC<HighRiskTableProps> = ({ data }) => {
  const highRiskCalls = React.useMemo(() => {
    return data
      .filter(call => call.churnRisk > 0.7 && (call.outcome === 'unresolved' || call.outcome === 'escalated'))
      .sort((a, b) => b.churnRisk - a.churnRisk)
      .slice(0, 10);
  }, [data]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'unresolved': return 'bg-yellow-100 text-yellow-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          High-Risk Unresolved Calls (Churn Risk > 70%)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Call ID</th>
                <th className="text-left p-3 font-medium">Customer</th>
                <th className="text-left p-3 font-medium">Agent</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Policy</th>
                <th className="text-left p-3 font-medium">Churn Risk</th>
                <th className="text-left p-3 font-medium">Sentiment</th>
                <th className="text-left p-3 font-medium">Outcome</th>
                <th className="text-left p-3 font-medium">Topics</th>
                <th className="text-left p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {highRiskCalls.map((call, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{call.callId}</td>
                  <td className="p-3 font-mono text-sm">{call.customerId}</td>
                  <td className="p-3">{call.agentName}</td>
                  <td className="p-3">{format(new Date(call.timestamp), 'MMM dd, yyyy')}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="capitalize">
                      {call.policyType}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${call.churnRisk * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        {(call.churnRisk * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={getSentimentColor(call.sentiment)}>
                      {call.sentiment}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={getOutcomeColor(call.outcome)}>
                      {call.outcome}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {call.topics.slice(0, 2).map(topic => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {call.topics.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{call.topics.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" className="text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Follow Up
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {highRiskCalls.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No high-risk unresolved calls found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HighRiskTable;
