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
          <label className="block text-sm font-medium text-gray-300">
            Vertices
          </label>
          <input
            type="number"
            min="3"
            max="20"
            value={vertices}
            onChange={(e) => setVertices(Number(e.target.value))}
            disabled={isRunning}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Start Node
          </label>
          <input
            type="number"
            min="0"
            max={vertices - 1}
            value={startNode}
            onChange={(e) => setStartNode(Number(e.target.value))}
            disabled={isRunning}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200"
          />
        </div>

        {(algorithm === 'dijkstra' || algorithm === 'astar') && (
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              End Node
            </label>
            <input
              type="number"
              min="0"
              max={vertices - 1}
              value={endNode}
              onChange={(e) => setEndNode(Number(e.target.value))}
              disabled={isRunning}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200"
            />
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as GraphAlgorithm)}
            disabled={isRunning}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200"
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
          <label className="block text-sm font-medium text-gray-300">
            Animation Speed
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Max Edge Weight
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={maxWeight}
            onChange={(e) => setMaxWeight(Number(e.target.value))}
            disabled={isRunning}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-300">
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

      <div className="flex justify-center space-x-4">
        <button
          onClick={generateRandomGraphLayout}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
        >
          Generate Random Graph
        </button>
        <button
          onClick={startAlgorithm}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
        >
          Start Algorithm
        </button>
        {isRunning && (
          <>
            <button
              onClick={isPaused ? resumeAlgorithm : pauseAlgorithm}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={stopAlgorithm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Stop
            </button>
          </>
        )}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200"
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
        <div className="bg-gray-800 rounded-xl p-4">
          <h4 className="text-lg font-medium text-gray-300 mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-300">Start Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-gray-300">End Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-gray-300">Visited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300">Current</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative h-[600px] bg-gray-800 rounded-xl overflow-hidden">
        <svg className="w-full h-full">
          {edges.map((edge, index) => (
            <g key={index}>
              <line
                x1={nodes[edge.from].x}
                y1={nodes[edge.from].y}
                x2={nodes[edge.to].x}
                y2={nodes[edge.to].y}
                className={`stroke-current ${
                  currentPath.includes(edge.from) && currentPath.includes(edge.to)
                    ? 'text-green-500'
                    : visitedNodes.includes(edge.from) && visitedNodes.includes(edge.to)
                    ? 'text-blue-500'
                    : 'text-gray-600'
                }`}
                strokeWidth="2"
              />
              <text
                x={(nodes[edge.from].x + nodes[edge.to].x) / 2}
                y={(nodes[edge.from].y + nodes[edge.to].y) / 2}
                className="text-xs fill-gray-400"
                textAnchor="middle"
              >
                {edge.weight}
              </text>
            </g>
          ))}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                className={`fill-current ${
                  node.id === startNode
                    ? 'text-green-500'
                    : node.id === endNode
                    ? 'text-red-500'
                    : currentPath.includes(node.id)
                    ? 'text-green-500'
                    : visitedNodes.includes(node.id)
                    ? 'text-blue-500'
                    : currentNode.includes(node.id)
                    ? 'text-yellow-500'
                    : 'text-gray-600'
                }`}
              />
              <text
                x={node.x}
                y={node.y}
                className="text-sm fill-white"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default GraphVisualizer; 