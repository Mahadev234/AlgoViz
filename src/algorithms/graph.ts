import { GraphStep } from './types';

export class GraphAlgorithms {
  private vertices: number;
  private edges: number[][];
  private adjacencyList: [number, number][][];
  private _paused: boolean = false;
  private _stopped: boolean = false;

  constructor(vertices: number, edges: number[][]) {
    this.vertices = vertices;
    this.edges = edges;
    this.adjacencyList = this._buildAdjacencyList();
  }

  private _buildAdjacencyList(): [number, number][][] {
    const adj: [number, number][][] = Array(this.vertices).fill(null).map(() => []);
    for (const [u, v, weight] of this.edges) {
      adj[u].push([v, weight]);
      adj[v].push([u, weight]);
    }
    return adj;
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

  *bfs(start: number, end?: number): Generator<GraphStep, void, unknown> {
    const visited = new Array(this.vertices).fill(false);
    const queue = [start];
    visited[start] = true;
    const parent = new Array(this.vertices).fill(-1);
    const currentPath: number[] = [];

    while (queue.length > 0 && !this._stopped) {
      this._waitIfPaused();

      const current = queue.shift()!;
      currentPath.push(current);

      yield {
        visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        path: [...currentPath],
        current: [current],
        isComplete: false
      };

      if (end !== undefined && current === end) {
        break;
      }

      for (const [neighbor] of this.adjacencyList[current]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          parent[neighbor] = current;
          queue.push(neighbor);
        }
      }
    }

    if (end !== undefined) {
      const path: number[] = [];
      let current = end;
      while (current !== -1) {
        path.push(current);
        current = parent[current];
      }
      path.reverse();
      yield {
        visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        path,
        current: [end],
        isComplete: true
      };
    } else {
      yield {
        visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        path: currentPath,
        current: [],
        isComplete: true
      };
    }
  }

  *dfs(start: number, end?: number): Generator<GraphStep, void, unknown> {
    const visited = new Array(this.vertices).fill(false);
    const stack = [start];
    const currentPath: number[] = [];

    while (stack.length > 0 && !this._stopped) {
      this._waitIfPaused();

      const current = stack.pop()!;
      if (!visited[current]) {
        visited[current] = true;
        currentPath.push(current);

        yield {
          visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
          path: [...currentPath],
          current: [current],
          isComplete: false
        };

        if (end !== undefined && current === end) {
          break;
        }

        for (const [neighbor] of this.adjacencyList[current].reverse()) {
          if (!visited[neighbor]) {
            stack.push(neighbor);
          }
        }
      }
    }

    yield {
      visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
      path: currentPath,
      current: [],
      isComplete: true
    };
  }

  *dijkstra(start: number, end?: number): Generator<GraphStep, void, unknown> {
    const distances = new Array(this.vertices).fill(Infinity);
    distances[start] = 0;
    const visited = new Array(this.vertices).fill(false);
    const parent = new Array(this.vertices).fill(-1);
    const heap: [number, number][] = [[0, start]];
    const currentPath: number[] = [];

    while (heap.length > 0 && !this._stopped) {
      this._waitIfPaused();

      const [dist, current] = heap.shift()!;
      if (visited[current]) continue;

      visited[current] = true;
      currentPath.push(current);

      yield {
        visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        path: [...currentPath],
        current: [current],
        isComplete: false
      };

      if (end !== undefined && current === end) {
        break;
      }

      for (const [neighbor, weight] of this.adjacencyList[current]) {
        if (!visited[neighbor]) {
          const newDist = dist + weight;
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            parent[neighbor] = current;
            heap.push([newDist, neighbor]);
            heap.sort((a, b) => a[0] - b[0]);
          }
        }
      }
    }

