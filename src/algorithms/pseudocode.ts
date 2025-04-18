export const sortingPseudocode = {
  bubble: [
    "procedure bubbleSort(A: list of sortable items)",
    "    n = length(A)",
    "    for i from 0 to n-1 do",
    "        for j from 0 to n-i-1 do",
    "            if A[j] > A[j+1] then",
    "                swap(A[j], A[j+1])",
    "            end if",
    "        end for",
    "    end for",
    "end procedure"
  ],
  selection: [
    "procedure selectionSort(A: list of sortable items)",
    "    n = length(A)",
    "    for i from 0 to n-1 do",
    "        minIndex = i",
    "        for j from i+1 to n do",
    "            if A[j] < A[minIndex] then",
    "                minIndex = j",
    "            end if",
    "        end for",
    "        swap(A[i], A[minIndex])",
    "    end for",
    "end procedure"
  ],
  insertion: [
    "procedure insertionSort(A: list of sortable items)",
    "    n = length(A)",
    "    for i from 1 to n-1 do",
    "        key = A[i]",
    "        j = i - 1",
    "        while j >= 0 and A[j] > key do",
    "            A[j+1] = A[j]",
    "            j = j - 1",
    "        end while",
    "        A[j+1] = key",
    "    end for",
    "end procedure"
  ],
  merge: [
    "procedure mergeSort(A: list of sortable items)",
    "    if length(A) <= 1 then",
    "        return A",
    "    end if",
    "    mid = length(A) / 2",
    "    left = mergeSort(A[0..mid-1])",
    "    right = mergeSort(A[mid..end])",
    "    return merge(left, right)",
    "end procedure",
    "",
    "procedure merge(left, right)",
    "    result = []",
    "    while length(left) > 0 and length(right) > 0 do",
    "        if left[0] <= right[0] then",
    "            append left[0] to result",
    "            left = left[1..end]",
    "        else",
    "            append right[0] to result",
    "            right = right[1..end]",
    "        end if",
    "    end while",
    "    append remaining elements of left to result",
    "    append remaining elements of right to result",
    "    return result",
    "end procedure"
  ],
  quick: [
    "procedure quickSort(A: list of sortable items, low, high)",
    "    if low < high then",
    "        pivotIndex = partition(A, low, high)",
    "        quickSort(A, low, pivotIndex - 1)",
    "        quickSort(A, pivotIndex + 1, high)",
    "    end if",
    "end procedure",
    "",
    "procedure partition(A, low, high)",
    "    pivot = A[high]",
    "    i = low - 1",
    "    for j from low to high-1 do",
    "        if A[j] <= pivot then",
    "            i = i + 1",
    "            swap(A[i], A[j])",
    "        end if",
    "    end for",
    "    swap(A[i+1], A[high])",
    "    return i + 1",
    "end procedure"
  ],
  heap: [
    "procedure heapSort(A: list of sortable items)",
    "    n = length(A)",
    "    // Build max heap",
    "    for i from n/2 - 1 down to 0 do",
    "        heapify(A, n, i)",
    "    end for",
    "    // Extract elements from heap",
    "    for i from n-1 down to 0 do",
    "        swap(A[0], A[i])",
    "        heapify(A, i, 0)",
    "    end for",
    "end procedure",
    "",
    "procedure heapify(A, n, i)",
    "    largest = i",
    "    left = 2*i + 1",
    "    right = 2*i + 2",
    "    if left < n and A[left] > A[largest] then",
    "        largest = left",
    "    end if",
    "    if right < n and A[right] > A[largest] then",
    "        largest = right",
    "    end if",
    "    if largest != i then",
    "        swap(A[i], A[largest])",
    "        heapify(A, n, largest)",
    "    end if",
    "end procedure"
  ],
  shell: [
    "procedure shellSort(A: list of sortable items)",
    "    n = length(A)",
    "    gap = n/2",
    "    while gap > 0 do",
    "        for i from gap to n-1 do",
    "            temp = A[i]",
    "            j = i",
    "            while j >= gap and A[j-gap] > temp do",
    "                A[j] = A[j-gap]",
    "                j = j - gap",
    "            end while",
    "            A[j] = temp",
    "        end for",
    "        gap = gap/2",
    "    end while",
    "end procedure"
  ],
  counting: [
    "procedure countingSort(A: list of sortable items)",
    "    n = length(A)",
    "    max = maximum value in A",
    "    min = minimum value in A",
    "    range = max - min + 1",
    "    count = array of size range, initialized to 0",
    "    output = array of size n",
    "    // Count occurrences of each value",
    "    for i from 0 to n-1 do",
    "        count[A[i] - min] = count[A[i] - min] + 1",
    "    end for",
    "    // Calculate cumulative counts",
    "    for i from 1 to range-1 do",
    "        count[i] = count[i] + count[i-1]",
    "    end for",
    "    // Build output array",
    "    for i from n-1 down to 0 do",
    "        output[count[A[i] - min] - 1] = A[i]",
    "        count[A[i] - min] = count[A[i] - min] - 1",
    "    end for",
    "    return output",
    "end procedure"
  ],
  radix: [
    "procedure radixSort(A: list of sortable items)",
    "    max = maximum value in A",
    "    exp = 1",
    "    while max/exp > 0 do",
    "        countingSortByDigit(A, exp)",
    "        exp = exp * 10",
    "    end while",
    "end procedure",
    "",
    "procedure countingSortByDigit(A, exp)",
    "    n = length(A)",
    "    output = array of size n",
    "    count = array of size 10, initialized to 0",
    "    // Count occurrences of each digit",
    "    for i from 0 to n-1 do",
    "        index = (A[i]/exp) % 10",
    "        count[index] = count[index] + 1",
    "    end for",
    "    // Calculate cumulative counts",
    "    for i from 1 to 9 do",
    "        count[i] = count[i] + count[i-1]",
    "    end for",
    "    // Build output array",
    "    for i from n-1 down to 0 do",
    "        index = (A[i]/exp) % 10",
    "        output[count[index] - 1] = A[i]",
    "        count[index] = count[index] - 1",
    "    end for",
    "    // Copy output to A",
    "    for i from 0 to n-1 do",
    "        A[i] = output[i]",
    "    end for",
    "end procedure"
  ]
};

export const graphPseudocode = {
  bfs: [
    "procedure BFS(G: graph, start: vertex)",
    "    create a queue Q",
    "    mark start as visited",
    "    enqueue start to Q",
    "    while Q is not empty do",
    "        current = dequeue from Q",
    "        for each neighbor of current do",
    "            if neighbor is not visited then",
    "                mark neighbor as visited",
    "                enqueue neighbor to Q",
    "            end if",
    "        end for",
    "    end while",
    "end procedure"
  ],
  dfs: [
    "procedure DFS(G: graph, start: vertex)",
    "    create a stack S",
    "    push start to S",
    "    while S is not empty do",
    "        current = pop from S",
    "        if current is not visited then",
    "            mark current as visited",
    "            for each neighbor of current do",
    "                if neighbor is not visited then",
    "                    push neighbor to S",
    "                end if",
    "            end for",
    "        end if",
    "    end while",
    "end procedure"
  ],
  dijkstra: [
    "procedure Dijkstra(G: graph, start: vertex)",
    "    create a priority queue Q",
    "    set distance[start] = 0",
    "    set distance[v] = ∞ for all other vertices v",
    "    enqueue all vertices to Q",
    "    while Q is not empty do",
    "        u = extract minimum from Q",
    "        for each neighbor v of u do",
    "            if distance[u] + weight(u,v) < distance[v] then",
    "                distance[v] = distance[u] + weight(u,v)",
    "                update priority of v in Q",
    "            end if",
    "        end for",
    "    end while",
    "end procedure"
  ],
  astar: [
    "procedure A*(G: graph, start: vertex, goal: vertex)",
    "    create a priority queue Q",
    "    set gScore[start] = 0",
    "    set fScore[start] = h(start, goal)",
    "    enqueue start to Q",
    "    while Q is not empty do",
    "        current = extract minimum from Q",
    "        if current = goal then",
    "            return reconstruct path",
    "        end if",
    "        for each neighbor of current do",
    "            tentative_gScore = gScore[current] + weight(current,neighbor)",
    "            if tentative_gScore < gScore[neighbor] then",
    "                gScore[neighbor] = tentative_gScore",
    "                fScore[neighbor] = gScore[neighbor] + h(neighbor, goal)",
    "                if neighbor not in Q then",
    "                    enqueue neighbor to Q",
    "                end if",
    "            end if",
    "        end for",
    "    end while",
    "end procedure"
  ],
  prim: [
    "procedure Prim(G: graph, start: vertex)",
    "    create a priority queue Q",
    "    set key[start] = 0",
    "    set key[v] = ∞ for all other vertices v",
    "    enqueue all vertices to Q",
    "    while Q is not empty do",
    "        u = extract minimum from Q",
    "        for each neighbor v of u do",
    "            if v in Q and weight(u,v) < key[v] then",
    "                key[v] = weight(u,v)",
    "                parent[v] = u",
    "                update priority of v in Q",
    "            end if",
    "        end for",
    "    end while",
    "end procedure"
  ],
  kruskal: [
    "procedure Kruskal(G: graph)",
    "    sort edges by weight in non-decreasing order",
    "    create a forest F (a set of trees)",
    "    for each vertex v in G do",
    "        make a set containing v",
    "    end for",
    "    for each edge (u,v) in sorted order do",
    "        if u and v are in different sets then",
    "            add edge (u,v) to F",
    "            merge sets containing u and v",
    "        end if",
    "    end for",
    "end procedure"
  ]
}; 