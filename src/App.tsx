import { useState } from 'react';
import SortingVisualizer from './components/SortingVisualizer';
import GraphVisualizer from './components/GraphVisualizer';

type Tab = 'sorting' | 'graph';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sorting');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Algorithm Visualizer
        </h1>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-8 md:mb-12">
          <button
            className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'sorting'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('sorting')}
          >
            Sorting Algorithms
          </button>
          <button
            className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'graph'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('graph')}
          >
            Graph Algorithms
          </button>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm bg-opacity-50">
          {activeTab === 'sorting' ? <SortingVisualizer /> : <GraphVisualizer />}
        </div>
      </div>
    </div>
  );
}

export default App;
