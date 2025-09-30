
import React from 'react';
import { Grant, GrantType } from '../types';
import AwardIcon from './icons/AwardIcon';
import DeadlineIcon from './icons/DeadlineIcon';
import EligibilityIcon from './icons/EligibilityIcon';
import StarRating from './StarRating';
import StarIcon from './icons/StarIcon';

interface GrantCardProps {
  grant: Grant;
  searchTerm: string;
  rating: number;
  onRate: (rating: number) => void;
  isFavorited: boolean;
  onToggleFavorite: (grantName: string) => void;
}

const typeColorMap: Record<GrantType, string> = {
  [GrantType.FEDERAL]: 'bg-blue-100 text-blue-800',
  [GrantType.STATE]: 'bg-green-100 text-green-800',
  [GrantType.CORPORATE]: 'bg-purple-100 text-purple-800',
  [GrantType.OTHER]: 'bg-yellow-100 text-yellow-800',
};

const highlightText = (text: string | undefined, highlight: string): React.ReactNode => {
  if (!text) return '';
  const trimmedHighlight = highlight.trim();
  if (!trimmedHighlight) {
    return text;
  }

  const searchWords = trimmedHighlight.split(' ').filter(Boolean);
  if (searchWords.length === 0) {
    return text;
  }
  
  const escapedWords = searchWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(escapedWords.join('|'), 'gi');

  const matches = [...text.matchAll(regex)];
  if (!matches.length) {
    return text;
  }

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    if (match.index !== undefined) {
      if (match.index > lastIndex) {
        result.push(text.substring(lastIndex, match.index));
      }
      result.push(
        <mark key={index} className="bg-yellow-200 text-black rounded px-1 py-0.5">
          {match[0]}
        </mark>
      );
      lastIndex = match.index + match[0].length;
    }
  });

  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }
  
  return <>{result}</>;
};


const isClosingSoon = (deadline: string | undefined): boolean => {
    if (!deadline) {
      return false;
    }
  
    const nonDateKeywords = ['varies', 'n/a', 'ongoing'];
    if (nonDateKeywords.some(keyword => deadline.toLowerCase().includes(keyword))) {
      return false;
    }
  
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return false;
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (deadlineDate < today) {
      return false;
    }
  
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
  
    return deadlineDate <= thirtyDaysFromNow;
};


const GrantCard: React.FC<GrantCardProps> = ({ grant, searchTerm, rating, onRate, isFavorited, onToggleFavorite }) => {
  const hasDetails = grant.awardAmount || grant.eligibility || grant.deadline;
  const closingSoon = isClosingSoon(grant.deadline);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800 sm:pr-2">{highlightText(grant.name, searchTerm)}</h3>
            <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0 sm:ml-2">
                <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    typeColorMap[grant.type] || typeColorMap[GrantType.OTHER]
                    }`}
                >
                    {grant.type}
                </span>
                <button
                    onClick={() => onToggleFavorite(grant.name)}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-500"
                >
                    <StarIcon 
                        filled={isFavorited} 
                        className={`w-5 h-5 ${isFavorited ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-500'}`}
                    />
                </button>
            </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          {highlightText(grant.description, searchTerm)}
        </p>
        
        {hasDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ul className="space-y-3 text-sm text-gray-700">
              {grant.awardAmount && (
                <li className="flex items-start">
                  <AwardIcon className="h-5 w-5 text-green-500 mr-2.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Award:</span> {grant.awardAmount}
                  </div>
                </li>
              )}
              {grant.eligibility && (
                <li className="flex items-start">
                  <EligibilityIcon className="h-5 w-5 text-blue-500 mr-2.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Eligibility:</span> {highlightText(grant.eligibility, searchTerm)}
                  </div>
                </li>
              )}
              {grant.deadline && (
                <li className="flex items-start">
                  <DeadlineIcon className="h-5 w-5 text-red-500 mr-2.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Deadline:</span> {grant.deadline}
                    {closingSoon && (
                        <span className="ml-2 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full uppercase">
                            Closing Soon
                        </span>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <StarRating rating={rating} onRatingChange={onRate} />
        <a
          href={grant.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
        >
          Visit Website
          <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </a>
      </div>
    </div>
  );
};

export default GrantCard;