import React, { useState } from 'react';
import SearchIcon from './icons/SearchIcon';

interface ResourceSearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  onClear: () => void;
  hasResults: boolean;
}

const ResourceSearchBar: React.FC<ResourceSearchBarProps> = ({ onSearch, isLoading, onClear, hasResults }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl mx-auto">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for grants like 'women-owned business grants'..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="submit"
          className="flex-1 sm:flex-none px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        {hasResults && (
            <button
                type="button"
                onClick={handleClear}
                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isLoading}
            >
                Clear
            </button>
        )}
      </div>
    </form>
  );
};

export default ResourceSearchBar;
