import { useState } from 'react';
import SortingVisualizer from './components/SortingVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

type Tab = 'sorting' | 'graph';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
    </button>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sorting');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
        <ThemeToggle />
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-gray-200">
            Algorithm Visualizer
          </h1>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
            <button
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'sorting'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('sorting')}
            >
              Sorting Algorithms
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'graph'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('graph')}
            >
              Graph Algorithms
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 transition-colors duration-200">
            {activeTab === 'sorting' ? <SortingVisualizer /> : <GraphVisualizer />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
