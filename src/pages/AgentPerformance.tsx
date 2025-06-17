
import React from 'react';
import { callData } from '@/data/callData';
import AgentPerformanceTable from '@/components/AgentPerformanceTable';
import AgentTrainingRecommendations from '@/components/AgentTrainingRecommendations';
import TrainingNeedsMatrix from '@/components/TrainingNeedsMatrix';
import { TrendingUp } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';

const AgentPerformance = () => {
  const { filteredData } = useFilters(callData);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Agent Performance
        </h2>
        <p className="text-gray-600">Individual agent metrics, training needs, and performance insights</p>
      </div>
      
      <div className="mb-6">
        <AgentTrainingRecommendations data={filteredData} />
      </div>
      
      <div className="mb-6">
        <TrainingNeedsMatrix data={filteredData} />
      </div>
      
      <AgentPerformanceTable data={filteredData} />
    </div>
  );
};

export default AgentPerformance;
