import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { motion } from 'framer-motion';

const TrajectoryAnalysis = ({ pitchData }) => {
  const trajectoryPoints = useMemo(() => {
    return pitchData.map(pitch => {
      // Calculate trajectory points using physics formulas
      const points = calculateTrajectoryPoints(
        pitch.initial_velocity,
        pitch.spin_rate,
        pitch.spin_axis,
        pitch.release_point
      );
      return { ...pitch, trajectory: points };
    });
  }, [pitchData]);

  const calculateTrajectoryPoints = (velocity, spinRate, spinAxis, releasePoint) => {
    const points = [];
    const timeStep = 0.01; // 10ms intervals
    const totalTime = 0.4; // 400ms total flight time

    for (let t = 0; t <= totalTime; t += timeStep) {
      const position = calculatePosition(
        velocity,
        spinRate,
        spinAxis,
        releasePoint,
        t
      );
      points.push(position);
    }
    return points;
  };

  const calculatePosition = (v0, spinRate, spinAxis, release, t) => {
    // Basic physics calculations with Magnus effect
    const g = 9.81; // gravity
    const x = release.x + v0.x * t;
    const y = release.y + v0.y * t - 0.5 * g * t * t;
    const z = release.z + v0.z * t + calculateMagnusEffect(spinRate, spinAxis, t);
    return { x, y, z, t };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pitch Trajectory Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer>
            <div className="relative">
              {/* 3D Canvas View */}
              <canvas
                className="absolute inset-0"
                ref={canvasRef}
                width={width}
                height={height}
              />
              
              {/* Trajectory Lines */}
              {trajectoryPoints.map((pitch, index) => (
                <motion.path
                  key={index}
                  d={generatePathD(pitch.trajectory)}
                  stroke={getPitchTypeColor(pitch.type)}
                  strokeWidth={2}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ))}

              {/* Strike Zone Overlay */}
              <div className="absolute border-2 border-gray-400 opacity-50">
                {/* Strike zone grid */}
                <div className="grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-gray-300" />
                  ))}
                </div>
              </div>

              {/* Data Points */}
              {trajectoryPoints.map((pitch, pitchIndex) => (
                pitch.trajectory.map((point, pointIndex) => (
                  <motion.div
                    key={`${pitchIndex}-${pointIndex}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: getPitchTypeColor(pitch.type),
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: pointIndex * 0.02 }}
                  />
                ))
              ))}
            </div>
          </ResponsiveContainer>
        </div>

        {/* Controls & Info */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setViewAngle('side')}
              className="px-3 py-1 rounded bg-blue-500 text-white"
            >
              Side View
            </button>
            <button
              onClick={() => setViewAngle('top')}
              className="px-3 py-1 rounded bg-blue-500 text-white"
            >
              Top View
            </button>
          </div>
          
          <div className="flex gap-4 items-center">
            {Object.entries(PITCH_TYPES).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrajectoryAnalysis;