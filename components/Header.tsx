
import React from 'react';

interface HeaderProps {
    selectedState?: string;
}

const Header: React.FC<HeaderProps> = ({ selectedState }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                G
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                Small Business Grants Finder
                {selectedState && <span className="text-blue-600 font-semibold"> for {selectedState}</span>}
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
