import React from 'react';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import MetricsGrid from './MetricsGrid';
import ChartView from './ChartView';
import AnalysisPanel from './AnalysisPanel';
import { Card } from '../ui/Card';

const Dashboard = () => {
  const loading = useSelector((state) => state.baseball.loading);
  const error = useSelector((state) => state.baseball.error);

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <SearchBar />
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <MetricsGrid />
        <ChartView />
        <AnalysisPanel />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;