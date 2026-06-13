// Full 7-stage DSA roadmap — source of truth for all problems in the app.
// Each stage groups topics; each topic holds a list of problems with difficulty + pattern.

export interface ProblemSeed {
  title: string;
  difficulty: 'easy' | 'med' | 'hard';
  pattern: string;
}

export interface TopicSeed {
  name: string;
  problems: ProblemSeed[];
}

export interface StageSeed {
  stage: number;
  title: string;
  topics: TopicSeed[];
}

export const roadmap: StageSeed[] = [
  {
    stage: 1, title: 'Foundations',
    topics: [
      { name: 'Arrays & strings', problems: [
        { title: 'Two sum', difficulty: 'easy', pattern: 'hash map' },
        { title: 'Best time to buy/sell stock', difficulty: 'easy', pattern: 'sliding window' },
        { title: 'Contains duplicate', difficulty: 'easy', pattern: 'hash set' },
        { title: 'Maximum subarray', difficulty: 'easy', pattern: 'kadane' },
        { title: 'Rotate array', difficulty: 'easy', pattern: 'in-place' },
        { title: 'Valid anagram', difficulty: 'easy', pattern: 'frequency count' },
        { title: '3Sum', difficulty: 'med', pattern: 'two pointers' },
        { title: 'Container with most water', difficulty: 'med', pattern: 'two pointers' },
        { title: 'Longest substring without repeat', difficulty: 'med', pattern: 'sliding window' },
        { title: 'Product of array except self', difficulty: 'med', pattern: 'prefix product' },
        { title: 'Trapping rain water', difficulty: 'hard', pattern: 'two pointers' },
      ]},
      { name: 'Hashing', problems: [
        { title: 'Valid anagram', difficulty: 'easy', pattern: 'frequency' },
        { title: 'Ransom note', difficulty: 'easy', pattern: 'frequency' },
        { title: 'Word pattern', difficulty: 'easy', pattern: 'bijection' },
        { title: 'Group anagrams', difficulty: 'med', pattern: 'hash map' },
        { title: 'Top K frequent elements', difficulty: 'med', pattern: 'bucket sort' },
        { title: 'Longest consecutive sequence', difficulty: 'med', pattern: 'hash set' },
      ]},
      { name: 'Two pointers', problems: [
        { title: 'Valid palindrome', difficulty: 'easy', pattern: 'two pointers' },
        { title: 'Reverse string', difficulty: 'easy', pattern: 'two pointers' },
        { title: 'Merge sorted array', difficulty: 'easy', pattern: 'two pointers' },
        { title: '3Sum', difficulty: 'med', pattern: 'sort + two ptr' },
        { title: 'Container with most water', difficulty: 'med', pattern: 'two pointers' },
        { title: 'Remove duplicates', difficulty: 'med', pattern: 'fast/slow ptr' },
        { title: 'Sort colors', difficulty: 'med', pattern: 'dutch flag' },
        { title: 'Trapping rain water', difficulty: 'hard', pattern: 'two pointers' },
      ]},
      { name: 'Sliding window', problems: [
        { title: 'Max average subarray I', difficulty: 'easy', pattern: 'fixed window' },
        { title: 'Minimum size subarray sum', difficulty: 'easy', pattern: 'variable window' },
        { title: 'Longest substring without repeat', difficulty: 'med', pattern: 'variable window' },
        { title: 'Permutation in string', difficulty: 'med', pattern: 'fixed window' },
        { title: 'Fruit into baskets', difficulty: 'med', pattern: 'variable window' },
        { title: 'Longest repeating char replacement', difficulty: 'med', pattern: 'variable window' },
        { title: 'Minimum window substring', difficulty: 'hard', pattern: 'variable window' },
      ]},
    ],
  },
  {
    stage: 2, title: 'Linear data structures',
    topics: [
      { name: 'Linked lists', problems: [
        { title: 'Reverse linked list', difficulty: 'easy', pattern: 'iterative' },
        { title: 'Merge two sorted lists', difficulty: 'easy', pattern: 'iterative' },
        { title: 'Linked list cycle', difficulty: 'easy', pattern: 'fast/slow ptr' },
        { title: 'Middle of linked list', difficulty: 'easy', pattern: 'fast/slow ptr' },
        { title: 'Palindrome linked list', difficulty: 'easy', pattern: 'fast/slow ptr' },
        { title: 'Add two numbers', difficulty: 'med', pattern: 'carry logic' },
        { title: 'Remove Nth node from end', difficulty: 'med', pattern: 'two pointers' },
        { title: 'Reorder list', difficulty: 'med', pattern: 'find mid + reverse' },
        { title: 'LRU cache', difficulty: 'med', pattern: 'hash map + DLL' },
        { title: 'Reverse nodes in k-group', difficulty: 'hard', pattern: 'recursion' },
      ]},
      { name: 'Stacks & queues', problems: [
        { title: 'Valid parentheses', difficulty: 'easy', pattern: 'stack' },
        { title: 'Min stack', difficulty: 'easy', pattern: 'stack' },
        { title: 'Implement queue using stacks', difficulty: 'easy', pattern: 'two stacks' },
        { title: 'Baseball game', difficulty: 'easy', pattern: 'stack' },
        { title: 'Daily temperatures', difficulty: 'med', pattern: 'monotonic stack' },
        { title: 'Evaluate reverse polish notation', difficulty: 'med', pattern: 'stack' },
        { title: 'Decode string', difficulty: 'med', pattern: 'stack' },
        { title: 'Asteroid collision', difficulty: 'med', pattern: 'stack' },
        { title: 'Largest rectangle in histogram', difficulty: 'hard', pattern: 'monotonic stack' },
      ]},
    ],
  },
  {
    stage: 3, title: 'Recursion & sorting',
    topics: [
      { name: 'Recursion basics', problems: [
        { title: 'Fibonacci number', difficulty: 'easy', pattern: 'memoisation' },
        { title: 'Power of two', difficulty: 'easy', pattern: 'recursion' },
        { title: 'Reverse string', difficulty: 'easy', pattern: 'recursion' },
        { title: 'Letter combinations of phone number', difficulty: 'med', pattern: 'backtrack' },
        { title: 'Generate parentheses', difficulty: 'med', pattern: 'backtrack' },
        { title: 'Subsets', difficulty: 'med', pattern: 'backtrack' },
        { title: 'K-th symbol in grammar', difficulty: 'hard', pattern: 'recursion' },
      ]},
      { name: 'Sorting algorithms', problems: [
        { title: 'Sort an array', difficulty: 'med', pattern: 'merge sort' },
        { title: 'Sort colors', difficulty: 'med', pattern: 'quicksort idea' },
        { title: 'Kth largest element', difficulty: 'med', pattern: 'quickselect' },
        { title: 'Merge intervals', difficulty: 'med', pattern: 'sort + merge' },
        { title: 'Count inversions', difficulty: 'hard', pattern: 'merge sort' },
      ]},
      { name: 'Binary search', problems: [
        { title: 'Binary search', difficulty: 'easy', pattern: 'classic' },
        { title: 'Find first/last position', difficulty: 'easy', pattern: 'lower bound' },
        { title: 'Sqrt(x)', difficulty: 'easy', pattern: 'binary search' },
        { title: 'Search in rotated array', difficulty: 'med', pattern: 'modified BS' },
        { title: 'Find min in rotated array', difficulty: 'med', pattern: 'modified BS' },
        { title: 'Search a 2D matrix', difficulty: 'med', pattern: 'flatten BS' },
        { title: 'Time-based key-value store', difficulty: 'med', pattern: 'binary search' },
        { title: 'Koko eating bananas', difficulty: 'med', pattern: 'param search' },
        { title: 'Median of two sorted arrays', difficulty: 'hard', pattern: 'binary search' },
      ]},
    ],
  },
  {
    stage: 4, title: 'Trees & graphs',
    topics: [
      { name: 'Binary trees', problems: [
        { title: 'Maximum depth of binary tree', difficulty: 'easy', pattern: 'DFS' },
        { title: 'Invert binary tree', difficulty: 'easy', pattern: 'DFS' },
        { title: 'Symmetric tree', difficulty: 'easy', pattern: 'DFS' },
        { title: 'Path sum', difficulty: 'easy', pattern: 'DFS' },
        { title: 'Same tree', difficulty: 'easy', pattern: 'DFS' },
        { title: 'Binary tree level order traversal', difficulty: 'med', pattern: 'BFS' },
        { title: 'Validate BST', difficulty: 'med', pattern: 'inorder' },
        { title: 'Lowest common ancestor BST', difficulty: 'med', pattern: 'BST property' },
        { title: 'Construct tree from preorder/inorder', difficulty: 'med', pattern: 'recursion' },
        { title: 'Binary tree right side view', difficulty: 'med', pattern: 'BFS' },
        { title: 'Flatten tree to linked list', difficulty: 'med', pattern: 'Morris' },
        { title: 'Populating next right pointers', difficulty: 'med', pattern: 'BFS' },
        { title: 'Binary tree maximum path sum', difficulty: 'hard', pattern: 'DFS' },
        { title: 'Serialize and deserialize', difficulty: 'hard', pattern: 'BFS/DFS' },
      ]},
      { name: 'Graphs — BFS/DFS', problems: [
        { title: 'Flood fill', difficulty: 'easy', pattern: 'DFS' },
        { title: 'Number of islands', difficulty: 'easy', pattern: 'DFS/BFS' },
        { title: 'Clone graph', difficulty: 'med', pattern: 'BFS' },
        { title: 'Course schedule', difficulty: 'med', pattern: 'topological sort' },
        { title: 'Pacific Atlantic water flow', difficulty: 'med', pattern: 'BFS' },
        { title: 'Number of provinces', difficulty: 'med', pattern: 'union find' },
        { title: 'Rotting oranges', difficulty: 'med', pattern: 'multi-source BFS' },
        { title: '01 matrix', difficulty: 'med', pattern: 'BFS' },
        { title: 'Graph valid tree', difficulty: 'med', pattern: 'union find' },
        { title: 'Word ladder', difficulty: 'hard', pattern: 'BFS' },
        { title: 'Alien dictionary', difficulty: 'hard', pattern: 'topological sort' },
      ]},
      { name: 'Heaps & priority queue', problems: [
        { title: 'Last stone weight', difficulty: 'easy', pattern: 'max heap' },
        { title: 'Kth largest in array', difficulty: 'med', pattern: 'min heap' },
        { title: 'Top K frequent elements', difficulty: 'med', pattern: 'heap' },
        { title: 'Find K closest points', difficulty: 'med', pattern: 'min heap' },
        { title: 'Task scheduler', difficulty: 'med', pattern: 'max heap' },
        { title: 'Merge K sorted lists', difficulty: 'hard', pattern: 'min heap' },
        { title: 'Find median from data stream', difficulty: 'hard', pattern: 'two heaps' },
      ]},
    ],
  },
  {
    stage: 5, title: 'Dynamic programming',
    topics: [
      { name: '1D DP', problems: [
        { title: 'Climbing stairs', difficulty: 'easy', pattern: 'fibonacci-like' },
        { title: 'House robber', difficulty: 'easy', pattern: 'dp' },
        { title: 'Min cost climbing stairs', difficulty: 'easy', pattern: 'dp' },
        { title: 'Coin change', difficulty: 'med', pattern: 'unbounded knapsack' },
        { title: 'Longest increasing subsequence', difficulty: 'med', pattern: 'dp + binary search' },
        { title: 'Word break', difficulty: 'med', pattern: 'dp' },
        { title: 'Decode ways', difficulty: 'med', pattern: 'dp' },
        { title: 'House robber II', difficulty: 'med', pattern: 'dp + cycle' },
        { title: 'Jump game II', difficulty: 'hard', pattern: 'greedy/dp' },
      ]},
      { name: '2D DP', problems: [
        { title: 'Pascal triangle', difficulty: 'easy', pattern: '2d dp' },
        { title: 'Unique paths', difficulty: 'med', pattern: 'grid dp' },
        { title: 'Minimum path sum', difficulty: 'med', pattern: 'grid dp' },
        { title: 'Longest common subsequence', difficulty: 'med', pattern: 'string dp' },
        { title: 'Coin change II', difficulty: 'med', pattern: 'knapsack' },
        { title: 'Target sum', difficulty: 'med', pattern: 'knapsack' },
        { title: 'Edit distance', difficulty: 'hard', pattern: 'string dp' },
        { title: 'Regular expression matching', difficulty: 'hard', pattern: 'string dp' },
      ]},
      { name: 'Greedy', problems: [
        { title: 'Best time buy/sell stock', difficulty: 'easy', pattern: 'greedy' },
        { title: 'Jump game', difficulty: 'easy', pattern: 'greedy' },
        { title: 'Jump game II', difficulty: 'med', pattern: 'greedy' },
        { title: 'Gas station', difficulty: 'med', pattern: 'greedy' },
        { title: 'Partition labels', difficulty: 'med', pattern: 'greedy' },
        { title: 'Merge intervals', difficulty: 'med', pattern: 'greedy' },
        { title: 'Candy', difficulty: 'hard', pattern: 'two-pass greedy' },
      ]},
    ],
  },
  {
    stage: 6, title: 'Advanced structures',
    topics: [
      { name: 'Tries', problems: [
        { title: 'Longest word in dictionary', difficulty: 'easy', pattern: 'trie' },
        { title: 'Implement trie', difficulty: 'med', pattern: 'design' },
        { title: 'Design add/search words', difficulty: 'med', pattern: 'trie + DFS' },
        { title: 'Replace words', difficulty: 'med', pattern: 'trie' },
        { title: 'Word search II', difficulty: 'hard', pattern: 'trie + backtrack' },
      ]},
      { name: 'Union find', problems: [
        { title: 'Number of provinces', difficulty: 'med', pattern: 'union find' },
        { title: 'Graph valid tree', difficulty: 'med', pattern: 'union find' },
        { title: 'Redundant connection', difficulty: 'med', pattern: 'union find' },
        { title: 'Accounts merge', difficulty: 'med', pattern: 'union find' },
        { title: 'Smallest string with swaps', difficulty: 'med', pattern: 'union find' },
        { title: 'Number of islands II', difficulty: 'hard', pattern: 'union find' },
      ]},
      { name: 'Backtracking', problems: [
        { title: 'Subsets', difficulty: 'med', pattern: 'backtrack' },
        { title: 'Permutations', difficulty: 'med', pattern: 'backtrack' },
        { title: 'Combination sum', difficulty: 'med', pattern: 'backtrack' },
        { title: 'Letter combinations', difficulty: 'med', pattern: 'backtrack' },
        { title: 'Palindrome partitioning', difficulty: 'med', pattern: 'backtrack' },
        { title: 'N-Queens', difficulty: 'hard', pattern: 'backtrack' },
        { title: 'Sudoku solver', difficulty: 'hard', pattern: 'backtrack + constraint' },
      ]},
    ],
  },
  {
    stage: 7, title: 'Expert patterns',
    topics: [
      { name: 'Bit manipulation', problems: [
        { title: 'Single number', difficulty: 'easy', pattern: 'XOR' },
        { title: 'Number of 1 bits', difficulty: 'easy', pattern: 'bit count' },
        { title: 'Reverse bits', difficulty: 'easy', pattern: 'bit ops' },
        { title: 'Missing number', difficulty: 'easy', pattern: 'XOR' },
        { title: 'Counting bits', difficulty: 'easy', pattern: 'dp + bits' },
        { title: 'Sum of two integers', difficulty: 'med', pattern: 'bit ops' },
        { title: 'Bitwise AND of numbers range', difficulty: 'med', pattern: 'bit ops' },
        { title: 'Subsets', difficulty: 'med', pattern: 'bitmask' },
      ]},
      { name: 'Intervals', problems: [
        { title: 'Meeting rooms', difficulty: 'easy', pattern: 'sort' },
        { title: 'Merge intervals', difficulty: 'med', pattern: 'sort + merge' },
        { title: 'Insert interval', difficulty: 'med', pattern: 'linear scan' },
        { title: 'Non-overlapping intervals', difficulty: 'med', pattern: 'greedy' },
        { title: 'Meeting rooms II', difficulty: 'med', pattern: 'min heap' },
        { title: 'Employee free time', difficulty: 'hard', pattern: 'merge intervals' },
      ]},
      { name: 'Advanced graphs', problems: [
        { title: 'Network delay time', difficulty: 'med', pattern: 'dijkstra' },
        { title: 'Cheapest flights K stops', difficulty: 'med', pattern: 'bellman-ford' },
        { title: 'Min cost to connect points', difficulty: 'med', pattern: 'prims/kruskal' },
        { title: 'Critical connections', difficulty: 'hard', pattern: 'tarjans' },
        { title: 'Course schedule III', difficulty: 'hard', pattern: 'greedy + heap' },
        { title: 'Swim in rising water', difficulty: 'hard', pattern: 'dijkstra' },
      ]},
    ],
  },
];