    if (end !== undefined) {
      const path: number[] = [];
      let current = end;
      while (current !== -1) {
        path.push(current);
        current = parent[current];
      }
      path.reverse();
      yield {
        visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        path,
        current: [end],
        isComplete: true
      };
    } else {
      yield {
        visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        path: currentPath,
        current: [],
        isComplete: true
      };
    }
  }

  *astar(start: number, end: number): Generator<GraphStep, void, unknown> {
    if (end === undefined) {
      throw new Error("End node must be specified for A* algorithm");
    }

    const heuristic = (): number => {
      // Simple heuristic: number of edges to end node
      return 1.0;
    };

    const distances = new Array(this.vertices).fill(Infinity);
    distances[start] = 0;
    const visited = new Array(this.vertices).fill(false);
    const parent = new Array(this.vertices).fill(-1);
    const heap: [number, number, number][] = [[0 + heuristic(), 0, start]];
    const currentPath: number[] = [];

    while (heap.length > 0 && !this._stopped) {
      this._waitIfPaused();

      const [, dist, current] = heap.shift()!;
      if (visited[current]) continue;

      visited[current] = true;
      currentPath.push(current);

      yield {
        visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        path: [...currentPath],
        current: [current],
        isComplete: false
      };

      if (current === end) {
        break;
      }

      for (const [neighbor, weight] of this.adjacencyList[current]) {
        if (!visited[neighbor]) {
          const newDist = dist + weight;
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            parent[neighbor] = current;
            heap.push([newDist + heuristic(), newDist, neighbor]);
            heap.sort((a, b) => a[0] - b[0]);
          }
        }
      }
    }

    const path: number[] = [];
    let current = end;
    while (current !== -1) {
      path.push(current);
      current = parent[current];
    }
    path.reverse();

    yield {
      visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
      path,
      current: [end],
      isComplete: true
    };
  }

  *prim(start: number): Generator<GraphStep, void, unknown> {
    const visited = new Array(this.vertices).fill(false);
    const minEdge = new Array(this.vertices).fill([Infinity, -1]);
    const mstEdges: [number, number][] = [];
    const heap: [number, number, number][] = [[0, start, -1]];

    while (heap.length > 0 && !this._stopped) {
      this._waitIfPaused();

      const [, current, parent] = heap.shift()!;
      if (visited[current]) continue;

      visited[current] = true;
      if (parent !== -1) {
        mstEdges.push([parent, current]);
      }

      yield {
        visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
        path: mstEdges.flat(),
        current: [current],
        isComplete: false
      };

      for (const [neighbor, edgeWeight] of this.adjacencyList[current]) {
        if (!visited[neighbor] && edgeWeight < minEdge[neighbor][0]) {
          minEdge[neighbor] = [edgeWeight, current];
          heap.push([edgeWeight, neighbor, current]);
          heap.sort((a, b) => a[0] - b[0]);
        }
      }
    }

    yield {
      visited: visited.map((v, i) => v ? i : -1).filter(i => i !== -1),
      path: mstEdges.flat(),
      current: [],
      isComplete: true
    };
  }

  *kruskal(): Generator<GraphStep, void, unknown> {
    const parent = new Array(this.vertices).fill(-1).map((_, i) => i);
    const mstEdges: [number, number][] = [];
    const sortedEdges = [...this.edges].sort((a, b) => a[2] - b[2]);

    const find = (u: number): number => {
      if (parent[u] !== u) {
        parent[u] = find(parent[u]);
      }
      return parent[u];
    };

    const union = (u: number, v: number): boolean => {
      const rootU = find(u);
      const rootV = find(v);
      if (rootU === rootV) return false;
      parent[rootV] = rootU;
      return true;
    };

    for (const [u, v] of sortedEdges) {
      if (this._stopped) break;
      this._waitIfPaused();

      if (union(u, v)) {
        mstEdges.push([u, v]);
        yield {
          visited: mstEdges.flat(),
          path: mstEdges.flat(),
          current: [u, v],
          isComplete: false
        };
      }
    }

    yield {
      visited: mstEdges.flat(),
      path: mstEdges.flat(),
      current: [],
      isComplete: true
    };
  }

  getAlgorithmInfo(algorithm: string) {
    const info = {
      bfs: {
        name: 'Breadth-First Search',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        description: 'BFS explores all the vertices at the present depth level before moving on to vertices at the next depth level.',
        steps: [
          'Start from the source vertex',
          'Visit all adjacent vertices',
          'Move to the next level of vertices',
          'Repeat until all vertices are visited'
        ]
      },
      dfs: {
        name: 'Depth-First Search',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        description: 'DFS explores as far as possible along each branch before backtracking.',
        steps: [
          'Start from the source vertex',
          'Visit an unvisited adjacent vertex',
          'Continue until no more unvisited vertices',
          'Backtrack and repeat'
        ]
      },
      dijkstra: {
        name: "Dijkstra's Algorithm",
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V)',
        description: "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph.",
        steps: [
          'Initialize distances to infinity',
          'Set source distance to 0',
          'Visit the closest unvisited vertex',
          'Update distances to adjacent vertices',
          'Repeat until all vertices are visited'
        ]
      },
      astar: {
        name: 'A* Algorithm',
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V)',
        description: 'A* algorithm finds the shortest path from a source vertex to a target vertex using a heuristic function.',
        steps: [
          'Initialize distances and heuristic values',
          'Visit the vertex with lowest f(n) = g(n) + h(n)',
          'Update distances and heuristic values',
          'Repeat until target vertex is reached'
        ]
      },
      prim: {
        name: 'Prim\'s Algorithm',
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V)',
        description: 'Prim\'s algorithm finds a minimum spanning tree in a weighted graph.',
        steps: [
          'Start from an arbitrary vertex',
          'Add the least weight edge from the tree to the remaining vertices',
          'Repeat until all vertices are included'
        ]
      },
      kruskal: {
        name: 'Kruskal\'s Algorithm',
        timeComplexity: 'O(E log V)',
        spaceComplexity: 'O(V)',
        description: 'Kruskal\'s algorithm finds a minimum spanning tree in a weighted graph.',
        steps: [
          'Sort all edges by weight',
          'Add the least weight edge that does not form a cycle',
          'Repeat until all vertices are included'
        ]
      }
    };

    return info[algorithm as keyof typeof info] || null;
  }
} 