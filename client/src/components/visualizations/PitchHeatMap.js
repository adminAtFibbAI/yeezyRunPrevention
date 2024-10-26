import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const PitchHeatMap = ({ data, width = 300, height = 400 }) => {
  const ZONE_SIZE = 20;
  const STRIKE_ZONE = {
    top: height * 0.3,
    bottom: height * 0.7,
    left: width * 0.3,
    right: width * 0.7
  };

  const heatmapData = useMemo(() => {
    const zones = {};
    data.forEach(pitch => {
      const key = `${Math.floor(pitch.x / ZONE_SIZE)}_${Math.floor(pitch.y / ZONE_SIZE)}`;
      if (!zones[key]) {
        zones[key] = { count: 0, success: 0 };
      }
      zones[key].count++;
      if (pitch.result === 'strike' || pitch.result === 'swinging_strike') {
        zones[key].success++;
      }
    });
    return zones;
  }, [data]);

  const getColor = (success, total) => {
    const rate = success / total;
    const hue = rate * 120; // 0 is red, 120 is green
    return `hsla(${hue}, 70%, 50%, 0.6)`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pitch Location Heat Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ width, height }}>
          {/* Strike zone */}
          <div
            className="absolute border-2 border-gray-400"
            style={{
              left: STRIKE_ZONE.left,
              right: STRIKE_ZONE.right,
              top: STRIKE_ZONE.top,
              bottom: STRIKE_ZONE.bottom
            }}
          />

          {/* Heat map cells */}
          {Object.entries(heatmapData).map(([key, data]) => {
            const [x, y] = key.split('_').map(Number);
            return (
              <div
                key={key}
                className="absolute"
                style={{
                  left: x * ZONE_SIZE,
                  top: y * ZONE_SIZE,
                  width: ZONE_SIZE,
                  height: ZONE_SIZE,
                  backgroundColor: getColor(data.success, data.count),
                  transform: 'translate(-50%, -50%)'
                }}
              />
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-0 right-0 bg-white p-2 rounded shadow">
            <div className="text-sm font-medium mb-1">Success Rate</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4" style={{ backgroundColor: 'hsla(0, 70%, 50%, 0.6)' }} />
              <span>Low</span>
              <div className="w-4 h-4" style={{ backgroundColor: 'hsla(120, 70%, 50%, 0.6)' }} />
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchHeatMap;