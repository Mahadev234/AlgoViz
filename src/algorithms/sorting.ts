import { SortingStep } from './types';

export class SortingAlgorithms {
  private array: number[];
  private _paused: boolean = false;
  private _stopped: boolean = false;

  constructor(array: number[]) {
    this.array = [...array];
  }

  pause() {
    this._paused = true;
  }

  resume() {
    this._paused = false;
  }

  stop() {
    this._stopped = true;
  }

  private _waitIfPaused() {
    while (this._paused && !this._stopped) {
      // Busy wait
    }
  }

  *bubbleSort(): Generator<SortingStep, void, unknown> {
    const n = this.array.length;
    for (let i = 0; i < n; i++) {
      if (this._stopped) break;
      this._waitIfPaused();

      for (let j = 0; j < n - i - 1; j++) {
        if (this._stopped) break;
        this._waitIfPaused();

        yield {
          array: [...this.array],
          highlightedIndices: [j, j + 1],
          isComplete: false
        };

        if (this.array[j] > this.array[j + 1]) {
          [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
          yield {
            array: [...this.array],
            highlightedIndices: [j, j + 1],
            isComplete: false
          };
        }
      }
    }

    yield {
      array: [...this.array],
      highlightedIndices: [],
      isComplete: true
    };
  }

  *selectionSort(): Generator<SortingStep, void, unknown> {
    const n = this.array.length;
    for (let i = 0; i < n; i++) {
      if (this._stopped) break;
      this._waitIfPaused();

      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (this._stopped) break;
        this._waitIfPaused();

        yield {
          array: [...this.array],
          highlightedIndices: [i, j, minIdx],
          isComplete: false
        };

        if (this.array[j] < this.array[minIdx]) {
          minIdx = j;
          yield {
            array: [...this.array],
            highlightedIndices: [i, j, minIdx],
            isComplete: false
          };
        }
      }

      [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
      yield {
        array: [...this.array],
        highlightedIndices: [i, minIdx],
        isComplete: false
      };
    }

    yield {
      array: [...this.array],
      highlightedIndices: [],
      isComplete: true
    };
  }

  *insertionSort(): Generator<SortingStep, void, unknown> {
    const n = this.array.length;
    for (let i = 1; i < n; i++) {
      if (this._stopped) break;
      this._waitIfPaused();

      const key = this.array[i];
      let j = i - 1;

      yield {
        array: [...this.array],
        highlightedIndices: [i, j],
        isComplete: false
      };

      while (j >= 0 && key < this.array[j]) {
        if (this._stopped) break;
        this._waitIfPaused();

        this.array[j + 1] = this.array[j];
        j--;
        yield {
          array: [...this.array],
          highlightedIndices: [i, j + 1],
          isComplete: false
        };
      }

      this.array[j + 1] = key;
      yield {
        array: [...this.array],
        highlightedIndices: [j + 1, i],
        isComplete: false
      };
    }

    yield {
      array: [...this.array],
      highlightedIndices: [],
      isComplete: true
    };
  }

  *mergeSort(): Generator<SortingStep, void, unknown> {
    function* merge(
      arr: number[],
      l: number,
      m: number,
      r: number,
      self: SortingAlgorithms
    ): Generator<SortingStep, void, unknown> {
      const n1 = m - l + 1;
      const n2 = r - m;

      const L = new Array(n1);
      const R = new Array(n2);

      for (let i = 0; i < n1; i++) {
        L[i] = arr[l + i];
      }
      for (let j = 0; j < n2; j++) {
        R[j] = arr[m + 1 + j];
      }

      let i = 0;
      let j = 0;
      let k = l;

      while (i < n1 && j < n2) {
        if (self._stopped) break;
        self._waitIfPaused();

        yield {
          array: [...arr],
          highlightedIndices: [l + i, m + 1 + j],
          isComplete: false
        };

        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        k++;
        yield {
          array: [...arr],
          highlightedIndices: [k - 1],
          isComplete: false
        };
      }

      while (i < n1) {
        if (self._stopped) break;
        self._waitIfPaused();

        arr[k] = L[i];
        i++;
        k++;
        yield {
          array: [...arr],
          highlightedIndices: [k - 1],
          isComplete: false
        };
      }

      while (j < n2) {
        if (self._stopped) break;
        self._waitIfPaused();

        arr[k] = R[j];
        j++;
        k++;
        yield {
          array: [...arr],
          highlightedIndices: [k - 1],
          isComplete: false
        };
      }
    }

    function* mergeSortHelper(
      arr: number[],
      l: number,
      r: number,
      self: SortingAlgorithms
    ): Generator<SortingStep, void, unknown> {
      if (l < r) {
        const m = Math.floor((l + r) / 2);
        yield* mergeSortHelper(arr, l, m, self);
        yield* mergeSortHelper(arr, m + 1, r, self);
        yield* merge(arr, l, m, r, self);
      }
    }

    yield* mergeSortHelper(this.array, 0, this.array.length - 1, this);
    yield {
      array: [...this.array],
      highlightedIndices: [],
      isComplete: true
    };
  }

  *quickSort(): Generator<SortingStep, void, unknown> {
    function* partition(
      arr: number[],
      low: number,
      high: number,
      self: SortingAlgorithms
    ): Generator<SortingStep, number, unknown> {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (self._stopped) break;
        self._waitIfPaused();

        yield {
          array: [...arr],
          highlightedIndices: [j, high],
          isComplete: false
        };

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield {
            array: [...arr],
            highlightedIndices: [i, j],
            isComplete: false
          };
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      yield {
        array: [...arr],
        highlightedIndices: [i + 1, high],
        isComplete: false
      };
      return i + 1;
    }

    function* quickSortHelper(
      arr: number[],
      low: number,
      high: number,
      self: SortingAlgorithms
    ): Generator<SortingStep, void, unknown> {
      if (low < high) {
        const pi = yield* partition(arr, low, high, self);
        yield* quickSortHelper(arr, low, pi - 1, self);
        yield* quickSortHelper(arr, pi + 1, high, self);
      }
    }

    yield* quickSortHelper(this.array, 0, this.array.length - 1, this);
    yield {
      array: [...this.array],
      highlightedIndices: [],
      isComplete: true
    };
  }

  *heapSort(): Generator<SortingStep, void, unknown> {
    function* heapify(
      arr: number[],
      n: number,
      i: number,
      self: SortingAlgorithms
    ): Generator<SortingStep, void, unknown> {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && arr[left] > arr[largest]) {
        largest = left;
      }

      if (right < n && arr[right] > arr[largest]) {
        largest = right;
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        yield {
          array: [...arr],
          highlightedIndices: [i, largest],
          isComplete: false
        };
        yield* heapify(arr, n, largest, self);
      }
    }

    const n = this.array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (this._stopped) break;
      this._waitIfPaused();
      yield* heapify(this.array, n, i, this);
    }

