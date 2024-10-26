import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Yeezy Run Prevention Analytics
          </h1>
          <Dashboard />
        </div>
      </div>
    </Provider>
  );
}

export default App;