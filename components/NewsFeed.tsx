import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { fetchStateNews } from '../services/geminiService';

interface NewsFeedProps {
    selectedState: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ selectedState }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedState) return;

    const loadNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newsArticles = await fetchStateNews(selectedState);
        setArticles(newsArticles);
      } catch (err) {
        setError("Couldn't load the latest news. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadNews();
  }, [selectedState]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-600">{error}</p>;
    }

    if (articles.length === 0) {
      return <p className="text-center text-gray-500">No recent news found.</p>;
    }

    return (
      <ul className="space-y-3">
        {articles.map((article, index) => (
          <li key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-blue-700 hover:underline hover:text-blue-800 transition-colors"
            >
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Latest {selectedState} News</h3>
      {renderContent()}
    </div>
  );
};

export default NewsFeed;
