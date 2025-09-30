
import React, { useState } from 'react';
import StarIcon from './icons/StarIcon';

interface StarRatingProps {
  rating: number;
  onRatingChange: (newRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (index: number) => {
    // Allow un-rating by clicking the same star again
    const newRating = rating === index + 1 ? 0 : index + 1;
    onRatingChange(newRating);
  };

  return (
    <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);
        
        return (
          <button
            key={index}
            type="button"
            className="focus:outline-none"
            onMouseEnter={() => setHoverRating(starValue)}
            onClick={() => handleRatingClick(index)}
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <StarIcon
              filled={isFilled}
              className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                isFilled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
