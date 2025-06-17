
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SentimentChartProps {
  data: CallRecord[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const sentimentData = React.useMemo(() => {
    const policyTypes = ['motor', 'health', 'travel', 'home', 'life'];
    
    return policyTypes.map(policyType => {
      const policyData = data.filter(call => call.policyType === policyType);
      const total = policyData.length;
      
      return {
        policyType: policyType.charAt(0).toUpperCase() + policyType.slice(1),
        positive: total ? ((policyData.filter(call => call.sentiment === 'positive').length / total) * 100).toFixed(1) : 0,
        neutral: total ? ((policyData.filter(call => call.sentiment === 'neutral').length / total) * 100).toFixed(1) : 0,
        negative: total ? ((policyData.filter(call => call.sentiment === 'negative').length / total) * 100).toFixed(1) : 0,
        total
      };
    });
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Breakdown by Policy Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sentimentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="policyType" />
            <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name) => [`${value}%`, typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name]}
              labelFormatter={(label) => `Policy Type: ${label}`}
            />
            <Bar dataKey="positive" fill="#22c55e" name="positive" />
            <Bar dataKey="neutral" fill="#6b7280" name="neutral" />
            <Bar dataKey="negative" fill="#ef4444" name="negative" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
