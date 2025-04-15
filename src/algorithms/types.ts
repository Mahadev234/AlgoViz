export interface SortingStep {
  array: number[];
  highlightedIndices: number[];
  isComplete: boolean;
}

export interface GraphStep {
  visited: number[];
  path: number[];
  current: number[];
  isComplete: boolean;
}

export interface AlgorithmInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  steps: string[];
} 