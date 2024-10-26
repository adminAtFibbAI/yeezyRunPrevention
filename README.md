# yeezyRunPrevention
automating run prevention tasks for mlb teams
i am currently a milb bullpen catcher looking for mlb bullpen catcher opportunities. I have a cs degree from stanford and extensive experience working and managing data scientists

# Baseball Analytics Dashboard

A React-based analytics dashboard for baseball statistics with R integration.

## Features

- Player statistics visualization
- R-powered statistical analysis
- Redux state management
- Recharts integration
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Technology Stack

- React
- Redux Toolkit
- Recharts
- TailwindCSS
- R (backend integration)

## Note

The R integration requires a separate backend service. See the `/server` directory for R implementation details.

# Baseball Analytics Dashboard Documentation

## Architecture Overview

The application follows a modern React architecture with Redux for state management and R integration for advanced statistics.

### Core Technologies
- React 18+ with Hooks
- Redux Toolkit for state management
- R for statistical analysis
- Recharts for visualizations
- TailwindCSS for styling

### Directory Structure
```
/src
├── components/       # React components
├── features/        # Redux slices and related logic
├── store/           # Redux store configuration
├── utils/           # Utility functions
├── services/        # API and R service integration
├── hooks/           # Custom React hooks
└── tests/           # Test files
```

### Data Flow
1. User interactions trigger Redux actions
2. Actions may call API endpoints or R services
3. Results are stored in Redux state
4. Components react to state changes

## Getting Started

### Prerequisites
- Node.js 18+
- R 4.0+
- Required R packages:
  - baseballr
  - tidyverse
  - caret
  - stats

### Installation
```bash
# Install dependencies
npm install

# Set up R environment
Rscript setup/install_packages.R

# Start development server
npm start
```

### Environment Setup
Configure the following environment variables:
- `REACT_APP_API_URL`: Backend API endpoint
- `REACT_APP_R_SERVICE_URL`: R service endpoint
- `REACT_APP_ENVIRONMENT`: Development/production

## Key Features

### Statistical Analysis
- Basic statistics (mean, median, SD)
- Advanced metrics (xFIP, SIERA)
- Pitch clustering
- Predictive modeling

### Data Visualization
- Time series analysis
- Heat maps
- Performance comparisons
- Trend analysis

### Performance Optimizations
- Data caching
- Memoization
- Lazy loading
- Request throttling

## API Documentation

### REST Endpoints

#### Player Search
```
GET /api/statcast/search?player={query}
```

#### Player Statistics
```
GET /api/statcast/player/{playerId}/{year}
```

#### R Analysis
```
POST /api/r-analysis/{type}
```

## Testing Strategy

### Unit Tests
- Component testing
- Redux logic
- Utility functions

### Integration Tests
- API integration
- R service integration
- State management

### E2E Tests
- User workflows
- Data visualization
- Performance metrics
