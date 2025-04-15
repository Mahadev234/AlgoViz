import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GraphAlgorithms } from '../algorithms/graph';
import { generateRandomGraph } from '../algorithms/utils';

type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'prim' | 'kruskal';

interface Node {
  id: number;
  x: number;
  y: number;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

const GraphVisualizer: React.FC = () => {
  const [vertices, setVertices] = useState<number>(10);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [startNode, setStartNode] = useState<number>(0);
  const [endNode, setEndNode] = useState<number>(9);
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>('bfs');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50);
  const [timeoutRef, setTimeoutRef] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [stepMode, setStepMode] = useState<boolean>(false);
  const [maxWeight, setMaxWeight] = useState<number>(10);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  
  const graphAlgoRef = useRef<GraphAlgorithms | null>(null);
  const animationRef = useRef<number | null>(null);

  const generateRandomGraphLayout = useCallback(() => {
    const radius = Math.min(200, 300 - vertices * 5);
    const centerX = 300;
    const centerY = 300;
    
    const newNodes: Node[] = Array.from({ length: vertices }, (_, i) => ({
      id: i,
      x: centerX + radius * Math.cos((2 * Math.PI * i) / vertices),
      y: centerY + radius * Math.sin((2 * Math.PI * i) / vertices),
    }));
    setNodes(newNodes);

    const edgeCount = Math.floor((vertices * (vertices - 1)) / 4);
    const newEdges = generateRandomGraph(vertices, edgeCount).map(([from, to]) => ({
      from,
      to,
      weight: Math.floor(Math.random() * maxWeight) + 1,
    }));
    setEdges(newEdges);
    setError(null);
  }, [vertices, maxWeight]);

  useEffect(() => {
    generateRandomGraphLayout();
  }, [vertices, generateRandomGraphLayout]);

  const startAlgorithm = () => {
    setIsRunning(true);
    setIsPaused(false);
    setVisitedNodes([]);
    setCurrentPath([]);
    setCurrentNode([]);
    setError(null);

    try {
      graphAlgoRef.current = new GraphAlgorithms(vertices, edges.map(edge => [edge.from, edge.to, edge.weight]));
      const generator = getGraphGenerator(algorithm);

      const animate = () => {
        if (isPaused) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        const result = generator.next();
        if (!result.done) {
          setVisitedNodes(result.value.visited);
          setCurrentPath(result.value.path);
          setCurrentNode(result.value.current);
          
          if (stepMode) {
            setIsPaused(true);
            graphAlgoRef.current?.pause();
          } else {
            const delay = Math.max(1, 101 - speed);
            if (timeoutRef) {
              clearTimeout(timeoutRef);
            }
            const newTimeout = setTimeout(() => {
              animationRef.current = requestAnimationFrame(animate);
            }, delay);
            setTimeoutRef(newTimeout);
          }
        } else {
          setIsRunning(false);
          setIsPaused(false);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Error starting algorithm:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsRunning(false);
    }
  };

  const getGraphGenerator = (algorithm: string) => {
    if (!graphAlgoRef.current) return { next: () => ({ done: true, value: { visited: [], path: [], current: [], isComplete: false } }) };

    const isPathFinding = algorithm === 'dijkstra' || algorithm === 'astar';
    const end = isPathFinding ? endNode : undefined;

    switch (algorithm) {
      case 'bfs':
        return graphAlgoRef.current.bfs(startNode, end);
      case 'dfs':
        return graphAlgoRef.current.dfs(startNode, end);
      case 'dijkstra':
        return graphAlgoRef.current.dijkstra(startNode, endNode);
      case 'astar':
        return graphAlgoRef.current.astar(startNode, endNode);
      case 'prim':
        return graphAlgoRef.current.prim(startNode);
      case 'kruskal':
        return graphAlgoRef.current.kruskal();
      default:
        return graphAlgoRef.current.bfs(startNode);
    }
  };

  const pauseAlgorithm = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      graphAlgoRef.current?.pause();
    }
  };

  const resumeAlgorithm = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      graphAlgoRef.current?.resume();
    }
  };

  const stopAlgorithm = () => {
    if (isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      graphAlgoRef.current?.stop();
      setIsRunning(false);
      setIsPaused(false);
      setVisitedNodes([]);
      setCurrentPath([]);
      setCurrentNode([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Vertices
          </label>
          <input
            type="number"
            min="3"
            max="20"
            value={vertices}
            onChange={(e) => setVertices(Number(e.target.value))}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Node
          </label>
          <input
            type="number"
            min="0"
            max={vertices - 1}
            value={startNode}
            onChange={(e) => setStartNode(Number(e.target.value))}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>

        {(algorithm === 'dijkstra' || algorithm === 'astar') && (
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Node
            </label>
            <input
              type="number"
              min="0"
              max={vertices - 1}
              value={endNode}
              onChange={(e) => setEndNode(Number(e.target.value))}
              disabled={isRunning}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as GraphAlgorithm)}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
          >
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="astar">A* Algorithm</option>
            <option value="prim">Prim's Algorithm</option>
            <option value="kruskal">Kruskal's Algorithm</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Animation Speed
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              disabled={isRunning}
            />
            <span className="text-gray-700 dark:text-gray-300 w-8 text-center">{speed}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Max Edge Weight
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={maxWeight}
            onChange={(e) => setMaxWeight(Number(e.target.value))}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Step Mode
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={stepMode}
              onChange={(e) => setStepMode(e.target.checked)}
              disabled={isRunning}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Step Mode</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={startAlgorithm}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Start
        </button>

        <button
          onClick={pauseAlgorithm}
          disabled={!isRunning || isPaused}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Pause
        </button>

        <button
          onClick={resumeAlgorithm}
          disabled={!isRunning || !isPaused}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Resume
        </button>

        <button
          onClick={stopAlgorithm}
          disabled={!isRunning}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Stop
        </button>

        <button
          onClick={generateRandomGraphLayout}
          disabled={isRunning}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Generate New Graph
        </button>

        <button
          onClick={() => setShowLegend(!showLegend)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
        >
          {showLegend ? 'Hide Legend' : 'Show Legend'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
          Error: {error}
        </div>
      )}

      {showLegend && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-600"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Start/End Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Visited Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Path Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Current Node</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative h-[600px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <svg className="w-full h-full">
          {edges.map((edge, index) => {
            const fromNode = nodes[edge.from];
            const toNode = nodes[edge.to];
            const isHighlighted = currentPath.includes(edge.from) && currentPath.includes(edge.to) &&
              Math.abs(currentPath.indexOf(edge.from) - currentPath.indexOf(edge.to)) === 1;

            return (
              <g key={index}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHighlighted ? '#EF4444' : '#3B82F6'}
                  strokeWidth={isHighlighted ? 3 : 2}
                  className="transition-colors duration-300"
                />
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-medium fill-gray-700 dark:fill-gray-300"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {nodes.map((node) => {
            const isVisited = visitedNodes.includes(node.id);
            const isCurrent = currentNode.includes(node.id);
            const isInPath = currentPath.includes(node.id);
            const isStart = node.id === startNode;
            const isEnd = node.id === endNode;

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill={
                    isCurrent
                      ? '#EF4444'
                      : isInPath
                      ? '#10B981'
                      : isVisited
                      ? '#3B82F6'
                      : isStart || isEnd
                      ? '#8B5CF6'
                      : '#6B7280'
                  }
                  className="transition-colors duration-300"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-medium fill-white"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default GraphVisualizer; 