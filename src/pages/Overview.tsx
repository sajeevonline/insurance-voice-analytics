
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { callData } from '@/data/callData';
import KPICards from '@/components/KPICards';
import RetentionActionSuggestions from '@/components/RetentionActionSuggestions';
import { CalendarDays, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFilters } from '@/hooks/useFilters';

const Overview = () => {
  const { filters, setFilters, filteredData } = useFilters(callData);

  const quickStats = {
    totalCalls: filteredData.length,
    highRiskCustomers: filteredData.filter(call => call.churnRisk > 0.7).length,
    agentsNeedingTraining: [...new Set(filteredData.filter(call => call.outcome === 'escalated').map(call => call.agentName))].length,
    unresolvedCalls: filteredData.filter(call => call.outcome === 'unresolved').length
  };

  return (
    <div className="space-y-6">
      {/* Global Filters */}
      <Card>
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
                {[...new Set(callData.map(call => ({ id: call.agentId, name: call.agentName })))].map(agent => (
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

      {/* KPI Overview */}
      <KPICards data={filteredData} />

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-6 w-6" />
          Retention Actions
        </h2>
        <RetentionActionSuggestions data={filteredData} />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/customer-analytics">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Customer Analytics</h3>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Sentiment analysis, churn trends, and customer insights</p>
              <div className="text-2xl font-bold text-blue-600">{quickStats.highRiskCustomers}</div>
              <p className="text-sm text-gray-500">High-risk customers</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/agent-performance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Agent Performance</h3>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Individual agent metrics and training recommendations</p>
              <div className="text-2xl font-bold text-green-600">{quickStats.agentsNeedingTraining}</div>
              <p className="text-sm text-gray-500">Agents needing training</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/operations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Operations</h3>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Call duration, escalations, and operational metrics</p>
              <div className="text-2xl font-bold text-orange-600">{quickStats.unresolvedCalls}</div>
              <p className="text-sm text-gray-500">Unresolved calls</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Overview;
