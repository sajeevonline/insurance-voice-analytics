
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';
import { AlertTriangle, Users, TrendingDown, RefreshCw } from 'lucide-react';

interface RetentionActionSuggestionsProps {
  data: CallRecord[];
}

const RetentionActionSuggestions: React.FC<RetentionActionSuggestionsProps> = ({ data }) => {
  const actionData = React.useMemo(() => {
    const highRiskCustomers = [...new Set(data
      .filter(call => call.churnRisk > 0.7)
      .map(call => call.customerId)
    )].length;

    const recurringIssues = data.filter(call => {
      const customerCalls = data.filter(c => c.customerId === call.customerId);
      return customerCalls.length > 1 && customerCalls.filter(c => c.sentiment === 'negative').length > 1;
    }).length;

    const escalationActions = data.filter(call => 
      call.outcome === 'escalated' && call.churnRisk > 0.6
    ).length;

    const unresolvedFollowUps = data.filter(call => 
      call.outcome === 'unresolved' && call.churnRisk > 0.5
    ).length;

    return {
      highRiskCustomers,
      recurringIssues,
      escalationActions,
      unresolvedFollowUps
    };
  }, [data]);

  const suggestions = [
    {
      title: 'High-Risk Follow Ups',
      value: actionData.highRiskCustomers,
      subtitle: 'Customers requiring immediate attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      action: 'Schedule retention calls'
    },
    {
      title: 'Recurring Issues',
      value: actionData.recurringIssues,
      subtitle: 'Cases with repeated dissatisfaction',
      icon: RefreshCw,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: 'Process improvement needed'
    },
    {
      title: 'Escalation Actions',
      value: actionData.escalationActions,
      subtitle: 'High-risk escalated cases',
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: 'Senior agent review'
    },
    {
      title: 'Unresolved Follow Ups',
      value: actionData.unresolvedFollowUps,
      subtitle: 'Medium-risk unresolved calls',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: 'Proactive outreach'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {suggestions.map((suggestion, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${suggestion.bgColor}`}>
                <suggestion.icon className={`h-5 w-5 ${suggestion.color}`} />
              </div>
              <div className={`text-2xl font-bold ${suggestion.color}`}>
                {suggestion.value}
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">{suggestion.title}</p>
              <p className="text-xs text-gray-500 mb-2">{suggestion.subtitle}</p>
              <p className={`text-xs font-medium ${suggestion.color}`}>{suggestion.action}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RetentionActionSuggestions;
