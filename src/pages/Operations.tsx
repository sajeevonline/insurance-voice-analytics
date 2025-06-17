
import React from 'react';
import { callData } from '@/data/callData';
import AgentEscalationTracker from '@/components/AgentEscalationTracker';
import CallDurationChart from '@/components/CallDurationChart';
import { BarChart3 } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';

const Operations = () => {
  const { filteredData } = useFilters(callData);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Operations Analytics
        </h2>
        <p className="text-gray-600">Call duration trends, escalation patterns, and operational efficiency</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentEscalationTracker data={filteredData} />
        <CallDurationChart data={filteredData} />
      </div>
    </div>
  );
};

export default Operations;
