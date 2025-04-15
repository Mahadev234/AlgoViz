export function generateRandomArray(size: number, min: number = 1, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function generateRandomGraph(vertices: number, edges: number): number[][] {
  const graph: number[][] = [];
  const maxEdges = (vertices * (vertices - 1)) / 2;
  const actualEdges = Math.min(edges, maxEdges);
  
  // Create a list of all possible edges
  const possibleEdges: [number, number][] = [];
  for (let i = 0; i < vertices; i++) {
    for (let j = i + 1; j < vertices; j++) {
      possibleEdges.push([i, j]);
    }
  }
  
  // Shuffle the edges
  for (let i = possibleEdges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [possibleEdges[i], possibleEdges[j]] = [possibleEdges[j], possibleEdges[i]];
  }
  
  // Select the first 'actualEdges' edges and add random weights
  for (let i = 0; i < actualEdges; i++) {
    const [u, v] = possibleEdges[i];
    const weight = Math.floor(Math.random() * 10) + 1; // Random weight between 1 and 10
    graph.push([u, v, weight]);
  }
  
  return graph;
} 