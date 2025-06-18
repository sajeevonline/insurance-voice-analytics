
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SentimentChart from '@/components/SentimentChart';
import ChurnTrendChart from '@/components/ChurnTrendChart';
import TopicsChart from '@/components/TopicsChart';
import EmotionHeatmap from '@/components/EmotionHeatmap';
import HighRiskTable from '@/components/HighRiskTable';
import { Users, Heart, TrendingDown, AlertTriangle } from 'lucide-react';
import { CallRecord } from '@/data/callData';
import { Filters } from '@/hooks/useFilters';

interface OutletContext {
  filteredData: CallRecord[];
  filters: Filters;
}

const CustomerAnalytics = () => {
  const { filteredData } = useOutletContext<OutletContext>();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center py-4 sm:py-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Customer Analytics
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Deep insights into customer sentiment, behavior patterns, and churn risk factors
        </p>
      </div>
      
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-800">Positive Sentiment</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {((filteredData.filter(call => call.sentiment === 'positive').length / filteredData.length) * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <TrendingDown className="h-6 w-6 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Avg Churn Risk</h3>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {((filteredData.reduce((sum, call) => sum + call.churnRisk, 0) / filteredData.length) * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="font-semibold text-red-800">High Risk Customers</h3>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {filteredData.filter(call => call.churnRisk > 0.7).length}
          </p>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <SentimentChart data={filteredData} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <ChurnTrendChart data={filteredData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <TopicsChart data={filteredData} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <EmotionHeatmap data={filteredData} />
        </div>
      </div>
      
      {/* High Risk Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <HighRiskTable data={filteredData} />
      </div>
    </div>
  );
};

export default CustomerAnalytics;
