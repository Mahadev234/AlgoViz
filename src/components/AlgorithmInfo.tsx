import React from 'react';
import Tooltip from './Tooltip';

interface Algorithm {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}

interface AlgorithmInfoProps {
  algorithm: Algorithm;
  currentStep?: string;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({
  algorithm,
  currentStep,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
        {algorithm.name}
      </h3>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <span className="text-gray-400">Time Complexity:</span>
          <Tooltip content="The time complexity describes how the runtime grows with input size">
            <span className="ml-2 font-mono text-blue-400">{algorithm.timeComplexity}</span>
          </Tooltip>
        </div>
        <div>
          <span className="text-gray-400">Space Complexity:</span>
          <Tooltip content="The space complexity describes how much memory the algorithm uses">
            <span className="ml-2 font-mono text-blue-400">{algorithm.spaceComplexity}</span>
          </Tooltip>
        </div>
      </div>
      <p className="text-gray-300 mb-6">{algorithm.description}</p>
      {currentStep && (
        <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800/50">
          <span className="text-blue-400 font-medium">Current Step:</span>
          <p className="text-blue-300 mt-2">{currentStep}</p>
        </div>
      )}
    </div>
  );
};

export default AlgorithmInfo; 