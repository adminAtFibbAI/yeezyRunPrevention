import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ANALYSIS_TYPES } from '../../utils/constants';
import { runRAnalysis } from '../../features/baseball/baseballSlice';
import { BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';

const AnalysisPanel = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.baseball.stats);
  const rAnalysis = useSelector((state) => state.baseball.rAnalysis);
  const loading = useSelector((state) => state.baseball.loading);

  const handleRunAnalysis = (type) => {
    dispatch(runRAnalysis({ type, data: stats }));
  };

  const renderAnalysisResults = () => {
    if (!rAnalysis) return null;

    switch (rAnalysis.type) {
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Distribution Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Mean:</span>
                  <span className="font-medium">{rAnalysis.results.mean.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Median:</span>
                  <span className="font-medium">{rAnalysis.results.median.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Deviation:</span>
                  <span className="font-medium">{rAnalysis.results.sd.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Quantile Distribution</h4>
              <div className="space-y-2">
                {rAnalysis.results.quantiles.map((value, index) => (
                  <div key={index} className="flex justify-between">
                    <span>Q{index + 1}:</span>
                    <span className="font-medium">{value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Advanced Metrics</h4>
              <div className="space-y-2">
                {Object.entries(rAnalysis.results).map(([key, value]) => (
                  key !== 'pitch_values' && (
                    <div key={key} className="flex justify-between">
                      <span>{key.toUpperCase()}:</span>
                      <span className="font-medium">{value.toFixed(2)}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Pitch Values</h4>
              <div className="space-y-2">
                {Object.entries(rAnalysis.results.pitch_values || {}).map(([pitch, value]) => (
                  <div key={pitch} className="flex justify-between">
                    <span className="capitalize">{pitch}:</span>
                    <span className={`font-medium ${value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {value > 0 ? '+' : ''}{value.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <p className="ml-3 text-yellow-700">
                Unsupported analysis type or invalid results format.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistical Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(ANALYSIS_TYPES).map(([type, label]) => (
            <button
              key={type}
              onClick={() => handleRunAnalysis(type)}
              disabled={loading || !stats.length}
              className={`
                inline-flex items-center px-4 py-2 rounded-lg
                ${loading || !stats.length
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}
                transition-colors duration-200
              `}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {!stats.length ? (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
            <p className="text-gray-700">
              Search for a player to view statistical analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {renderAnalysisResults()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisPanel;