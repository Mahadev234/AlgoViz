# Algorithm Visualization Tool

A modern web application for visualizing various algorithms with interactive animations and detailed explanations.

## Project Overview

This project is a React-based web application that provides visualizations for different types of algorithms, including sorting and graph algorithms. The application features real-time animations, step-by-step explanations, and interactive controls to help users understand how algorithms work.

## Core Features

### 1. Algorithm Visualizations
- **Sorting Algorithms**
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Merge Sort
  - Quick Sort
  - Heap Sort
  - Radix Sort
  - Counting Sort

- **Graph Algorithms**
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm
  - A* Search Algorithm
  - Kruskal's Algorithm
  - Prim's Algorithm

### 2. Interactive Features
- Real-time algorithm visualization
- Speed control for animations
- Step-by-step execution
- Customizable input data
- Detailed algorithm explanations
- Error handling and boundary management

## Technical Architecture

### Frontend Structure
- Built with React and TypeScript
- Uses Vite as the build tool
- Styled with Tailwind CSS
- Implements custom hooks for algorithm state management
- Features error boundaries for robust error handling

### Key Components
1. **SortingVisualizer**
   - Handles sorting algorithm visualizations
   - Provides array manipulation controls
   - Displays real-time sorting progress

2. **GraphVisualizer**
   - Manages graph algorithm visualizations
   - Supports node and edge interactions
   - Implements graph traversal animations

3. **AlgorithmInfo**
   - Displays detailed information about each algorithm
   - Shows time and space complexity
   - Provides usage examples

4. **Tooltip**
   - Offers contextual help and information
   - Enhances user experience with guided interactions

5. **ErrorBoundary**
   - Ensures application stability
   - Provides graceful error handling
   - Maintains user experience during errors

### State Management
- Custom hooks for algorithm state
- Context-based state management
- Efficient state updates for smooth animations

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Project Structure
```
frontend/
├── src/
│   ├── algorithms/        # Algorithm implementations
│   │   ├── sorting.ts    # Sorting algorithms
│   │   ├── graph.ts      # Graph algorithms
│   │   ├── utils.ts      # Utility functions
│   │   └── types.ts      # Type definitions
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   └── App.tsx          # Main application component
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
