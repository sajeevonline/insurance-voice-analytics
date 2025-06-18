
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import KPICards from '@/components/KPICards';
import SentimentChart from '@/components/SentimentChart';
import TopicsChart from '@/components/TopicsChart';
import RetentionActionSuggestions from '@/components/RetentionActionSuggestions';
import { Activity, TrendingUp, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';
import { Filters } from '@/hooks/useFilters';

interface OutletContext {
  filteredData: CallRecord[];
  filters: Filters;
}

const Overview = () => {
  const { filteredData } = useOutletContext<OutletContext>();

  // Calculate key metrics
  const totalCalls = filteredData.length;
  const avgSentiment = filteredData.reduce((sum, call) => {
    const score = call.sentiment === 'positive' ? 1 : call.sentiment === 'neutral' ? 0.5 : 0;
    return sum + score;
  }, 0) / totalCalls;
  const avgChurnRisk = filteredData.reduce((sum, call) => sum + call.churnRisk, 0) / totalCalls;
  const resolutionRate = (filteredData.filter(call => call.outcome === 'resolved').length / totalCalls) * 100;

  const quickStats = [
    {
      title: 'Total Calls',
      value: totalCalls.toLocaleString(),
      icon: Activity,
      trend: '+12%',
      trendUp: true,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Avg Sentiment',
      value: `${(avgSentiment * 100).toFixed(1)}%`,
      icon: TrendingUp,
      trend: '+5.2%',
      trendUp: true,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Resolution Rate',
      value: `${resolutionRate.toFixed(1)}%`,
      icon: Users,
      trend: '+2.1%',
      trendUp: true,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Churn Risk',
      value: `${(avgChurnRisk * 100).toFixed(1)}%`,
      icon: Clock,
      trend: '-3.5%',
      trendUp: false,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="text-center py-6 sm:py-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
          Analytics Overview
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Real-time insights from customer-agent interactions powered by AI
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trendUp ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main KPI Cards */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
        <KPICards data={filteredData} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/20 shadow-xl">
          <SentimentChart data={filteredData} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/20 shadow-xl">
          <TopicsChart data={filteredData} />
        </div>
      </div>

      {/* Action Suggestions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/20 shadow-xl">
        <RetentionActionSuggestions data={filteredData} />
      </div>
    </div>
  );
};

export default Overview;
