
import React from 'react';
import { callData } from '@/data/callData';
import AgentPerformanceTable from '@/components/AgentPerformanceTable';
import AgentTrainingRecommendations from '@/components/AgentTrainingRecommendations';
import TrainingNeedsMatrix from '@/components/TrainingNeedsMatrix';
import { TrendingUp, Users, Award, Target } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';

const AgentPerformance = () => {
  const { filteredData } = useFilters(callData);

  // Calculate agent metrics
  const totalAgents = [...new Set(filteredData.map(call => call.agentId))].length;
  const avgResolutionRate = filteredData.filter(call => call.outcome === 'resolved').length / filteredData.length * 100;
  const topPerformer = [...new Set(filteredData.map(call => call.agentName))][0]; // Simplified for demo

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center py-4 sm:py-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Agent Performance
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Individual agent metrics, training needs, and performance optimization insights
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Total Agents</h3>
          </div>
          <p className="text-2xl font-bold text-blue-700">{totalAgents}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Target className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-800">Avg Resolution Rate</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">{avgResolutionRate.toFixed(1)}%</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Award className="h-6 w-6 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Top Performer</h3>
          </div>
          <p className="text-lg font-bold text-yellow-700 truncate">{topPerformer}</p>
        </div>
      </div>
      
      {/* Training Recommendations */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <AgentTrainingRecommendations data={filteredData} />
      </div>
      
      {/* Training Matrix */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <TrainingNeedsMatrix data={filteredData} />
      </div>
      
      {/* Performance Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <AgentPerformanceTable data={filteredData} />
      </div>
    </div>
  );
};

export default AgentPerformance;
