
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CallDurationChartProps {
  data: CallRecord[];
}

const CallDurationChart: React.FC<CallDurationChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const resolved = data
      .filter(call => call.outcome === 'resolved')
      .map(call => ({ duration: call.duration, outcome: 'Resolved', churnRisk: call.churnRisk * 100 }));
    
    const unresolved = data
      .filter(call => call.outcome === 'unresolved')
      .map(call => ({ duration: call.duration, outcome: 'Unresolved', churnRisk: call.churnRisk * 100 }));
    
    const escalated = data
      .filter(call => call.outcome === 'escalated')
      .map(call => ({ duration: call.duration, outcome: 'Escalated', churnRisk: call.churnRisk * 100 }));

    return { resolved, unresolved, escalated };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Duration vs Resolution Outcome</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="duration" 
              name="Duration"
              label={{ value: 'Call Duration (minutes)', position: 'bottom' }}
            />
            <YAxis 
              type="number" 
              dataKey="churnRisk" 
              name="Churn Risk"
              label={{ value: 'Churn Risk (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} 
              formatter={(value, name) => [
                name === 'duration' ? `${value} min` : `${value}%`,
                name === 'duration' ? 'Duration' : 'Churn Risk'
              ]}
            />
            <Legend />
            <Scatter name="Resolved" data={chartData.resolved} fill="#22c55e" />
            <Scatter name="Unresolved" data={chartData.unresolved} fill="#f59e0b" />
            <Scatter name="Escalated" data={chartData.escalated} fill="#ef4444" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CallDurationChart;
