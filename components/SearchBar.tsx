
import React from 'react';
import { GrantType } from '../types';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: GrantType | 'All';
  setFilterType: (type: GrantType | 'All') => void;
  onClearFilters: () => void;
  hasResults: boolean;
  isDashboardVisible: boolean;
  onToggleDashboard: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  onClearFilters,
  hasResults,
  isDashboardVisible,
  onToggleDashboard,
}) => {
  const showClearButton = searchTerm.length > 0 || filterType !== 'All';
  const customSelectArrow = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-full sm:flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Filter displayed grants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      <div className="w-full sm:w-auto">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as GrantType | 'All')}
          className="w-full sm:w-48 pl-4 pr-10 py-2.5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-700 text-white appearance-none bg-no-repeat bg-right"
          style={customSelectArrow}
        >
          <option value="All">All Types</option>
          <option value={GrantType.FEDERAL}>Federal</option>
          <option value={GrantType.STATE}>State</option>
          <option value={GrantType.CORPORATE}>Corporate</option>
          <option value={GrantType.OTHER}>Other</option>
        </select>
      </div>
      {hasResults && (
        <button
            onClick={onToggleDashboard}
            className="w-full sm:w-auto px-4 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            aria-expanded={isDashboardVisible}
            aria-controls="dashboard-section"
        >
            {isDashboardVisible ? 'Hide Calendar & News' : 'Show Calendar & News'}
        </button>
      )}
      {showClearButton && (
        <button
            onClick={onClearFilters}
            className="w-full sm:w-auto px-4 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            aria-label="Clear filters"
          >
            Clear Filters
          </button>
      )}
    </div>
  );
};

export default SearchBar;
