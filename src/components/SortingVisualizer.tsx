import React, { useState, useRef, useEffect } from 'react';
import AlgorithmInfo from './AlgorithmInfo';
import PseudocodeDisplay from './PseudocodeDisplay';
import { SortingAlgorithms } from '../algorithms/sorting';
import { sortingPseudocode } from '../algorithms/pseudocode';
import { generateRandomArray } from '../algorithms/utils';
import { PlayIcon, PauseIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap' | 'shell' | 'counting' | 'radix';

interface TimeComplexity {
  best: string;
  average: string;
  worst: string;
}

interface AlgorithmInfo {
  name: string;
  description: string;
  timeComplexity: TimeComplexity;
  spaceComplexity: string;
  stability: string;
  useCases: string[];
}

const ALGORITHMS: SortingAlgorithm[] = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'shell', 'counting', 'radix'];

const SORTING_ALGORITHM_INFO: Record<SortingAlgorithm, AlgorithmInfo> = {
  bubble: {
    name: 'Bubble Sort',
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    useCases: [
      'Educational purposes',
      'Small datasets',
      'Nearly sorted data'
    ]
  },
  selection: {
    name: 'Selection Sort',
    description: 'Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the minimum element from the unsorted part and puts it at the beginning of the sorted part.',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    useCases: [
      'Small datasets',
      'When memory writes are expensive',
      'When auxiliary memory is limited'
    ]
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Insertion Sort builds the final sorted array one item at a time. It takes each element from the input and inserts it into its correct position in the sorted part of the array.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    useCases: [
      'Small datasets',
      'Nearly sorted data',
      'Online sorting (data coming in real-time)'
    ]
  },
  merge: {
    name: 'Merge Sort',
    description: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    stability: 'Stable',
    useCases: [
      'Large datasets',
      'External sorting',
      'When stability is required'
    ]
  },
  quick: {
    name: 'Quick Sort',
    description: 'Quick Sort is a divide-and-conquer algorithm that picks an element as pivot and partitions the array around the pivot. It recursively sorts the sub-arrays.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    stability: 'Unstable',
    useCases: [
      'Large datasets',
      'When average-case performance matters',
      'When memory is limited'
    ]
  },
  heap: {
    name: 'Heap Sort',
    description: 'Heap Sort uses a binary heap data structure to sort elements. It first builds a max heap from the input data, then repeatedly extracts the maximum element from the heap and places it at the end of the sorted array.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    useCases: [
      'Large datasets',
      'When worst-case performance is important',
      'When in-place sorting is required'
    ]
  },
  shell: {
    name: 'Shell Sort',
    description: 'Shell Sort is an optimization of insertion sort that allows the exchange of items that are far apart. It starts by sorting pairs of elements far apart from each other, then progressively reducing the gap between elements to be compared.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log² n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    useCases: [
      'Medium-sized datasets',
      'When insertion sort is too slow',
      'When memory is limited'
    ]
  },
  counting: {
    name: 'Counting Sort',
    description: 'Counting Sort counts the number of objects having distinct key values, then does arithmetic to calculate the position of each object in the output sequence. It is efficient when the range of input data is not significantly greater than the number of objects to be sorted.',
    timeComplexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n + k)'
    },
    spaceComplexity: 'O(n + k)',
    stability: 'Stable',
    useCases: [
      'When the range of input data is known and small',
      'Sorting integers with a limited range',
      'As a subroutine in radix sort'
    ]
  },
  radix: {
    name: 'Radix Sort',
    description: 'Radix Sort sorts numbers by processing individual digits. It uses counting sort as a subroutine to sort the numbers based on each digit, starting from the least significant digit to the most significant digit.',
    timeComplexity: {
      best: 'O(d * (n + k))',
      average: 'O(d * (n + k))',
      worst: 'O(d * (n + k))'
    },
    spaceComplexity: 'O(n + k)',
    stability: 'Stable',
    useCases: [
      'Sorting large numbers',
      'When the range of input data is large',
      'When the number of digits is small compared to the number of items'
    ]
  }
};

const SortingVisualizer: React.FC = () => {
  const [arraySize, setArraySize] = useState<number>(20);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>('bubble');
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

  const getSortingGenerator = (algorithm: SortingAlgorithm) => {
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
              onChange={(e) => setSelectedAlgorithm(e.target.value as SortingAlgorithm)}
              className="px-4 py-2 rounded bg-gray-700 text-white"
              disabled={isSorting}
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo} value={algo}>
                  {algo.charAt(0).toUpperCase() + algo.slice(1)}
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
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              {SORTING_ALGORITHM_INFO[selectedAlgorithm].name}
            </h3>
            <p className="text-gray-300 mb-4">
              {SORTING_ALGORITHM_INFO[selectedAlgorithm].description}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400">Time Complexity</h4>
                <div className="text-gray-200 space-y-1">
                  <p>Best: {SORTING_ALGORITHM_INFO[selectedAlgorithm].timeComplexity.best}</p>
                  <p>Average: {SORTING_ALGORITHM_INFO[selectedAlgorithm].timeComplexity.average}</p>
                  <p>Worst: {SORTING_ALGORITHM_INFO[selectedAlgorithm].timeComplexity.worst}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Space Complexity</h4>
                <p className="text-gray-200">{SORTING_ALGORITHM_INFO[selectedAlgorithm].spaceComplexity}</p>
                <h4 className="text-sm font-medium text-gray-400 mt-2">Stability</h4>
                <p className="text-gray-200">{SORTING_ALGORITHM_INFO[selectedAlgorithm].stability}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Common Use Cases</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {SORTING_ALGORITHM_INFO[selectedAlgorithm].useCases.map((useCase: string, index: number) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>
          </div>
          
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