    for (let i = n - 1; i > 0; i--) {
      if (this._stopped) break;
      this._waitIfPaused();

      [this.array[0], this.array[i]] = [this.array[i], this.array[0]];
      yield {
        array: [...this.array],
        highlightedIndices: [0, i],
        isComplete: false
      };
      yield* heapify(this.array, i, 0, this);
    }

    yield {
      array: [...this.array],
      highlightedIndices: [],
      isComplete: true
    };
  }

  *countingSort(): Generator<SortingStep, void, unknown> {
    const max = Math.max(...this.array);
    const min = Math.min(...this.array);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(this.array.length);

    for (let i = 0; i < this.array.length; i++) {
      if (this._stopped) break;
      this._waitIfPaused();

      count[this.array[i] - min]++;
      yield {
        array: [...this.array],
        highlightedIndices: [i],
        isComplete: false
      };
    }

    for (let i = 1; i < range; i++) {
      if (this._stopped) break;
      this._waitIfPaused();

      count[i] += count[i - 1];
    }

    for (let i = this.array.length - 1; i >= 0; i--) {
      if (this._stopped) break;
      this._waitIfPaused();

      output[count[this.array[i] - min] - 1] = this.array[i];
      count[this.array[i] - min]--;
      yield {
        array: [...output],
        highlightedIndices: [i],
        isComplete: false
      };
    }

    this.array = output;
    yield {
      array: [...this.array],
      highlightedIndices: [],
      isComplete: true
    };
  }

  *radixSort(): Generator<SortingStep, void, unknown> {
    const max = Math.max(...this.array);
    const maxDigits = Math.floor(Math.log10(max)) + 1;

    for (let exp = 1; exp <= Math.pow(10, maxDigits - 1); exp *= 10) {
      if (this._stopped) break;
      this._waitIfPaused();

      const count = new Array(10).fill(0);
      const output = new Array(this.array.length);

      for (let i = 0; i < this.array.length; i++) {
        if (this._stopped) break;
        this._waitIfPaused();

        count[Math.floor(this.array[i] / exp) % 10]++;
        yield {
          array: [...this.array],
          highlightedIndices: [i],
          isComplete: false
        };
      }

      for (let i = 1; i < 10; i++) {
        if (this._stopped) break;
        this._waitIfPaused();

        count[i] += count[i - 1];
      }

      for (let i = this.array.length - 1; i >= 0; i--) {
        if (this._stopped) break;
        this._waitIfPaused();

        output[count[Math.floor(this.array[i] / exp) % 10] - 1] = this.array[i];
        count[Math.floor(this.array[i] / exp) % 10]--;
        yield {
          array: [...output],
          highlightedIndices: [i],
          isComplete: false
        };
      }

      this.array = output;
    }

    yield {
      array: [...this.array],
      highlightedIndices: [],
      isComplete: true
    };
  }

  getAlgorithmInfo(algorithm: string) {
    const info = {
      bubble: {
        name: 'Bubble Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        steps: [
          'Compare adjacent elements',
          'Swap if they are in the wrong order',
          'Repeat until the list is sorted'
        ]
      },
      selection: {
        name: 'Selection Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Selection sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the minimum element from the unsorted part and moves it to the sorted part.',
        steps: [
          'Find the minimum element in the unsorted array',
          'Swap it with the first element of the unsorted array',
          'Move the boundary of the sorted array one element to the right'
        ]
      },
      insertion: {
        name: 'Insertion Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Insertion sort builds the final sorted array one item at a time. It takes each element and inserts it into its correct position in the sorted part of the array.',
        steps: [
          'Start with the second element',
          'Compare it with the previous elements',
          'Insert it in the correct position'
        ]
      },
      merge: {
        name: 'Merge Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        description: 'Merge sort divides the array into two halves, recursively sorts them, and then merges the two sorted halves.',
        steps: [
          'Divide the array into two halves',
          'Recursively sort each half',
          'Merge the two sorted halves'
        ]
      },
      quick: {
        name: 'Quick Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        description: 'Quick sort picks a pivot element and partitions the array around the pivot. It then recursively sorts the subarrays.',
        steps: [
          'Pick a pivot element',
          'Partition the array around the pivot',
          'Recursively sort the subarrays'
        ]
      },
      heap: {
        name: 'Heap Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        description: 'Heap sort builds a max heap from the array and repeatedly extracts the maximum element from the heap.',
        steps: [
          'Build a max heap from the array',
          'Swap the root with the last element',
          'Heapify the reduced heap'
        ]
      },
      counting: {
        name: 'Counting Sort',
        timeComplexity: 'O(n + k)',
        spaceComplexity: 'O(n + k)',
        description: 'Counting sort is a non-comparison based sorting algorithm that works by counting the number of objects having distinct key values.',
        steps: [
          'Count the frequency of each element',
          'Calculate the cumulative count',
          'Place the elements in their correct positions'
        ]
      },
      radix: {
        name: 'Radix Sort',
        timeComplexity: 'O(d * (n + k))',
        spaceComplexity: 'O(n + k)',
        description: 'Radix sort sorts numbers by processing individual digits. It uses counting sort as a subroutine to sort the numbers based on each digit.',
        steps: [
          'Sort the numbers by the least significant digit',
          'Continue sorting by each more significant digit',
          'The final result is a sorted array'
        ]
      }
    };

    return info[algorithm as keyof typeof info] || null;
  }
} 