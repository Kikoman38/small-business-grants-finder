import React from 'react';
import ErrorIcon from './icons/ErrorIcon';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto text-center bg-red-50 p-8 rounded-2xl shadow-lg border border-red-200">
      <ErrorIcon className="w-12 h-12 mx-auto text-red-400" />
      <h3 className="mt-4 text-2xl font-bold text-red-800">Oops! Something went wrong.</h3>
      <p className="mt-2 text-sm text-red-700 bg-red-100 p-3 rounded-md">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="mt-6 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;
