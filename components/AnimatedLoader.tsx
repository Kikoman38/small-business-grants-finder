
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Digging through the database for grants...",
  "Analyzing opportunities and deadlines...",
  "Unearthing the best matches for you...",
  "Polishing the results...",
];

const AnimatedLoader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="w-full max-w-sm">
        <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
          {/* The "ground" or document area */}
          <rect x="0" y="75" width="200" height="25" fill="#f3f4f6" />
          <line x1="0" y1="75" x2="200" y2="75" stroke="#e5e7eb" strokeWidth="1"/>

          {/* The path for the digger to follow */}
          <path
            id="search-path"
            d="M 10 75 C 50 25, 150 125, 190 75"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            fill="none"
          />

          {/* The digger (magnifying glass) */}
          <g>
            {/* Magnifying glass icon, scaled and positioned */}
            <g transform="scale(0.12) translate(-50 -60)">
              <circle cx="50" cy="50" r="35" stroke="#3b82f6" strokeWidth="12" fill="none" />
              <line x1="75" y1="80" x2="110" y2="115" stroke="#3b82f6" strokeWidth="15" strokeLinecap="round" />
            </g>
            <animateMotion dur="3.5s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1">
              <mpath href="#search-path" />
            </animateMotion>
          </g>
        </svg>
      </div>
      <p className="mt-4 text-xl font-semibold text-gray-700 transition-opacity duration-500 ease-in-out">
        {loadingMessages[messageIndex]}
      </p>
       <p className="mt-2 text-sm text-gray-500">
        This can take a moment. Thanks for your patience.
      </p>
    </div>
  );
};

export default AnimatedLoader;
