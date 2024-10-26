import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const ZoneAnalysis = ({ pitchData, width = 400, height = 500 }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneStats, setZoneStats] = useState({});
  
  const ZONES = {
    HIGH: { y: [2.5, 4], label: 'High' },
    MIDDLE: { y: [1.5, 2.5], label: 'Middle' },
    LOW: { y: [0, 1.5], label: 'Low' },
    INSIDE: { x: [0, 1.5], label: 'Inside' },
    MIDDLE_X: { x: [1.5, 2.5], label: 'Center' },
    OUTSIDE: { x: [2.5, 4], label: 'Outside' }
  };

  useEffect(() => {
    calculateZoneStats();
  }, [pitchData]);

  const calculateZoneStats = () => {
    const stats = {};
    Object.entries(ZONES).forEach(([zoneKey, zoneData]) => {
      const zonePitches = pitchData.filter(pitch => isInZone(pitch, zoneData));
      stats[zoneKey] = {
        totalPitches: zonePitches.length,
        strikes: zonePitches.filter(p => p.result === 'strike').length,
        whiffs: zonePitches.filter(p => p.result === 'swinging_strike').length,
        avgVelocity: calculateAverage(zonePitches, 'velocity'),
        avgSpinRate: calculateAverage(zonePitches, 'spin_rate')
      };
    });
    setZoneStats(stats);
  };

  const ZoneBox = ({ zone, stats }) => (
    <motion.div
      className={`border ${selectedZone === zone ? 'border-blue-500' : 'border-gray-300'}`}
      onClick={() => setSelectedZone(zone)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="p-2 text-xs">
        <div className="font-medium">{stats.totalPitches} pitches</div>
        <div className="text-gray-500">
          {((stats.strikes + stats.whiffs) / stats.totalPitches * 100).toFixed(1)}% strikes
        </div>
      </div>
    </motion.div>
  );

  const ZoneDetails = ({ zone, stats }) => (
    <AnimatePresence>
      {selectedZone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-t-lg"
        >
          <h3 className="font-medium mb-2">{ZONES[zone].label} Zone Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Pitch Distribution</div>
              <div className="text-lg font-medium">{stats.totalPitches} pitches</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Strike Rate</div>
              <div className="text-lg font-medium">
                {((stats.strikes + stats.whiffs) / stats.totalPitches * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg Velocity</div>
              <div className="text-lg font-medium">{stats.avgVelocity.toFixed(1)} mph</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg Spin Rate</div>
              <div className="text-lg font-medium">{stats.avgSpinRate.toFixed(0)} rpm</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ width, height }}>
          {/* Strike Zone Grid */}
          <div className="grid grid-cols-3 absolute inset-0">
            {Object.entries(ZONES).map(([zone, data]) => (
              <ZoneBox key={zone} zone={zone} stats={zoneStats[zone]} />
            ))}
          </div>

          {/* Pitch Plots */}
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" domain={[0, 4]} hide />
              <YAxis type="number" dataKey="y" domain={[0, 4]} hide />
              <ZAxis type="number" dataKey="velocity" range={[2, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                data={pitchData}
                fill="#8884d8"
                animationDuration={500}
              />
            </ScatterChart>
          </ResponsiveContainer>

          {/* Zone Details Overlay */}
          <ZoneDetails zone={selectedZone} stats={zoneStats[selectedZone]} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoneAnalysis;