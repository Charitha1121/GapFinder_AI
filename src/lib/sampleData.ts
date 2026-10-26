import { DocumentSource, Topic, Question, GapReport, RevisionPlan, ProgressHistoryEntry, UserProfile } from '@/types';

export const DEMO_USER: UserProfile = {
  id: 'judge-01',
  name: 'Alex Rivera (Judge Mode)',
  email: 'judge@gapfinder.ai',
  role: 'judge',
  courseName: 'CS 204: Advanced Data Structures, Algorithms & Distributed Systems',
  examDate: '2026-11-05',
  dailyStudyHours: 2.5,
};

export const FRESH_STUDENT: UserProfile = {
  id: 'student-new',
  name: 'Taylor Brooks (Student)',
  email: 'student@gapfinder.ai',
  role: 'student',
  courseName: 'CS 204: Advanced Data Structures, Algorithms & Distributed Systems',
  examDate: '2026-11-12',
  dailyStudyHours: 2.0,
};

export const SAMPLE_DOCUMENTS: DocumentSource[] = [
  {
    id: 'doc-syllabus-01',
    title: 'CS204_Official_Syllabus_Fall2026.pdf',
    type: 'syllabus',
    fileSize: '142 KB',
    pageCount: 6,
    chunksCount: 8,
    uploadedAt: '2026-10-24 09:30',
    description: 'Course syllabus defining units, learning outcomes, and exam weightage distribution.',
    content: `COURSE SYLLABUS: CS 204 - ADVANCED DATA STRUCTURES, ALGORITHMS & DISTRIBUTED SYSTEMS
Department of Computer Science & Engineering
Credits: 4.0 | Prerequisites: CS 101, Discrete Mathematics

COURSE OBJECTIVES:
Equip students with deep theoretical and practical understanding of non-linear data structures, graph traversals, amortized complexity, dynamic programming, and scalable distributed algorithms.

UNIT 1: BALANCED SEARCH TREES AND ADVANCED HEAPS (Weight: 25%)
- Binary Search Tree (BST) property, worst-case degeneration to linked lists.
- AVL Trees: Balance factor invariant [-1, 0, 1]. Rotations: Left-Left (LL), Right-Right (RR), Left-Right (LR), and Right-Left (RL).
- Red-Black Trees: Color invariants, black height consistency, O(log N) worst-case search and deletion bounds.
- Binary Heaps vs Fibonacci Heaps: Amortized O(1) decrease-key operation and priority queues.

UNIT 2: GRAPH ALGORITHMS AND TRAVERSAL THEORY (Weight: 25%)
- Graph representations: Adjacency Matrix vs Adjacency List (memory & lookup trade-offs).
- Breadth-First Search (BFS): Shortest path in unweighted graphs, queue invariant, level-order expansion.
- Depth-First Search (DFS): Recursion stack, parenthesis theorem, edge classification (tree, back, forward, cross).
- Topological Sorting: Kahn's in-degree queue algorithm and DFS finishing times order; DAG cycle detection.
- Single Source Shortest Path: Dijkstra's greedy algorithm with min-heap vs Bellman-Ford for negative edge weights.

UNIT 3: DYNAMIC PROGRAMMING AND RECURRENCE RELATIONS (Weight: 25%)
- Optimal substructure and overlapping subproblems: Divide-and-conquer contrast.
- Memoization (top-down) vs Tabulation (bottom-up space optimization).
- The 0/1 Knapsack Problem: State representation dp[i][w], transition equations, pseudo-polynomial complexity O(n*W).
- Longest Common Subsequence (LCS) and Edit Distance: Matrix formulation and traceback reconstruct.

UNIT 4: DISTRIBUTED SYSTEMS ARCHITECTURE & CONSENSUS (Weight: 25%)
- The CAP Theorem: Inevitability of network partitions; Consistency vs Availability trade-offs.
- Consistent Hashing: Virtual nodes, ring topology, load balancing during dynamic node joining and leaving.
- Raft Consensus Protocol: Leader election, heartbeat intervals, log replication invariants, and split-brain mitigation.`,
  },
  {
    id: 'doc-notes-01',
    title: 'Textbook_Unit1_Balanced_Trees_Notes.pdf',
    type: 'notes',
    fileSize: '840 KB',
    pageCount: 28,
    chunksCount: 16,
    uploadedAt: '2026-10-24 10:15',
    description: 'Detailed textbook notes on AVL trees, rotation triggers, and Fibonacci heap amortized analysis.',
    content: `CHAPTER 4: BALANCED SEARCH STRUCTURES
SECTION 4.1: AVL TREE BALANCING INVARIANTS
An AVL tree is a self-balancing binary search tree. For every node x, the balance factor BF(x) = height(left_subtree) - height(right_subtree).
The AVL invariant mandates that for all nodes x in the tree, BF(x) must be in {-1, 0, +1}.
When an insertion or deletion results in |BF(x)| >= 2, rebalancing via tree rotations is immediately required.

SECTION 4.2: ROTATION CLASSIFICATION & IMPLEMENTATION
1. Left-Left (LL) Heavy: A new key is inserted into the left subtree of the left child. Solved by a single Right Rotation at the imbalanced ancestor.
2. Right-Right (RR) Heavy: A new key is inserted into the right subtree of the right child. Solved by a single Left Rotation at the ancestor.
3. Left-Right (LR) Heavy: A new key is inserted into the right subtree of the left child. Requires a Double Rotation: First a Left Rotation on the left child, followed by a Right Rotation on the imbalanced ancestor node.
4. Right-Left (RL) Heavy: A new key is inserted into the left subtree of the right child. Requires a Double Rotation: First a Right Rotation on the right child, followed by a Left Rotation on the imbalanced ancestor node.
CRITICAL EXAM NOTE: In an LR case, performing only a single rotation fails to balance the tree and violates BST ordering properties.

SECTION 4.3: FIBONACCI HEAPS AND AMORTIZED SPEEDUP
Standard binary heaps require O(log N) time for decrease-key operations. A Fibonacci heap improves decrease-key to amortized O(1) time using a lazy consolidation strategy. Trees are only merged during delete-min operations, leaving root trees unconsolidated until necessary.`,
  },
  {
    id: 'doc-notes-02',
    title: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
    type: 'notes',
    fileSize: '1.2 MB',
    pageCount: 42,
    chunksCount: 22,
    uploadedAt: '2026-10-24 10:20',
    description: 'Lecture notes covering BFS/DFS optimality, DAG topological sort, and DP state compression.',
    content: `LECTURE 9: ADVANCED GRAPH TRAVERSAL
SECTION 9.1: BREADTH-FIRST SEARCH OPTIMALITY LIMITATIONS
BFS explores nodes in increasing distance from the source vertex s. It guarantees the absolute shortest path IF AND ONLY IF all edge weights are uniform (or all weights are 1).
If edge weights vary, BFS does NOT guarantee shortest path because an edge with weight 10 might be expanded before two alternate hops of weight 1 + 1 = 2. In weighted graphs with non-negative weights, Dijkstra's algorithm must be used.

SECTION 9.2: TOPOLOGICAL SORTING & CYCLE DETECTION
A topological sort exists if and only if the directed graph contains NO directed cycles (i.e., it is a Directed Acyclic Graph - DAG).
Kahn's Algorithm operates by computing in-degrees:
Step 1: Compute in-degree for all vertices.
Step 2: Enqueue all vertices with in-degree = 0.
Step 3: Pop vertex u from queue, decrement in-degree of all its neighbors. If neighbor reaches in-degree 0, enqueue it.
If the count of popped vertices does NOT equal total vertices V, the graph has at least one cycle and topological ordering is impossible.

LECTURE 14: DYNAMIC PROGRAMMING FORMULATION
SECTION 14.1: 0/1 KNAPSACK EQUATIONS & SPACE COMPRESSION
Let dp[i][w] represent the maximum value obtainable using a subset of the first i items with a maximum total weight capacity w.
Recurrence:
If item i weight wt[i-1] > w: dp[i][w] = dp[i-1][w]
Else: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])
Space Optimization: We can compute dp in a 1D array of size W+1 by iterating the inner capacity loop BACKWARDS from W down to wt[i-1] to prevent using the same item multiple times.`,
  },
  {
    id: 'doc-notes-03',
    title: 'Distributed_Systems_Core_Concepts.pdf',
    type: 'notes',
    fileSize: '650 KB',
    pageCount: 19,
    chunksCount: 11,
    uploadedAt: '2026-10-24 10:45',
    description: 'Covers CAP theorem nuances, Raft leader election, and consistent hashing ring mechanics.',
    content: `DISTRIBUTED SYSTEMS MONOGRAPH
SECTION 1.1: CAP THEOREM REALITY CHECK
Eric Brewer's CAP Theorem states that a distributed data store can guarantee at most two of: Consistency, Availability, and Partition Tolerance.
Because physical network cables and switches can and do fail, Partition Tolerance (P) is mandatory for any real-world distributed system. Therefore, when a network partition occurs, the system must make a fundamental design choice between:
- CP (Consistency over Availability): Reject or stall requests that cannot be confirmed across partitioned nodes to preserve strict linearization.
- AP (Availability over Consistency): Serve requests using local node state, accepting that stale or divergent data may be returned temporarily.

SECTION 1.2: CONSISTENT HASHING & VIRTUAL NODES
Traditional hash modulo N (hash(key) % N) causes massive cache invalidation when N changes, moving nearly (N-1)/N keys.
Consistent hashing places both nodes and keys onto a circular 360-degree ring (range 0 to 2^32 - 1). A key is assigned to the first node encountered clockwise.
Virtual Nodes: Assigning multiple hash points (replicas) per physical server avoids hotspots and ensures uniform key distribution across machines with varying hardware capacities.`,
  },
  {
    id: 'doc-past-papers-01',
    title: 'Past_Exams_Compilation_2023_2025.pdf',
    type: 'past_paper',
    fileSize: '490 KB',
    pageCount: 14,
    chunksCount: 9,
    uploadedAt: '2026-10-24 11:00',
    description: 'Actual questions from Midterm and Final examinations from the previous academic year.',
    content: `FALL 2024 FINAL EXAMINATION: ADVANCED DATA STRUCTURES
QUESTION 3 (10 MARKS) - BALANCED TREES:
Consider an AVL tree where key 45 is inserted into the right subtree of node 30, which is itself the left child of root 50.
Part A: Identify the resulting imbalance type at the root node 50.
Part B: Write the exact two-step rotation sequence required to restore the AVL balance property without violating the Binary Search Tree invariant.
COMMON STUDENT ERROR NOTE: Over 40% of students mistakenly attempted a single right rotation at 50 instead of the required Left-Right (LR) double rotation.

QUESTION 7 (10 MARKS) - SHORTEST PATHS:
A student claims: "Breadth-First Search (BFS) is always faster than Dijkstra's algorithm, so we should always use BFS to find the shortest path in any road network."
Critique this statement. Provide a counter-example where BFS returns an incorrect shortest path.

QUESTION 11 (10 MARKS) - DYNAMIC PROGRAMMING:
Explain why the inner loop of the space-optimized 1D 0/1 knapsack algorithm must iterate backwards from W to 0, whereas the unbounded knapsack problem iterates forwards from 0 to W.`,
  },
];

export const SAMPLE_TOPICS: Topic[] = [
  {
    id: 'top-avl-trees',
    unitId: 'unit-1',
    unitName: 'Unit 1: Balanced Search Trees',
    name: 'AVL Trees & Rotations (LL, RR, LR, RL)',
    description: 'Balance factor invariants, single and double rotations after insertion/deletion.',
    examWeight: 15,
    difficulty: 'intermediate',
    prerequisites: ['Binary Search Tree Property'],
    status: 'weak',
    masteryScore: 35,
    assessedQuestionsCount: 4,
    citationsCount: 6,
  },
  {
    id: 'top-fib-heaps',
    unitId: 'unit-1',
    unitName: 'Unit 1: Balanced Search Trees',
    name: 'Fibonacci Heaps & Amortized Complexity',
    description: 'Lazy tree consolidation, O(1) amortized decrease-key priority queues.',
    examWeight: 10,
    difficulty: 'advanced',
    prerequisites: ['Binary Heap', 'Amortized Analysis'],
    status: 'strong',
    masteryScore: 85,
    assessedQuestionsCount: 3,
    citationsCount: 4,
  },
  {
    id: 'top-bfs-opt',
    unitId: 'unit-2',
    unitName: 'Unit 2: Graph Algorithms',
    name: 'BFS Shortest Path & Edge Weight Limitations',
    description: 'Uniform weight requirement for BFS shortest path optimality vs Dijkstra algorithm.',
    examWeight: 12,
    difficulty: 'beginner',
    prerequisites: ['Queue Invariant', 'Adjacency Lists'],
    status: 'medium',
    masteryScore: 60,
    assessedQuestionsCount: 4,
    citationsCount: 5,
  },
  {
    id: 'top-topo-sort',
    unitId: 'unit-2',
    unitName: 'Unit 2: Graph Algorithms',
    name: 'Topological Sort & Kahn DAG Cycle Detection',
    description: 'In-degree queue tracking, DAG ordering, and cycle detection validation.',
    examWeight: 13,
    difficulty: 'intermediate',
    prerequisites: ['DFS Traversal', 'Directed Graphs'],
    status: 'weak',
    masteryScore: 40,
    assessedQuestionsCount: 3,
    citationsCount: 5,
  },
  {
    id: 'top-01-knapsack',
    unitId: 'unit-3',
    unitName: 'Unit 3: Dynamic Programming',
    name: '0/1 Knapsack & 1D Space Optimization',
    description: 'State transition, recurrence relations, and reverse loop iteration in 1D array.',
    examWeight: 15,
    difficulty: 'advanced',
    prerequisites: ['Recursion', 'Memoization'],
    status: 'medium',
    masteryScore: 68,
    assessedQuestionsCount: 4,
    citationsCount: 6,
  },
  {
    id: 'top-lcs-dp',
    unitId: 'unit-3',
    unitName: 'Unit 3: Dynamic Programming',
    name: 'Longest Common Subsequence (LCS)',
    description: '2D matrix table formulation, character matching, and path reconstruction.',
    examWeight: 10,
    difficulty: 'intermediate',
    prerequisites: ['String Manipulation', 'DP Grids'],
    status: 'strong',
    masteryScore: 92,
    assessedQuestionsCount: 3,
    citationsCount: 4,
  },
  {
    id: 'top-cap-theorem',
    unitId: 'unit-4',
    unitName: 'Unit 4: Distributed Systems',
    name: 'CAP Theorem & Network Partition Trade-offs',
    description: 'CP vs AP systems under network partitions; strict consistency vs local availability.',
    examWeight: 12,
    difficulty: 'intermediate',
    prerequisites: ['Distributed Networks'],
    status: 'strong',
    masteryScore: 88,
    assessedQuestionsCount: 3,
    citationsCount: 4,
  },
  {
    id: 'top-consistent-hashing',
    unitId: 'unit-4',
    unitName: 'Unit 4: Distributed Systems',
    name: 'Consistent Hashing & Virtual Nodes',
    description: 'Ring topology, key re-mapping minimization, and hot spot mitigation.',
    examWeight: 13,
    difficulty: 'advanced',
    prerequisites: ['Hash Tables', 'System Architecture'],
    status: 'strong',
    masteryScore: 90,
    assessedQuestionsCount: 3,
    citationsCount: 5,
  },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q-avl-01',
    topicId: 'top-avl-trees',
    topicName: 'AVL Trees & Rotations (LL, RR, LR, RL)',
    unitName: 'Unit 1: Balanced Search Trees',
    type: 'scenario',
    difficulty: 'medium',
    prompt:
      'In an AVL Tree, node 50 is the root. Node 30 is its left child. You insert key 45 into node 30’s right subtree, causing node 50 to have a balance factor of +2. What exact rotation sequence must be performed to restore the balance factor invariant?',
    options: [
      { id: 'opt-a', text: 'A single Right Rotation at root node 50' },
      { id: 'opt-b', text: 'Left Rotation on child node 30, followed by Right Rotation on root node 50 (LR Double Rotation)' },
      { id: 'opt-c', text: 'Right Rotation on child node 30, followed by Left Rotation on root node 50 (RL Double Rotation)' },
      { id: 'opt-d', text: 'A single Left Rotation at child node 30 only' },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'The newly inserted key 45 is in the right subtree of node 30, which itself is the left child of node 50. This creates an LR (Left-Right) imbalance. As documented in Section 4.2 of the lecture notes, an LR imbalance strictly requires a double rotation: first a Left rotation around node 30 (converting it to LL form), followed by a Right rotation around node 50.',
    citation: {
      docTitle: 'Textbook_Unit1_Balanced_Trees_Notes.pdf',
      docType: 'notes',
      section: 'Section 4.2: Rotation Classification & Implementation',
      pageSnippet:
        'Left-Right (LR) Heavy: A new key is inserted into the right subtree of the left child. Requires a Double Rotation: First a Left Rotation on the left child, followed by a Right Rotation on the imbalanced ancestor node.',
      pageNumber: 8,
    },
    pastPaperRef: 'Fall 2024 Final Exam - Question 3',
  },
  {
    id: 'q-topo-01',
    topicId: 'top-topo-sort',
    topicName: 'Topological Sort & Kahn DAG Cycle Detection',
    unitName: 'Unit 2: Graph Algorithms',
    type: 'mcq',
    difficulty: 'medium',
    prompt:
      'During Kahn’s algorithm for topological sorting on a graph with V vertices, when the queue becomes empty, only V - 2 vertices have been processed. What does this outcome conclusively prove about the input graph?',
    options: [
      { id: 'opt-a', text: 'The graph is a valid DAG with 2 isolated vertices' },
      { id: 'opt-b', text: 'The graph contains at least one directed cycle' },
      { id: 'opt-c', text: 'The graph has negative edge weights' },
      { id: 'opt-d', text: 'The graph has multiple topological sorts' },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'In Kahn’s algorithm, nodes participating in a directed cycle never reach an in-degree of 0 because every node in the cycle has at least one incoming edge from another node in the cycle. Therefore, if the total processed vertices < V, the graph must contain at least one directed cycle.',
    citation: {
      docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
      docType: 'notes',
      section: 'Section 9.2: Topological Sorting & Cycle Detection',
      pageSnippet:
        'If the count of popped vertices does NOT equal total vertices V, the graph has at least one cycle and topological ordering is impossible.',
      pageNumber: 15,
    },
    pastPaperRef: 'Midterm 2023 - Question 5B',
  },
  {
    id: 'q-bfs-01',
    topicId: 'top-bfs-opt',
    topicName: 'BFS Shortest Path & Edge Weight Limitations',
    unitName: 'Unit 2: Graph Algorithms',
    type: 'scenario',
    difficulty: 'easy',
    prompt:
      'Under which specific condition does standard Breadth-First Search (BFS) guarantee returning the minimum total weight path from source vertex S to destination vertex T?',
    options: [
      { id: 'opt-a', text: 'When all edge weights are positive and non-zero' },
      { id: 'opt-b', text: 'Only when all edge weights are uniform (equal or unweighted)' },
      { id: 'opt-c', text: 'When the graph is completely acyclic (DAG)' },
      { id: 'opt-d', text: 'BFS always guarantees shortest path in all directed graphs' },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'BFS explores level-by-level based on number of hops (edges). It only equates to minimum total weight when each hop incurs an identical cost (e.g. all weights = 1). When weights differ, a path with 1 heavy edge (weight 10) will be visited before a 2-hop lighter path (weight 1 + 1 = 2).',
    citation: {
      docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
      docType: 'notes',
      section: 'Section 9.1: Breadth-First Search Optimality Limitations',
      pageSnippet:
        'BFS explores nodes in increasing distance from the source vertex s. It guarantees the absolute shortest path IF AND ONLY IF all edge weights are uniform (or all weights are 1).',
      pageNumber: 12,
    },
    pastPaperRef: 'Fall 2024 Final Exam - Question 7',
  },
  {
    id: 'q-knapsack-01',
    topicId: 'top-01-knapsack',
    topicName: '0/1 Knapsack & 1D Space Optimization',
    unitName: 'Unit 3: Dynamic Programming',
    type: 'code_analysis',
    difficulty: 'hard',
    prompt:
      'When optimizing the 0/1 Knapsack dynamic programming table from 2D `dp[n][W]` to a single 1D array `dp[W]`, why MUST the inner capacity loop run backwards from W down to wt[i] instead of forward from 0 to W?',
    options: [
      { id: 'opt-a', text: 'To avoid an ArrayOutOfBounds exception on memory caches' },
      { id: 'opt-b', text: 'To prevent using the current item multiple times in the same iteration (unbounded reuse)' },
      { id: 'opt-c', text: 'Because backward loops compile faster in modern CPU branch predictors' },
      { id: 'opt-d', text: 'To maintain the optimal substructure invariant for negative weights' },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'If you iterate forward from wt[i] to W, `dp[w - wt[i]]` would have already been updated in the CURRENT item iteration, thereby allowing item i to be included repeatedly (which solves the Unbounded Knapsack problem, not 0/1 Knapsack). Iterating backwards ensures `dp[w - wt[i]]` references the state from the PREVIOUS item iteration.',
    citation: {
      docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
      docType: 'notes',
      section: 'Section 14.1: 0/1 Knapsack Equations & Space Compression',
      pageSnippet:
        'We can compute dp in a 1D array of size W+1 by iterating the inner capacity loop BACKWARDS from W down to wt[i-1] to prevent using the same item multiple times.',
      pageNumber: 31,
    },
    pastPaperRef: 'Fall 2024 Final Exam - Question 11',
  },
  {
    id: 'q-cap-01',
    topicId: 'top-cap-theorem',
    topicName: 'CAP Theorem & Network Partition Trade-offs',
    unitName: 'Unit 4: Distributed Systems',
    type: 'mcq',
    difficulty: 'easy',
    prompt:
      'According to the CAP Theorem, why can a distributed production system never realistically be designed as a purely "CA" (Consistent and Available) system across real-world wide area networks?',
    options: [
      { id: 'opt-a', text: 'Because consistency protocols consume too much CPU power' },
      { id: 'opt-b', text: 'Because physical network partitions (P) are unavoidable; when partitions occur, systems must choose between C or A' },
      { id: 'opt-c', text: 'Because database disk drives fail more frequently than network cables' },
      { id: 'opt-d', text: 'Because CA systems violate ACID transaction constraints' },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'As stated in the Distributed Systems Monograph Section 1.1, network cables and routers will inevitably fail or suffer latency spikes. Partition Tolerance (P) is an immutable physical reality of networks, forcing distributed architects to choose between Consistency (CP) or Availability (AP) during a partition.',
    citation: {
      docTitle: 'Distributed_Systems_Core_Concepts.pdf',
      docType: 'notes',
      section: 'Section 1.1: CAP Theorem Reality Check',
      pageSnippet:
        'Because physical network cables and switches can and do fail, Partition Tolerance (P) is mandatory for any real-world distributed system. Therefore, when a network partition occurs, the system must make a fundamental design choice between CP or AP.',
      pageNumber: 3,
    },
  },
  {
    id: 'q-ch-01',
    topicId: 'top-consistent-hashing',
    topicName: 'Consistent Hashing & Virtual Nodes',
    unitName: 'Unit 4: Distributed Systems',
    type: 'mcq',
    difficulty: 'medium',
    prompt:
      'What primary problem does the introduction of "Virtual Nodes" (vnodes) solve in a Consistent Hashing ring architecture?',
    options: [
      { id: 'opt-a', text: 'Reduces SHA-256 calculation latency' },
      { id: 'opt-b', text: 'Prevents non-uniform key distribution hotspots caused by non-contiguous random hash spacing' },
      { id: 'opt-c', text: 'Eliminates the need for Raft leader elections' },
      { id: 'opt-d', text: 'Guarantees Byzantine Fault Tolerance across untrusted nodes' },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'When only a few physical nodes are mapped to a hash ring, random distribution can cause severe data clustering (one server receiving 70% of keys). Assigning multiple virtual nodes per physical machine evenly distributes key ranges around the 360-degree circle.',
    citation: {
      docTitle: 'Distributed_Systems_Core_Concepts.pdf',
      docType: 'notes',
      section: 'Section 1.2: Consistent Hashing & Virtual Nodes',
      pageSnippet:
        'Assigning multiple hash points (replicas) per physical server avoids hotspots and ensures uniform key distribution across machines with varying hardware capacities.',
      pageNumber: 7,
    },
  },
];

export const INITIAL_PRELOADED_GAP_REPORT: GapReport = {
  id: 'gap-rep-demo-01',
  overallScore: 68,
  examRiskLevel: 'Moderate',
  totalQuestions: 12,
  correctCount: 8,
  generatedAt: '2026-10-25 18:40',
  summary:
    'Diagnostic evaluation revealed deep conceptual gaps in Unit 1 (AVL Tree Double Rotations) and Unit 2 (Kahn Algorithm Cycle Detection Invariants). Strong retention in Distributed Systems (CAP & Consistent Hashing) and LCS Dynamic Programming.',
  weakTopics: [
    {
      topicId: 'top-avl-trees',
      topicName: 'AVL Trees & Rotations (LL, RR, LR, RL)',
      unitName: 'Unit 1: Balanced Search Trees',
      masteryScore: 35,
      status: 'weak',
      examWeight: 15,
      reason:
        'Failed 2 out of 3 questions regarding rotation direction triggers. Confused single Right Rotation with double Left-Right (LR) sequence when new key is inserted in child right subtree.',
      missedConcepts: [
        'LR double rotation two-step order',
        'Balance Factor formula (Left height - Right height)',
        'BST property retention during rotation',
      ],
      recommendedFocus:
        'Focus on Section 4.2 of Textbook Unit 1 Notes. Draw tree states step-by-step for key insertions in zigzag paths.',
      citations: [
        {
          docTitle: 'Textbook_Unit1_Balanced_Trees_Notes.pdf',
          docType: 'notes',
          section: 'Section 4.2: Rotation Classification & Implementation',
          pageSnippet:
            'Left-Right (LR) Heavy: Requires a Double Rotation: First a Left Rotation on the left child, followed by a Right Rotation on the imbalanced ancestor node.',
          pageNumber: 8,
        },
      ],
    },
    {
      topicId: 'top-topo-sort',
      topicName: 'Topological Sort & Kahn DAG Cycle Detection',
      unitName: 'Unit 2: Graph Algorithms',
      masteryScore: 40,
      status: 'weak',
      examWeight: 13,
      reason:
        'Misdiagnosed the queue termination condition in Kahn algorithm. Did not connect (processed count < V) to the presence of directed cycles with in-degree deadlock.',
      missedConcepts: [
        'Kahn in-degree decrement cycle deadlock',
        'Topological ordering requirement of DAG',
        'Parenthesis theorem in DFS edge classification',
      ],
      recommendedFocus:
        'Review Lecture 9 Section 9.2. Trace Kahn algorithm on a small 4-node graph containing a directed cycle.',
      citations: [
        {
          docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
          docType: 'notes',
          section: 'Section 9.2: Topological Sorting & Cycle Detection',
          pageSnippet:
            'If the count of popped vertices does NOT equal total vertices V, the graph has at least one cycle and topological ordering is impossible.',
          pageNumber: 15,
        },
      ],
    },
  ],
  mediumTopics: [
    {
      topicId: 'top-bfs-opt',
      topicName: 'BFS Shortest Path & Edge Weight Limitations',
      unitName: 'Unit 2: Graph Algorithms',
      masteryScore: 60,
      status: 'medium',
      examWeight: 12,
      reason:
        'Understands queue expansion mechanism, but hesitated on weight constraint applicability. Selected correct option after second thought.',
      missedConcepts: ['Weighted edge failure cases in BFS', 'Dijkstra greedy comparison'],
      recommendedFocus: 'Review Fall 2024 Exam Question 7 counter-example.',
      citations: [
        {
          docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
          docType: 'notes',
          section: 'Section 9.1: Breadth-First Search Optimality Limitations',
          pageSnippet:
            'BFS explores nodes in increasing distance from the source vertex s. It guarantees the absolute shortest path IF AND ONLY IF all edge weights are uniform.',
          pageNumber: 12,
        },
      ],
    },
    {
      topicId: 'top-01-knapsack',
      topicName: '0/1 Knapsack & 1D Space Optimization',
      unitName: 'Unit 3: Dynamic Programming',
      masteryScore: 68,
      status: 'medium',
      examWeight: 15,
      reason:
        'Understands 2D recurrence relation, but struggled to explain WHY backward iteration in 1D array prevents unbounded item duplication.',
      missedConcepts: ['Backward array overwrite vs forward reuse', 'Space complexity reduction O(nW) to O(W)'],
      recommendedFocus: 'Walk through 1D array values by hand with W=5 and items wt=[2, 3].',
      citations: [
        {
          docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
          docType: 'notes',
          section: 'Section 14.1: 0/1 Knapsack Equations & Space Compression',
          pageSnippet:
            'We can compute dp in a 1D array of size W+1 by iterating the inner capacity loop BACKWARDS from W down to wt[i-1].',
          pageNumber: 31,
        },
      ],
    },
  ],
  strongTopics: [
    {
      topicId: 'top-fib-heaps',
      topicName: 'Fibonacci Heaps & Amortized Complexity',
      unitName: 'Unit 1: Balanced Search Trees',
      masteryScore: 85,
      status: 'strong',
      examWeight: 10,
      reason: 'Perfect responses on decrease-key O(1) amortized bounds and lazy merging mechanics.',
      missedConcepts: [],
      recommendedFocus: 'Maintain retention with occasional quick review before exams.',
      citations: [],
    },
    {
      topicId: 'top-lcs-dp',
      topicName: 'Longest Common Subsequence (LCS)',
      unitName: 'Unit 3: Dynamic Programming',
      masteryScore: 92,
      status: 'strong',
      examWeight: 10,
      reason: 'Strong mastery of 2D matrix dynamic table formulation and diagonal traceback.',
      missedConcepts: [],
      recommendedFocus: 'Solid understanding confirmed. No immediate revision needed.',
      citations: [],
    },
    {
      topicId: 'top-cap-theorem',
      topicName: 'CAP Theorem & Network Partition Trade-offs',
      unitName: 'Unit 4: Distributed Systems',
      masteryScore: 88,
      status: 'strong',
      examWeight: 12,
      reason: 'Understands why Partition Tolerance is mandatory and how CP vs AP systems behave under failure.',
      missedConcepts: [],
      recommendedFocus: 'No action required.',
      citations: [],
    },
    {
      topicId: 'top-consistent-hashing',
      topicName: 'Consistent Hashing & Virtual Nodes',
      unitName: 'Unit 4: Distributed Systems',
      masteryScore: 90,
      status: 'strong',
      examWeight: 13,
      reason: 'Accurately articulated ring topology assignment and virtual node load balancing.',
      missedConcepts: [],
      recommendedFocus: 'No action required.',
      citations: [],
    },
  ],
  confidentMisconceptions: [
    {
      questionPrompt:
        'In an AVL tree with root 50 and left child 30, inserting key 45 creates what rebalance requirement?',
      studentAnswer: 'A single Right Rotation at root node 50',
      correctAnswer: 'Left-Right (LR) Double Rotation (Left on 30, then Right on 50)',
      topicName: 'AVL Trees & Rotations (LL, RR, LR, RL)',
      whyItMatters:
        'You marked HIGH confidence on this answer, but a single rotation fails to balance an LR zigzag insertion and breaks the BST invariant. This is a classic exam trap that costs up to 10 marks on Question 3 of the final exam!',
      citation: {
        docTitle: 'Textbook_Unit1_Balanced_Trees_Notes.pdf',
        docType: 'notes',
        section: 'Section 4.2: Rotation Classification & Implementation',
        pageSnippet:
          'CRITICAL EXAM NOTE: In an LR case, performing only a single rotation fails to balance the tree and violates BST ordering properties.',
        pageNumber: 8,
      },
    },
  ],
};

export const INITIAL_REVISION_PLAN: RevisionPlan = {
  id: 'rev-plan-demo-01',
  title: 'Targeted High-Impact Revision Plan: CS 204 Exam Prep',
  targetExamDate: '2026-11-05',
  daysRemaining: 10,
  dailyAvailableHours: 2.5,
  totalHoursPlanned: 17.5,
  generatedAt: '2026-10-25 18:45',
  lastUpdated: '2026-10-25 18:45',
  days: [
    {
      dayNumber: 1,
      dateStr: 'Day 1: Weak Topic Priority #1 (AVL Rotations)',
      focusTheme: 'Eliminate LR/RL Rotation Trap & Balance Factor Invariants',
      totalMinutes: 150,
      tasks: [
        {
          id: 'task-1-1',
          topicId: 'top-avl-trees',
          topicName: 'AVL Trees & Rotations (LL, RR, LR, RL)',
          unitName: 'Unit 1: Balanced Search Trees',
          priority: 'high',
          title: 'Review Section 4.2: Double Rotation Anatomy',
          description: 'Study the step-by-step diagram of how LR double rotation preserves BST ordering.',
          studyTechnique: 'Chunk Review',
          durationMinutes: 40,
          completed: false,
          citation: {
            docTitle: 'Textbook_Unit1_Balanced_Trees_Notes.pdf',
            docType: 'notes',
            section: 'Section 4.2: Rotation Classification & Implementation',
          },
        },
        {
          id: 'task-1-2',
          topicId: 'top-avl-trees',
          topicName: 'AVL Trees & Rotations (LL, RR, LR, RL)',
          unitName: 'Unit 1: Balanced Search Trees',
          priority: 'high',
          title: 'Feynman Technique: Teach LR Rotation out loud',
          description: 'Explain to an imaginary classmate why a single rotation fails on zigzag insertions.',
          studyTechnique: 'Feynman Technique',
          durationMinutes: 30,
          completed: false,
          citation: {
            docTitle: 'Past_Exams_Compilation_2023_2025.pdf',
            docType: 'past_paper',
            section: 'Fall 2024 Final Exam - Question 3',
          },
        },
        {
          id: 'task-1-3',
          topicId: 'top-avl-trees',
          topicName: 'AVL Trees & Rotations (LL, RR, LR, RL)',
          unitName: 'Unit 1: Balanced Search Trees',
          priority: 'high',
          title: 'Solve Fall 2024 Final Exam Q3 Practice Drill',
          description: 'Hand-trace insertion of keys 50, 20, 40, 10, 30 and balance factors.',
          studyTechnique: 'Past Paper Drill',
          durationMinutes: 45,
          completed: false,
          citation: {
            docTitle: 'Past_Exams_Compilation_2023_2025.pdf',
            docType: 'past_paper',
            section: 'Fall 2024 Final Exam - Question 3',
          },
        },
        {
          id: 'task-1-4',
          topicId: 'top-avl-trees',
          topicName: 'AVL Trees & Rotations (LL, RR, LR, RL)',
          unitName: 'Unit 1: Balanced Search Trees',
          priority: 'medium',
          title: 'Targeted Diagnostic Re-test (5 Questions)',
          description: 'Validate whether AVL rotation mastery score rises above 75%.',
          studyTechnique: 'Active Recall',
          durationMinutes: 35,
          completed: false,
          citation: {
            docTitle: 'Textbook_Unit1_Balanced_Trees_Notes.pdf',
            docType: 'notes',
            section: 'Section 4.1: AVL Tree Balancing Invariants',
          },
        },
      ],
    },
    {
      dayNumber: 2,
      dateStr: 'Day 2: Weak Topic Priority #2 (Kahn DAG Cycle Detection)',
      focusTheme: 'Master Topological Ordering & In-Degree Queue Logic',
      totalMinutes: 150,
      tasks: [
        {
          id: 'task-2-1',
          topicId: 'top-topo-sort',
          topicName: 'Topological Sort & Kahn DAG Cycle Detection',
          unitName: 'Unit 2: Graph Algorithms',
          priority: 'high',
          title: 'Review Lecture 9 Section 9.2: Kahn Algorithm Invariant',
          description: 'Trace why nodes in a cycle never reach in-degree 0.',
          studyTechnique: 'Chunk Review',
          durationMinutes: 35,
          completed: false,
          citation: {
            docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
            docType: 'notes',
            section: 'Section 9.2: Topological Sorting & Cycle Detection',
          },
        },
        {
          id: 'task-2-2',
          topicId: 'top-topo-sort',
          topicName: 'Topological Sort & Kahn DAG Cycle Detection',
          unitName: 'Unit 2: Graph Algorithms',
          priority: 'high',
          title: 'Whiteboard Coding: Kahn Algorithm with Cycle Check',
          description: 'Implement in-degree array, queue, and count comparison (count === V).',
          studyTechnique: 'Active Recall',
          durationMinutes: 45,
          completed: false,
          citation: {
            docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
            docType: 'notes',
            section: 'Section 9.2: Topological Sorting & Cycle Detection',
          },
        },
        {
          id: 'task-2-3',
          topicId: 'top-topo-sort',
          topicName: 'Topological Sort & Kahn DAG Cycle Detection',
          unitName: 'Unit 2: Graph Algorithms',
          priority: 'medium',
          title: 'Midterm 2023 Q5B Past Paper Question',
          description: 'Solve past paper question on cycle detection in dependency graphs.',
          studyTechnique: 'Past Paper Drill',
          durationMinutes: 40,
          completed: false,
          citation: {
            docTitle: 'Past_Exams_Compilation_2023_2025.pdf',
            docType: 'past_paper',
            section: 'Midterm 2023 - Question 5B',
          },
        },
        {
          id: 'task-2-4',
          topicId: 'top-topo-sort',
          topicName: 'Topological Sort & Kahn DAG Cycle Detection',
          unitName: 'Unit 2: Graph Algorithms',
          priority: 'low',
          title: 'Error Log Synthesis',
          description: 'Write down key difference between DFS cycle detection (back edge) and Kahn (in-degree).',
          studyTechnique: 'Error Log Review',
          durationMinutes: 30,
          completed: false,
          citation: {
            docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
            docType: 'notes',
            section: 'Section 9.2: Topological Sorting & Cycle Detection',
          },
        },
      ],
    },
    {
      dayNumber: 3,
      dateStr: 'Day 3: Medium Topics Reinforcement (BFS & 0/1 Knapsack)',
      focusTheme: 'Refine Nuances & Boundary Conditions',
      totalMinutes: 150,
      tasks: [
        {
          id: 'task-3-1',
          topicId: 'top-bfs-opt',
          topicName: 'BFS Shortest Path & Edge Weight Limitations',
          unitName: 'Unit 2: Graph Algorithms',
          priority: 'medium',
          title: 'Study Fall 2024 Exam Question 7 Counter-Example',
          description: 'Review the graph counter-example where BFS fails on weighted edges.',
          studyTechnique: 'Chunk Review',
          durationMinutes: 30,
          completed: false,
          citation: {
            docTitle: 'Past_Exams_Compilation_2023_2025.pdf',
            docType: 'past_paper',
            section: 'Fall 2024 Final Exam - Question 7',
          },
        },
        {
          id: 'task-3-2',
          topicId: 'top-01-knapsack',
          topicName: '0/1 Knapsack & 1D Space Optimization',
          unitName: 'Unit 3: Dynamic Programming',
          priority: 'medium',
          title: '1D DP Knapsack Backwards Loop Walkthrough',
          description: 'Trace state array `dp[w]` updates to verify no item is counted twice.',
          studyTechnique: 'Active Recall',
          durationMinutes: 45,
          completed: false,
          citation: {
            docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
            docType: 'notes',
            section: 'Section 14.1: 0/1 Knapsack Equations & Space Compression',
          },
        },
        {
          id: 'task-3-3',
          topicId: 'top-01-knapsack',
          topicName: '0/1 Knapsack & 1D Space Optimization',
          unitName: 'Unit 3: Dynamic Programming',
          priority: 'medium',
          title: 'Solve Fall 2024 Exam Question 11',
          description: 'Write theoretical comparison between 0/1 knapsack and unbounded knapsack.',
          studyTechnique: 'Past Paper Drill',
          durationMinutes: 45,
          completed: false,
          citation: {
            docTitle: 'Past_Exams_Compilation_2023_2025.pdf',
            docType: 'past_paper',
            section: 'Fall 2024 Final Exam - Question 11',
          },
        },
        {
          id: 'task-3-4',
          topicId: 'top-bfs-opt',
          topicName: 'BFS Shortest Path & Edge Weight Limitations',
          unitName: 'Unit 2: Graph Algorithms',
          priority: 'low',
          title: 'Mixed Topic Rapid-Fire Quiz (6 Questions)',
          description: 'Test BFS vs Dijkstra and 1D DP knapsack transitions.',
          studyTechnique: 'Active Recall',
          durationMinutes: 30,
          completed: false,
          citation: {
            docTitle: 'Professor_Lectures_Graphs_and_DP_Master.pdf',
            docType: 'notes',
            section: 'Section 9.1: Breadth-First Search Optimality Limitations',
          },
        },
      ],
    },
    {
      dayNumber: 4,
      dateStr: 'Day 4: Full Course Mock Exam & Diagnostic Gap Re-Check',
      focusTheme: 'Simulated Comprehensive Exam & Trajectory Verification',
      totalMinutes: 150,
      tasks: [
        {
          id: 'task-4-1',
          topicId: 'top-avl-trees',
          topicName: 'Full Syllabus Diagnostic Re-Assessment',
          unitName: 'All Units (1 - 4)',
          priority: 'high',
          title: 'Comprehensive 12-Question Diagnostic Test',
          description: 'Measure overall mastery shift and verify conversion of weak topics to strong.',
          studyTechnique: 'Active Recall',
          durationMinutes: 60,
          completed: false,
          citation: {
            docTitle: 'Past_Exams_Compilation_2023_2025.pdf',
            docType: 'past_paper',
            section: 'Complete Past Paper Archive',
          },
        },
        {
          id: 'task-4-2',
          topicId: 'top-cap-theorem',
          topicName: 'Unit 4 High-Yield Retention Check',
          unitName: 'Unit 4: Distributed Systems',
          priority: 'low',
          title: 'CAP Theorem and Consistent Hashing Quick Flashcards',
          description: 'Ensure Strong topics remain locked in without degradation.',
          studyTechnique: 'Active Recall',
          durationMinutes: 45,
          completed: false,
          citation: {
            docTitle: 'Distributed_Systems_Core_Concepts.pdf',
            docType: 'notes',
            section: 'Section 1.1 & 1.2',
          },
        },
        {
          id: 'task-4-3',
          topicId: 'top-avl-trees',
          topicName: 'Adaptive Revision Plan Update',
          unitName: 'Diagnostics Engine',
          priority: 'medium',
          title: 'Review Updated Gap Report & Final Exam Strategy',
          description: 'Inspect newly diagnosed strengths and finalize final 48-hour strategy.',
          studyTechnique: 'Error Log Review',
          durationMinutes: 45,
          completed: false,
          citation: {
            docTitle: 'CS204_Official_Syllabus_Fall2026.pdf',
            docType: 'syllabus',
            section: 'Course Objectives & Weight Distribution',
          },
        },
      ],
    },
  ],
};

export const SAMPLE_PROGRESS_HISTORY: ProgressHistoryEntry[] = [
  {
    attemptNumber: 1,
    date: '2026-10-20',
    overallScore: 48,
    weakCount: 4,
    mediumCount: 3,
    strongCount: 1,
    notes: 'Initial blind diagnostic. Major blind spots across AVL rotations, Kahn cycle invariants, and DP space reduction.',
  },
  {
    attemptNumber: 2,
    date: '2026-10-23',
    overallScore: 68,
    weakCount: 2,
    mediumCount: 2,
    strongCount: 4,
    notes: 'After completing Day 1 & Day 2 targeted study blocks, Fib Heaps and Consistent Hashing moved to Strong. AVL still needs review.',
  },
];
