
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';
import { TrendingUp, TrendingDown, AlertTriangle, Users, Phone, Clock } from 'lucide-react';

interface KPICardsProps {
  data: CallRecord[];
}

const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const totalCalls = data.length;
  const highRiskCalls = data.filter(call => call.churnRisk > 0.7).length;
  const unresolvedCalls = data.filter(call => call.outcome === 'unresolved').length;
  const escalatedCalls = data.filter(call => call.outcome === 'escalated').length;
  const negativeSentiment = data.filter(call => call.sentiment === 'negative').length;
  const avgChurnRisk = data.reduce((sum, call) => sum + call.churnRisk, 0) / data.length;
  const avgCallDuration = data.reduce((sum, call) => sum + call.duration, 0) / data.length;
  const resolutionRate = ((data.length - unresolvedCalls - escalatedCalls) / data.length * 100);

  const kpis = [
    {
      title: 'Total Calls',
      value: totalCalls.toLocaleString(),
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'High Churn Risk',
      value: highRiskCalls.toString(),
      subtitle: `${((highRiskCalls / totalCalls) * 100).toFixed(1)}% of total`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Avg Churn Risk',
      value: (avgChurnRisk * 100).toFixed(1) + '%',
      icon: TrendingUp,
      color: avgChurnRisk > 0.5 ? 'text-red-600' : 'text-green-600',
      bgColor: avgChurnRisk > 0.5 ? 'bg-red-50' : 'bg-green-50'
    },
    {
      title: 'Resolution Rate',
      value: resolutionRate.toFixed(1) + '%',
      icon: resolutionRate > 80 ? TrendingUp : TrendingDown,
      color: resolutionRate > 80 ? 'text-green-600' : 'text-red-600',
      bgColor: resolutionRate > 80 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Negative Sentiment',
      value: negativeSentiment.toString(),
      subtitle: `${((negativeSentiment / totalCalls) * 100).toFixed(1)}% of total`,
      icon: TrendingDown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Avg Call Duration',
      value: avgCallDuration.toFixed(1) + 'm',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {kpis.map((kpi, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                {kpi.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
                )}
              </div>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
