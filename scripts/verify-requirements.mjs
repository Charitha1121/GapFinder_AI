import http from 'http';

// Test colors
const green = '\x1b[32m';
const red = '\x1b[31m';
const cyan = '\x1b[36m';
const yellow = '\x1b[33m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';

console.log(`${bold}${cyan}======================================================${reset}`);
console.log(`${bold}${cyan}   GapFinder AI — Requirements Verification Test Suite  ${reset}`);
console.log(`${bold}${cyan}======================================================${reset}\n`);

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`${green}✓ PASS${reset} [Req #${totalTests}] ${bold}${testName}${reset}`);
    if (details) console.log(`       ${details}`);
  } else {
    console.log(`${red}✗ FAIL${reset} [Req #${totalTests}] ${bold}${testName}${reset}`);
    if (details) console.log(`       ${red}Error: ${details}${reset}`);
  }
}

async function runTests() {
  // 1. Verify Server is Online
  await new Promise((resolve) => {
    http.get('http://localhost:3000', (res) => {
      assert(res.statusCode === 200, 'Next.js App Server is Live', `HTTP status: ${res.statusCode} at http://localhost:3000`);
      resolve(null);
    }).on('error', (err) => {
      assert(false, 'Next.js App Server is Live', err.message);
      resolve(null);
    });
  });

  // 2. Test /api/rag endpoint
  await new Promise((resolve) => {
    const postData = JSON.stringify({
      query: 'AVL Tree balance factor rotation LR',
      chunks: [
        {
          id: 'chk-1',
          docId: 'doc-1',
          docTitle: 'Trees_Notes.pdf',
          docType: 'notes',
          section: 'Section 4.2: Rotations',
          chunkIndex: 0,
          text: 'Left-Right (LR) heavy requires a double rotation: first Left on child, then Right on root.',
          keywords: ['avl', 'tree', 'rotation', 'left', 'right'],
        },
        {
          id: 'chk-2',
          docId: 'doc-2',
          docTitle: 'Graphs.pdf',
          docType: 'notes',
          section: 'Section 9.1: BFS',
          chunkIndex: 1,
          text: 'BFS explores unweighted graphs for shortest path.',
          keywords: ['bfs', 'graph', 'shortest', 'path'],
        },
      ],
      topK: 2,
    });

    const req = http.request(
      'http://localhost:3000/api/rag',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const topMatch = parsed.matches?.[0];
            const isMatch = topMatch && topMatch.chunk.docTitle === 'Trees_Notes.pdf';
            assert(
              isMatch,
              'RAG Semantic Retrieval & Cosine Ranking',
              `Top match correctly retrieved "${topMatch?.chunk.docTitle}" with score ${(topMatch?.similarityScore * 100).toFixed(1)}%`
            );
          } catch (e) {
            assert(false, 'RAG Semantic Retrieval', e.message);
          }
          resolve(null);
        });
      }
    );
    req.on('error', (e) => {
      assert(false, 'RAG Semantic Retrieval', e.message);
      resolve(null);
    });
    req.write(postData);
    req.end();
  });

  // 3. Test /api/evaluate endpoint for Gap Diagnosis & Confident Misconception
  await new Promise((resolve) => {
    const postData = JSON.stringify({
      questions: [
        {
          id: 'q-avl-1',
          topicId: 'top-avl',
          topicName: 'AVL Tree Rotations',
          unitName: 'Unit 1: Trees',
          type: 'scenario',
          difficulty: 'medium',
          prompt: 'What rotation sequence balances an LR imbalance?',
          options: [
            { id: 'opt-a', text: 'Single Right Rotation' },
            { id: 'opt-b', text: 'Left-Right Double Rotation' },
          ],
          correctOptionId: 'opt-b',
          explanation: 'LR imbalance requires Left on child then Right on parent.',
          citation: {
            docTitle: 'Trees_Notes.pdf',
            docType: 'notes',
            section: 'Section 4.2',
            pageSnippet: 'LR requires double rotation.',
          },
        },
        {
          id: 'q-dp-1',
          topicId: 'top-dp',
          topicName: '0/1 Knapsack DP',
          unitName: 'Unit 3: DP',
          type: 'mcq',
          difficulty: 'hard',
          prompt: 'Why reverse loop in 1D array?',
          options: [
            { id: 'opt-1', text: 'Speed' },
            { id: 'opt-2', text: 'Prevent multiple item reuse' },
          ],
          correctOptionId: 'opt-2',
          explanation: 'Prevents unbounded item reuse.',
          citation: {
            docTitle: 'DP_Notes.pdf',
            docType: 'notes',
            section: 'Section 14.1',
            pageSnippet: 'Reverse loop prevents unbounded reuse.',
          },
        },
      ],
      submissions: {
        'q-avl-1': {
          questionId: 'q-avl-1',
          selectedOptionId: 'opt-a', // WRONG ANSWER
          confidence: 'high', // HIGH CONFIDENCE = CONFIDENT MISCONCEPTION!
          isCorrect: false,
          timeSpentSeconds: 30,
        },
        'q-dp-1': {
          questionId: 'q-dp-1',
          selectedOptionId: 'opt-2', // CORRECT ANSWER
          confidence: 'high',
          isCorrect: true,
          timeSpentSeconds: 40,
        },
      },
      topics: [
        {
          id: 'top-avl',
          unitId: 'unit-1',
          unitName: 'Unit 1: Trees',
          name: 'AVL Tree Rotations',
          description: 'Rotations',
          examWeight: 20,
          difficulty: 'intermediate',
          prerequisites: [],
          status: 'unassessed',
          masteryScore: 0,
          assessedQuestionsCount: 0,
          citationsCount: 2,
        },
        {
          id: 'top-dp',
          unitId: 'unit-3',
          unitName: 'Unit 3: DP',
          name: '0/1 Knapsack DP',
          description: 'Knapsack',
          examWeight: 15,
          difficulty: 'advanced',
          prerequisites: [],
          status: 'unassessed',
          masteryScore: 0,
          assessedQuestionsCount: 0,
          citationsCount: 2,
        },
      ],
      dailyAvailableHours: 2.0,
      daysUntilExam: 7,
    });

    const req = http.request(
      'http://localhost:3000/api/evaluate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const report = parsed.report;
            const plan = parsed.plan;

            // Check Weak topic classification
            const isWeakClassified = report.weakTopics.some((w) => w.topicId === 'top-avl');
            assert(
              isWeakClassified,
              'Diagnostic Gap Engine: Weak Topic (<50%) Classification',
              'Failed AVL question correctly classified as Weak (0%)'
            );

            // Check Strong topic classification
            const isStrongClassified = report.strongTopics.some((s) => s.topicId === 'top-dp');
            assert(
              isStrongClassified,
              'Diagnostic Gap Engine: Strong Topic (>75%) Classification',
              'Correct DP question correctly classified as Strong (100%)'
            );

            // Check Confident Misconception detection
            const hasMisconception = report.confidentMisconceptions.length > 0;
            assert(
              hasMisconception,
              'Confident Misconception Detection Engine',
              `Flagged wrong answer marked with HIGH confidence: "${report.confidentMisconceptions[0]?.topicName}"`
            );

            // Check Adaptive Revision Plan generation
            const hasPlan = plan && plan.days && plan.days.length > 0;
            const day1PrioritizesWeak = plan?.days?.[0]?.tasks?.some((t) => t.topicId === 'top-avl');
            assert(
              hasPlan && day1PrioritizesWeak,
              'Adaptive Revision Plan: High-Impact Priority Scheduling',
              `Day 1 prioritizes weak topic "${plan?.days?.[0]?.focusTheme}" with ${plan?.days?.length} total days`
            );
          } catch (e) {
            assert(false, 'Evaluation & Plan Generation', e.message);
          }
          resolve(null);
        });
      }
    );
    req.on('error', (e) => {
      assert(false, 'Evaluation Endpoint', e.message);
      resolve(null);
    });
    req.write(postData);
    req.end();
  });

  // 4. Test /api/chat endpoint for Explain Assistant with Grounded Citations
  await new Promise((resolve) => {
    const postData = JSON.stringify({
      query: 'What rotation balances an LR AVL tree?',
      chunks: [
        {
          id: 'chk-trees',
          docId: 'doc-trees',
          docTitle: 'Textbook_Unit1_Balanced_Trees_Notes.pdf',
          docType: 'notes',
          section: 'Section 4.2: Rotation Classification & Implementation',
          chunkIndex: 0,
          text: 'Left-Right (LR) Heavy: Requires a Double Rotation: First a Left Rotation on the left child, followed by a Right Rotation on the imbalanced ancestor node.',
          keywords: ['avl', 'rotation', 'left', 'right', 'lr'],
        },
      ],
    });

    const req = http.request(
      'http://localhost:3000/api/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const hasCitations = parsed.citations && parsed.citations.length > 0;
            const hasCheckQuestion = parsed.checkQuestion !== undefined;
            assert(
              hasCitations && hasCheckQuestion,
              'Explain-This-Topic RAG: Grounded Citations & Active Recall Check',
              `Generated response citing: "${parsed.citations?.[0]?.docTitle}" with active recall check question`
            );
          } catch (e) {
            assert(false, 'Explain Assistant Synthesis', e.message);
          }
          resolve(null);
        });
      }
    );
    req.on('error', (e) => {
      assert(false, 'Chat Endpoint', e.message);
      resolve(null);
    });
    req.write(postData);
    req.end();
  });

  console.log(`\n${bold}${cyan}------------------------------------------------------${reset}`);
  if (passedTests === totalTests) {
    console.log(`${green}${bold}ALL ${totalTests} REQUIREMENT VERIFICATION TESTS PASSED SUCCESSFULLY!${reset}`);
  } else {
    console.log(`${yellow}${bold}${passedTests}/${totalTests} TESTS PASSED.${reset}`);
  }
  console.log(`${bold}${cyan}======================================================${reset}\n`);
}

runTests();
