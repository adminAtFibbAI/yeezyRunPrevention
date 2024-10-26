import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <Loader className={`animate-spin ${sizeClasses[size]}`} />
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
      <LoadingSpinner size="large" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export const LoadingCard = ({ message = 'Loading data...', className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex justify-center">
        <LoadingSpinner size="small" />
        <span className="ml-2 text-gray-500">{message}</span>
      </div>
    </div>
  </div>
);

export const LoadingSkeleton = ({ rows = 3 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ))}
  </div>
);