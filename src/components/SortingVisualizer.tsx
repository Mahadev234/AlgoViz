import React, { useState, useRef, useEffect } from 'react';
import AlgorithmInfo from './AlgorithmInfo';
import PseudocodeDisplay from './PseudocodeDisplay';
import { SortingAlgorithms } from '../algorithms/sorting';
import { sortingPseudocode } from '../algorithms/pseudocode';
import { generateRandomArray } from '../algorithms/utils';
import { PlayIcon, PauseIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface Algorithm {
  name: string;
  value: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}

const ALGORITHMS: Algorithm[] = [
  {
    name: 'Bubble Sort',
    value: 'bubble',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  },
  {
    name: 'Selection Sort',
    value: 'selection',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Divides the input list into two parts: a sorted sublist and an unsorted sublist. The algorithm repeatedly finds the minimum element from the unsorted part and moves it to the sorted part.',
  },
  {
    name: 'Insertion Sort',
    value: 'insertion',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.',
  },
  {
    name: 'Merge Sort',
    value: 'merge',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Divides the unsorted list into n sublists, each containing one element, and then repeatedly merges sublists to produce new sorted sublists.',
  },
  {
    name: 'Quick Sort',
    value: 'quick',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description: 'Picks an element as a pivot and partitions the given array around the picked pivot.',
  },
  {
    name: 'Heap Sort',
    value: 'heap',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'Uses a binary heap data structure to sort elements.',
  },
  {
    name: 'Shell Sort',
    value: 'shell',
    timeComplexity: 'O(n log² n)',
    spaceComplexity: 'O(1)',
    description: 'An optimization of insertion sort that allows the exchange of items that are far apart.',
  },
  {
    name: 'Counting Sort',
    value: 'counting',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(n + k)',
    description: 'Counts the number of objects having distinct key values, then does arithmetic to calculate the position of each object in the output sequence.',
  },
  {
    name: 'Radix Sort',
    value: 'radix',
    timeComplexity: 'O(d * (n + k))',
    spaceComplexity: 'O(n + k)',
    description: 'Sorts numbers by processing individual digits. It uses counting sort as a subroutine to sort the numbers based on each digit.',
  },
];

const SortingVisualizer: React.FC = () => {
  const [arraySize, setArraySize] = useState<number>(20);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bubble');
  const [array, setArray] = useState<number[]>([]);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(50);
  const [customArrayInput, setCustomArrayInput] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [isSorted, setIsSorted] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState<number | undefined>(undefined);
  const sortingAlgoRef = useRef<SortingAlgorithms | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isSorting && !isSorted) {
      setArray(generateRandomArray(arraySize));
    }
  }, [arraySize, isSorting, isSorted]);

  const handleCustomArray = () => {
    try {
      const newArray = customArrayInput
        .split(',')
        .map(num => {
          const parsed = parseInt(num.trim());
          if (isNaN(parsed)) {
            throw new Error('All values must be valid numbers');
          }
          return parsed;
        });
      
      if (newArray.length < 2) {
        throw new Error('Array must have at least 2 elements');
      }
      
      if (newArray.length > 50) {
        throw new Error('Array cannot have more than 50 elements');
      }
      
      setArray(newArray);
      setArraySize(newArray.length);
      setInputError('');
      setIsSorted(false);
    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Invalid input');
    }
  };

  const handleGenerateRandom = () => {
    setArray(generateRandomArray(arraySize));
    setCustomArrayInput('');
    setInputError('');
    setIsSorted(false);
  };

  const handleSort = () => {
    if (isSorting) return;

    const newArray = array.length ? [...array] : generateRandomArray(arraySize);
    setArray(newArray);
    setIsSorting(true);
    setIsPaused(false);
    setIsSorted(false);

    sortingAlgoRef.current = new SortingAlgorithms(newArray);
    const generator = getSortingGenerator(selectedAlgorithm);

    const animate = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const result = generator.next();
      if (result.done) {
        setIsSorting(false);
        setIsSorted(true);
        setHighlightedLine(undefined);
        return;
      }

      const { array: newArray, highlightedIndices: newHighlightedIndices } = result.value;
      setArray(newArray);
      setHighlightedIndices(newHighlightedIndices);

      // Update highlighted line based on the current step
      const currentAlgorithm = selectedAlgorithm;
      const currentStep = result.value;
      
      // Map the current step to the corresponding pseudocode line
      let lineToHighlight: number | undefined;
      
      switch (currentAlgorithm) {
        case 'bubble':
          if (currentStep.highlightedIndices.length === 2) {
            lineToHighlight = 4; // Comparison line
            if (newArray[currentStep.highlightedIndices[0]] > newArray[currentStep.highlightedIndices[1]]) {
              lineToHighlight = 5; // Swap line
            }
          }
          break;
        case 'selection':
          if (currentStep.highlightedIndices.length === 2) {
            lineToHighlight = 5; // Comparison line
            if (newArray[currentStep.highlightedIndices[1]] < newArray[currentStep.highlightedIndices[0]]) {
              lineToHighlight = 6; // Update minIndex line
            }
          } else if (currentStep.highlightedIndices.length === 1) {
            lineToHighlight = 8; // Swap line
          }
          break;
        case 'insertion':
          if (currentStep.highlightedIndices.length === 2) {
            lineToHighlight = 6; // Comparison line
            if (newArray[currentStep.highlightedIndices[0]] > newArray[currentStep.highlightedIndices[1]]) {
              lineToHighlight = 7; // Shift line
            }
          } else if (currentStep.highlightedIndices.length === 1) {
            lineToHighlight = 8; // Insert line
          }
          break;
        // Add cases for other algorithms as needed
      }
      
      setHighlightedLine(lineToHighlight);

      timeoutRef.current = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, 1000 / speed);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const getSortingGenerator = (algorithm: string) => {
    if (!sortingAlgoRef.current) return { next: () => ({ done: true, value: { array: [], highlightedIndices: [], isComplete: false } }) };

    switch (algorithm) {
      case 'bubble':
        return sortingAlgoRef.current.bubbleSort();
      case 'selection':
        return sortingAlgoRef.current.selectionSort();
      case 'insertion':
        return sortingAlgoRef.current.insertionSort();
      case 'merge':
        return sortingAlgoRef.current.mergeSort();
      case 'quick':
        return sortingAlgoRef.current.quickSort();
      case 'heap':
        return sortingAlgoRef.current.heapSort();
      case 'counting':
        return sortingAlgoRef.current.countingSort();
      case 'radix':
        return sortingAlgoRef.current.radixSort();
      default:
        return sortingAlgoRef.current.bubbleSort();
    }
  };

  const handlePause = () => {
    if (isSorting && !isPaused) {
      setIsPaused(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const handleResume = () => {
    if (isSorting && isPaused) {
      setIsPaused(false);
      const generator = getSortingGenerator(selectedAlgorithm);
      const animate = () => {
        const result = generator.next();
        if (!result.done) {
          setArray(result.value.array);
          setHighlightedIndices(result.value.highlightedIndices);
          const delay = Math.max(1, 101 - speed);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            animationRef.current = requestAnimationFrame(animate);
          }, delay);
        } else {
          setIsSorting(false);
          setIsPaused(false);
          setHighlightedIndices([]);
          setIsSorted(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const handleStop = () => {
    if (isSorting) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      sortingAlgoRef.current?.stop();
      setIsSorting(false);
      setIsPaused(false);
      setHighlightedIndices([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="px-4 py-2 rounded bg-gray-700 text-white"
              disabled={isSorting}
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.name}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2">
              <label className="text-white">Size:</label>
              <input
                type="range"
                min="5"
                max="50"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="w-32"
                disabled={isSorting}
              />
              <span className="text-white">{arraySize}</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-white">Speed:</label>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-32"
                disabled={isSorting}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSort}
              disabled={isSorting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              <PlayIcon className="w-5 h-5 inline-block mr-2" />
              Sort
            </button>
            <button
              onClick={handlePause}
              disabled={!isSorting || isPaused}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              <PauseIcon className="w-5 h-5 inline-block mr-2" />
              Pause
            </button>
            <button
              onClick={handleResume}
              disabled={!isSorting || !isPaused}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <PlayIcon className="w-5 h-5 inline-block mr-2" />
              Resume
            </button>
            <button
              onClick={handleStop}
              disabled={!isSorting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              <StopIcon className="w-5 h-5 inline-block mr-2" />
              Stop
            </button>
            <button
              onClick={handleGenerateRandom}
              disabled={isSorting}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              <ArrowPathIcon className="w-5 h-5 inline-block mr-2" />
              New Array
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={customArrayInput}
              onChange={(e) => setCustomArrayInput(e.target.value)}
              placeholder="Enter comma-separated numbers"
              className="px-4 py-2 rounded bg-gray-700 text-white flex-grow"
              disabled={isSorting}
            />
            <button
              onClick={handleCustomArray}
              disabled={isSorting}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Use Custom Array
            </button>
          </div>
          {inputError && <p className="text-red-500">{inputError}</p>}

          <div className="h-64 flex items-end justify-center gap-1 bg-gray-800 rounded-lg p-4">
            {array.map((value, index) => (
              <div
                key={index}
                className={`w-8 bg-blue-500 transition-all duration-100 relative ${
                  highlightedIndices.includes(index)
                    ? 'bg-red-500'
                    : isSorted
                    ? 'bg-green-500'
                    : ''
                }`}
                style={{ height: `${(value / Math.max(...array)) * 100}%` }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 whitespace-nowrap">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <AlgorithmInfo
            algorithm={ALGORITHMS.find((a) => a.value === selectedAlgorithm)!}
          />
          <PseudocodeDisplay
            code={sortingPseudocode[selectedAlgorithm as keyof typeof sortingPseudocode]}
            highlightedLine={highlightedLine}
          />
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer; 