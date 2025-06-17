
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

interface AgentEscalationTrackerProps {
  data: CallRecord[];
}

const AgentEscalationTracker: React.FC<AgentEscalationTrackerProps> = ({ data }) => {
  const escalationTrendData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      const dayData = data.filter(call => isSameDay(new Date(call.timestamp), date));
      
      const agents = [...new Set(data.map(call => call.agentName))].slice(0, 4); // Top 4 agents
      const dayResult: any = { date: format(date, 'MMM dd') };
      
      agents.forEach(agent => {
        const agentDayData = dayData.filter(call => call.agentName === agent);
        const escalations = agentDayData.filter(call => call.outcome === 'escalated').length;
        dayResult[agent] = escalations;
      });
      
      return dayResult;
    });
    
    return last7Days;
  }, [data]);

  const agents = [...new Set(data.map(call => call.agentName))].slice(0, 4);
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Escalation Tracker (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={escalationTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Escalations', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {agents.map((agent, index) => (
              <Line 
                key={agent}
                type="monotone" 
                dataKey={agent} 
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AgentEscalationTracker;
