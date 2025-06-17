
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

interface ChurnTrendChartProps {
  data: CallRecord[];
}

const ChurnTrendChart: React.FC<ChurnTrendChartProps> = ({ data }) => {
  const trendData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      const dayData = data.filter(call => isSameDay(new Date(call.timestamp), date));
      const avgChurnRisk = dayData.length > 0 
        ? dayData.reduce((sum, call) => sum + call.churnRisk, 0) / dayData.length 
        : 0;
      
      return {
        date: format(date, 'MMM dd'),
        avgChurnRisk: Number((avgChurnRisk * 100).toFixed(2)),
        callCount: dayData.length
      };
    });
    
    return last7Days;
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Risk Trend (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              label={{ value: 'Avg Churn Risk (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Avg Churn Risk']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="avgChurnRisk" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChurnTrendChart;
