
import { useState, useMemo } from 'react';
import { CallRecord } from '@/data/callData';

export interface Filters {
  dateRange: string;
  agent: string;
  policyType: string;
  sentiment: string;
  outcome: string;
  segment: string;
}

export const useFilters = (data: CallRecord[]) => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    agent: 'all',
    policyType: 'all',
    sentiment: 'all',
    outcome: 'all',
    segment: 'all'
  });

  const filteredData = useMemo(() => {
    return data.filter(call => {
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
  }, [data, filters]);

  return { filters, setFilters, filteredData };
};
