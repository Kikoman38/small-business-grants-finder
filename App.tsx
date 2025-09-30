import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Grant, GrantType, Article } from './types';
import { fetchGrants } from './services/geminiService';
import { US_STATES } from './constants';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import GrantCard from './components/GrantCard';
import AnimatedLoader from './components/AnimatedLoader';
import ErrorDisplay from './components/ErrorDisplay';
import Dashboard from './components/Dashboard';
import SourceList from './components/SourceList';

type Status = 'initial' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [status, setStatus] = useState<Status>('initial');
  const [grants, setGrants] = useState<Grant[]>([]);
  const [sources, setSources] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');

  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<GrantType | 'All'>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // User persistence states
  const [favoritedGrants, setFavoritedGrants] = useState<Set<string>>(() => {
    try {
      const item = window.localStorage.getItem('favoritedGrants');
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
      return new Set();
    }
  });
  const [grantRatings, setGrantRatings] = useState<Record<string, number>>(() => {
    try {
      const item = window.localStorage.getItem('grantRatings');
      return item ? JSON.parse(item) : {};
    } catch (error) {
      console.error('Error reading ratings from localStorage', error);
      return {};
    }
  });
  
  // UI State
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);


  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    try {
      window.localStorage.setItem('favoritedGrants', JSON.stringify(Array.from(favoritedGrants)));
    } catch (error) {
      console.error('Error saving favorites to localStorage', error);
    }
  }, [favoritedGrants]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem('grantRatings', JSON.stringify(grantRatings));
    } catch (error) {
      console.error('Error saving ratings to localStorage', error);
    }
  }, [grantRatings]);

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleFetchGrants = useCallback(async (state: string) => {
    if (!state) return;
    setStatus('loading');
    setError(null);
    try {
      const { grants: fetchedGrants, sources: fetchedSources } = await fetchGrants(state);
      setGrants(fetchedGrants);
      setSources(fetchedSources);
      setStatus('success');
      if (fetchedGrants.length > 0) {
        triggerConfetti();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus('error');
      console.error(err);
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterType('All');
    setShowFavoritesOnly(false);
  }, []);

  const handleToggleFavorite = useCallback((grantName: string) => {
    setFavoritedGrants(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(grantName)) {
        newFavorites.delete(grantName);
      } else {
        newFavorites.add(grantName);
      }
      return newFavorites;
    });
  }, []);

  const handleRateGrant = useCallback((grantName: string, rating: number) => {
    setGrantRatings(prev => ({
      ...prev,
      [grantName]: rating,
    }));
  }, []);

  const handleToggleDashboard = useCallback(() => {
    setIsDashboardVisible(prev => !prev);
  }, []);


  const filteredGrants = useMemo(() => {
    return grants.filter(grant => {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      
      const matchesType = filterType === 'All' || grant.type === filterType;
      const matchesFavorite = !showFavoritesOnly || favoritedGrants.has(grant.name);

      if (!matchesType || !matchesFavorite) {
        return false;
      }
      
      if (searchLower === '') {
        return true;
      }

      const searchWords = searchLower.split(' ').filter(Boolean);
      const grantText = [
        grant.name,
        grant.description,
        grant.eligibility,
      ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

      return searchWords.every(word => grantText.includes(word));
    });
  }, [grants, debouncedSearchTerm, filterType, showFavoritesOnly, favoritedGrants]);

  const renderContent = () => {
    const customSelectArrow = {
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    };
    switch (status) {
      case 'initial':
        return (
          <div className="text-center max-w-3xl mx-auto mt-16">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
              Find Federal & State Grants
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Select your state to begin your search for federal and state-specific grant opportunities.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full sm:w-auto flex-grow pl-4 pr-10 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-800 appearance-none bg-no-repeat bg-right"
                style={customSelectArrow}
                aria-label="Select your state"
              >
                <option value="">Select a State...</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleFetchGrants(selectedState)}
                disabled={!selectedState}
                className="w-full sm:w-auto bg-blue-600 text-white font-bold py-4 px-10 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                Find Grants
              </button>
            </div>
          </div>
        );
      case 'loading':
        return <div className="mt-8"><AnimatedLoader /></div>;
      case 'error':
        return <div className="mt-8"><ErrorDisplay error={error || 'An error occurred.'} onRetry={() => handleFetchGrants(selectedState)} /></div>;
      case 'success':
        return (
          <>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              onClearFilters={handleClearFilters}
              hasResults={grants.length > 0}
              isDashboardVisible={isDashboardVisible}
              onToggleDashboard={handleToggleDashboard}
            />
            <SourceList sources={sources} />
             {isDashboardVisible && (
              <section id="dashboard-section">
                <Dashboard grants={filteredGrants} selectedState={selectedState} />
              </section>
             )}
            {filteredGrants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {filteredGrants.map((grant) => (
                  <GrantCard
                    key={grant.name}
                    grant={grant}
                    searchTerm={debouncedSearchTerm}
                    rating={grantRatings[grant.name] || 0}
                    onRate={(rating) => handleRateGrant(grant.name, rating)}
                    isFavorited={favoritedGrants.has(grant.name)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-md mt-8">
                <h3 className="text-2xl font-semibold text-gray-700">No Grants Found</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  Try broadening your search or adjusting your filters to find what you're looking for.
                </p>
                <button
                    onClick={handleClearFilters}
                    className="mt-6 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                >
                    Clear All Filters
                </button>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header selectedState={selectedState} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
