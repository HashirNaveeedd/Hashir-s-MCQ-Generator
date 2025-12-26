
import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="bg-indigo-600 p-2 rounded-lg mr-3 group-hover:bg-indigo-700 transition-colors">
              <i className="fas fa-brain text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Hashir's MCQs Generator
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <button onClick={onHomeClick} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Generator</button>
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <i className="fas fa-sun text-amber-400"></i>
              ) : (
                <i className="fas fa-moon"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
