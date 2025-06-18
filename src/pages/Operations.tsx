
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AgentEscalationTracker from '@/components/AgentEscalationTracker';
import CallDurationChart from '@/components/CallDurationChart';
import { BarChart3, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { CallRecord } from '@/data/callData';
import { Filters } from '@/hooks/useFilters';

interface OutletContext {
  filteredData: CallRecord[];
  filters: Filters;
}

const Operations = () => {
  const { filteredData } = useOutletContext<OutletContext>();

  // Calculate operational metrics
  const avgCallDuration = filteredData.reduce((sum, call) => sum + call.duration, 0) / filteredData.length;
  const escalationRate = (filteredData.filter(call => call.outcome === 'escalated').length / filteredData.length) * 100;
  const totalOperationalTime = filteredData.reduce((sum, call) => sum + call.duration, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center py-4 sm:py-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Operations Analytics
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Call duration trends, escalation patterns, and operational efficiency metrics
        </p>
      </div>

      {/* Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Avg Call Duration</h3>
          </div>
          <p className="text-2xl font-bold text-blue-700">{avgCallDuration.toFixed(1)} min</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="font-semibold text-red-800">Escalation Rate</h3>
          </div>
          <p className="text-2xl font-bold text-red-700">{escalationRate.toFixed(1)}%</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-800">Total Op. Time</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">{(totalOperationalTime / 60).toFixed(0)} hrs</p>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <AgentEscalationTracker data={filteredData} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <CallDurationChart data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default Operations;
