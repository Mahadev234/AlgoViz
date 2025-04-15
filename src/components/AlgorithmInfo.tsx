import React from 'react';
import Tooltip from './Tooltip';

interface AlgorithmInfoProps {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  currentStep?: string;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({
  name,
  timeComplexity,
  spaceComplexity,
  description,
  currentStep,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow transition-colors duration-200">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{name}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Time Complexity:</span>
          <Tooltip content="The time complexity describes how the runtime grows with input size">
            <span className="ml-2 font-mono text-blue-600 dark:text-blue-400">{timeComplexity}</span>
          </Tooltip>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Space Complexity:</span>
          <Tooltip content="The space complexity describes how much memory the algorithm uses">
            <span className="ml-2 font-mono text-blue-600 dark:text-blue-400">{spaceComplexity}</span>
          </Tooltip>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
      {currentStep && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded transition-colors duration-200">
          <span className="text-blue-600 dark:text-blue-400 font-medium">Current Step:</span>
          <p className="text-blue-700 dark:text-blue-300 mt-1">{currentStep}</p>
        </div>
      )}
    </div>
  );
};

export default AlgorithmInfo; 