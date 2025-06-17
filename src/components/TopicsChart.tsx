
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopicsChartProps {
  data: CallRecord[];
}

const TopicsChart: React.FC<TopicsChartProps> = ({ data }) => {
  const topicsData = React.useMemo(() => {
    const negativeCalls = data.filter(call => call.sentiment === 'negative');
    const topicCounts: { [key: string]: number } = {};
    
    negativeCalls.forEach(call => {
      call.topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });
    
    return Object.entries(topicCounts)
      .map(([topic, count]) => ({
        topic: topic.replace('_', ' ').charAt(0).toUpperCase() + topic.slice(1),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Call Topics with Negative Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topicsData} layout="horizontal" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="topic" type="category" width={80} />
            <Tooltip formatter={(value) => [value, 'Mentions']} />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopicsChart;
