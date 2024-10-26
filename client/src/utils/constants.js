export const METRICS = {
    velocity: { 
      label: 'Velocity', 
      format: '0.0',
      goodValue: 95,
      unit: 'mph'
    },
    spin_rate: { 
      label: 'Spin Rate', 
      format: '0',
      goodValue: 2400,
      unit: 'rpm'
    },
    exit_velo: { 
      label: 'Exit Velocity', 
      format: '0.0',
      goodValue: 90,
      unit: 'mph'
    },
    launch_angle: { 
      label: 'Launch Angle', 
      format: '0.0',
      goodValue: 12,
      unit: '°'
    },
    whiff_rate: { 
      label: 'Whiff Rate', 
      format: '0.0',
      goodValue: 30,
      unit: '%'
    }
  };
  
  export const ANALYSIS_TYPES = {
    basic: 'Basic Statistics',
    advanced: 'Advanced Metrics',
    predictive: 'Predictive Models',
    clustering: 'Pitch Clustering'
  };
  
  export const VIEW_TYPES = {
    stats: 'Statistics',
    trends: 'Trends',
    comparison: 'Comparison'
  };