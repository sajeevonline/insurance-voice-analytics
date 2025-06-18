
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, Settings, Home, Menu } from 'lucide-react';
import { useState } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { callData } from '@/data/callData';
import FilterPanel from '@/components/FilterPanel';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { filters, setFilters, filteredData } = useFilters(callData);
  
  const navItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/customer-analytics', label: 'Customer Analytics', icon: Users },
    { path: '/agent-performance', label: 'Agent Performance', icon: TrendingUp },
    { path: '/operations', label: 'Operations', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Voice Analytics
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">AI-powered customer insights</p>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`bg-white/80 backdrop-blur-lg border-b border-white/20 md:block ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 py-4 md:py-0">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 md:py-4 text-sm font-medium rounded-lg md:rounded-none md:border-b-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 md:bg-transparent md:border-blue-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 md:hover:bg-transparent md:border-transparent md:hover:border-gray-300'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Panel */}
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
          
          {/* Page Content with Filter Context */}
          <div data-filtered-data={JSON.stringify(filteredData)}>
            <Outlet context={{ filteredData, filters }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
