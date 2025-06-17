
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { callData, CallRecord } from '@/data/callData';
import SentimentChart from '@/components/SentimentChart';
import ChurnTrendChart from '@/components/ChurnTrendChart';
import TopicsChart from '@/components/TopicsChart';
import AgentPerformanceTable from '@/components/AgentPerformanceTable';
import EmotionHeatmap from '@/components/EmotionHeatmap';
import KPICards from '@/components/KPICards';
import HighRiskTable from '@/components/HighRiskTable';
import { CalendarDays, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    agent: 'all',
    policyType: 'all',
    sentiment: 'all',
    outcome: 'all',
    segment: 'all'
  });

  const filteredData = useMemo(() => {
    return callData.filter(call => {
      if (filters.agent !== 'all' && call.agentId !== filters.agent) return false;
      if (filters.policyType !== 'all' && call.policyType !== filters.policyType) return false;
      if (filters.sentiment !== 'all' && call.sentiment !== filters.sentiment) return false;
      if (filters.outcome !== 'all' && call.outcome !== filters.outcome) return false;
      if (filters.segment !== 'all' && call.customerSegment !== filters.segment) return false;
      
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const daysAgo = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 0;
        if (daysAgo > 0) {
          const cutoff = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
          if (call.timestamp < cutoff) return false;
        }
      }
      
      return true;
    });
  }, [filters]);

  const agents = [...new Set(callData.map(call => ({ id: call.agentId, name: call.agentName })))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Call Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights from customer-agent interactions</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Global Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.agent} onValueChange={(value) => setFilters(prev => ({ ...prev, agent: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.policyType} onValueChange={(value) => setFilters(prev => ({ ...prev, policyType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Policy Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="motor">Motor</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="life">Life</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sentiment} onValueChange={(value) => setFilters(prev => ({ ...prev, sentiment: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.outcome} onValueChange={(value) => setFilters(prev => ({ ...prev, outcome: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.segment} onValueChange={(value) => setFilters(prev => ({ ...prev, segment: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="SME">SME</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Active Filters:</span>
            {Object.entries(filters).map(([key, value]) => 
              value !== 'all' && (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {value}
                </Badge>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <KPICards data={filteredData} />

      {/* Customer Analytics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Customer Analytics
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SentimentChart data={filteredData} />
          <ChurnTrendChart data={filteredData} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TopicsChart data={filteredData} />
          <EmotionHeatmap data={filteredData} />
        </div>
        
        <HighRiskTable data={filteredData} />
      </div>

      <Separator className="my-8" />

      {/* Agent & Operations Analytics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Agent & Operations Analytics
        </h2>
        
        <AgentPerformanceTable data={filteredData} />
      </div>
    </div>
  );
};

export default Index;
