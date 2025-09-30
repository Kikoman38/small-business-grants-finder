import React, { useState } from 'react';
import { Article } from '../types';
import InfoIcon from './icons/InfoIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

const SourceList: React.FC<{ sources: Article[] }> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="my-6 bg-gray-100 border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        aria-expanded={isOpen}
        aria-controls="source-list"
      >
        <div className="flex items-center">
          <InfoIcon className="w-5 h-5 text-gray-600 mr-2" />
          <span className="font-semibold text-gray-700">View Data Sources ({sources.length})</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div id="source-list" className="px-4 pb-4 border-t border-gray-200">
          <ul className="space-y-2 list-disc list-inside mt-3">
            {sources.map((source, index) => (
              <li key={index} className="text-sm">
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" title={source.url}>
                  {source.title || source.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SourceList;
