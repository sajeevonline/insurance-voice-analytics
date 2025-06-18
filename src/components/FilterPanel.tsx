
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter } from 'lucide-react';
import { Filters } from '@/hooks/useFilters';

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </label>
          <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Insurance Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Insurance Type
          </label>
          <Select value={filters.policyType} onValueChange={(value) => handleFilterChange('policyType', value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="auto">Auto Insurance</SelectItem>
              <SelectItem value="home">Home Insurance</SelectItem>
              <SelectItem value="life">Life Insurance</SelectItem>
              <SelectItem value="health">Health Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agent Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Agent
          </label>
          <Select value={filters.agent} onValueChange={(value) => handleFilterChange('agent', value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="AGT001">Sarah Johnson</SelectItem>
              <SelectItem value="AGT002">Mike Chen</SelectItem>
              <SelectItem value="AGT003">Emily Rodriguez</SelectItem>
              <SelectItem value="AGT004">David Kim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sentiment Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Sentiment
          </label>
          <Select value={filters.sentiment} onValueChange={(value) => handleFilterChange('sentiment', value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select sentiment" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="all">All Sentiments</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
