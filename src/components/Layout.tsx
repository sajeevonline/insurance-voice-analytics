
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, Settings, Home } from 'lucide-react';

const Layout = () => {
  const navItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/customer-analytics', label: 'Customer Analytics', icon: Users },
    { path: '/agent-performance', label: 'Agent Performance', icon: TrendingUp },
    { path: '/operations', label: 'Operations', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Insurance Call Analytics</h1>
          <p className="text-gray-600">Comprehensive insights from customer-agent interactions</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
