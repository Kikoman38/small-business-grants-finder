import React from 'react';

interface IconProps {
    className?: string;
}

const AwardIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m0-6h.01M6 12H5m14 0h-1M12 18a6 6 0 100-12 6 6 0 000 12z" 
      />
    </svg>
  );
};

export default AwardIcon;
