
import React from 'react';
import { callData } from '@/data/callData';
import SentimentChart from '@/components/SentimentChart';
import ChurnTrendChart from '@/components/ChurnTrendChart';
import TopicsChart from '@/components/TopicsChart';
import EmotionHeatmap from '@/components/EmotionHeatmap';
import HighRiskTable from '@/components/HighRiskTable';
import { Users } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';

const CustomerAnalytics = () => {
  const { filteredData } = useFilters(callData);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Customer Analytics
        </h2>
        <p className="text-gray-600">Deep insights into customer sentiment, behavior, and churn risk</p>
      </div>
      
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
  );
};

export default CustomerAnalytics;
