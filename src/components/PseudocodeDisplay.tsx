import React from 'react';

interface PseudocodeDisplayProps {
  code: string[];
  highlightedLine?: number;
  className?: string;
}

const PseudocodeDisplay: React.FC<PseudocodeDisplayProps> = ({
  code,
  highlightedLine,
  className = '',
}) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 font-mono text-sm ${className}`}>
      <div className="overflow-auto max-h-[500px]">
        {code.map((line, index) => (
          <div
            key={index}
            className={`py-1 px-2 ${
              index === highlightedLine
                ? 'bg-blue-600 text-white'
                : 'text-gray-300'
            }`}
          >
            <span className="text-gray-500 mr-4">{index + 1}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PseudocodeDisplay; 