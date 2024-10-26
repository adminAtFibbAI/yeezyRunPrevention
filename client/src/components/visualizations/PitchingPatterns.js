import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const PitchingPatterns = ({ data }) => {
  const PITCH_COLORS = {
    'Fastball': '#ef4444',
    'Slider': '#3b82f6',
    'Changeup': '#10b981',
    'Curveball': '#8b5cf6',
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded border">
        <div className="font-medium">{data.pitch_type}</div>
        <div className="text-sm text-gray-600">
          <div>Velocity: {data.velocity} mph</div>
          <div>Spin Rate: {data.spin_rate} rpm</div>
          <div>Movement: {data.movement}″</div>
          <div>Result: {data.result}</div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pitch Patterns Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                dataKey="horizontal_break" 
                name="Horizontal Break" 
                unit="in" 
                domain={['auto', 'auto']} 
              />
              <YAxis 
                dataKey="vertical_break" 
                name="Vertical Break" 
                unit="in" 
                domain={['auto', 'auto']} 
              />
              <ZAxis 
                dataKey="velocity" 
                range={[50, 400]} 
                name="Velocity" 
                unit="mph" 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.entries(PITCH_COLORS).map(([pitch, color]) => (
                <Scatter
                  key={pitch}
                  name={pitch}
                  data={data.filter(d => d.pitch_type === pitch)}
                  fill={color}
                  shape="circle"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchingPatterns;