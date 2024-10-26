import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { METRICS } from '../../utils/constants';
import { setSelectedMetric } from '../../features/baseball/baseballSlice';

const MetricsGrid = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.baseball.stats);
  const selectedMetric = useSelector((state) => state.baseball.selectedMetric);

  const calculateAverage = (metric) => {
    if (!stats.length) return null;
    return stats.reduce((sum, stat) => sum + stat[metric], 0) / stats.length;
  };

  const calculateTrend = (metric) => {
    if (stats.length < 2) return null;
    const first = stats[0][metric];
    const last = stats[stats.length - 1][metric];
    const change = ((last - first) / first) * 100;
    return {
      direction: change > 0 ? 'up' : 'down',
      value: Math.abs(change)
    };
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Object.entries(METRICS).map(([key, info]) => {
        const average = calculateAverage(key);
        const trend = calculateTrend(key);
        
        return (
          <Card
            key={key}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg
              ${selectedMetric === key ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => dispatch(setSelectedMetric(key))}
          >
            <div className="p-4">
              <div className="text-sm text-gray-500 font-medium">
                {info.label}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xl font-bold">
                  {average !== null 
                    ? `${average.toFixed(info.format === '0' ? 0 : 1)}${info.unit}`
                    : '-'
                  }
                </div>
                {trend && (
                  <div className={`flex items-center gap-1 ${
                    trend.direction === 'up' 
                      ? info.goodValue > average ? 'text-green-500' : 'text-red-500'
                      : info.goodValue > average ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {trend.direction === 'up' 
                      ? <TrendingUp className="h-4 w-4" />
                      : <TrendingDown className="h-4 w-4" />
                    }
                    <span className="text-sm">{trend.value.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsGrid;