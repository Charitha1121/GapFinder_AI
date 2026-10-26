import { GapReport, RevisionPlan, RevisionDay, RevisionTask } from '@/types';

/**
 * Adaptive Revision Plan Generator
 * Constructs a prioritized day-by-day revision schedule based on diagnosed gaps,
 * topic exam weights, and student time constraints.
 */
export function generateAdaptiveRevisionPlan(
  gapReport: GapReport,
  dailyAvailableHours = 2.5,
  daysUntilExam = 7
): RevisionPlan {
  const totalMinutesPerDay = Math.round(dailyAvailableHours * 60);
  const days: RevisionDay[] = [];

  // Sort weak topics by exam weight descending (highest exam impact first!)
  const prioritizedWeak = [...gapReport.weakTopics].sort((a, b) => b.examWeight - a.examWeight);
  const prioritizedMedium = [...gapReport.mediumTopics].sort((a, b) => b.examWeight - a.examWeight);

  let dayIndex = 1;

  // PHASE 1: Urgent Weak Topics Intervention (Days 1 to N)
  for (const weakTopic of prioritizedWeak) {
    if (dayIndex > daysUntilExam) break;

    const tasks: RevisionTask[] = [];
    let allocatedMinutes = 0;

    // 1. Core Source Notes Chunk Review
    const chunkTime = Math.min(40, Math.round(totalMinutesPerDay * 0.28));
    tasks.push({
      id: `task-${dayIndex}-1`,
      topicId: weakTopic.topicId,
      topicName: weakTopic.topicName,
      unitName: weakTopic.unitName,
      priority: 'high',
      title: `Deep-Dive Notes: ${weakTopic.topicName}`,
      description: `Study diagnosed gaps: ${weakTopic.missedConcepts.slice(0, 2).join('; ') || 'Core concepts'}. Focus on textbook section citations.`,
      studyTechnique: 'Chunk Review',
      durationMinutes: chunkTime,
      completed: false,
      citation: {
        docTitle: weakTopic.citations[0]?.docTitle || 'Course Notes',
        section: weakTopic.citations[0]?.section || 'Core Section',
      },
    });
    allocatedMinutes += chunkTime;

    // 2. Active Recall / Feynman Technique
    const feynmanTime = Math.min(35, Math.round(totalMinutesPerDay * 0.25));
    tasks.push({
      id: `task-${dayIndex}-2`,
      topicId: weakTopic.topicId,
      topicName: weakTopic.topicName,
      unitName: weakTopic.unitName,
      priority: 'high',
      title: `Feynman Drill: Self-Explain Key Mechanisms`,
      description: `Explain the mechanism aloud without looking at notes. Pinpoint any remaining moments of hesitation.`,
      studyTechnique: 'Feynman Technique',
      durationMinutes: feynmanTime,
      completed: false,
      citation: {
        docTitle: weakTopic.citations[0]?.docTitle || 'Syllabus',
        section: weakTopic.recommendedFocus,
      },
    });
    allocatedMinutes += feynmanTime;

    // 3. Past Exam Paper Problem Drill
    const drillTime = Math.min(45, Math.round(totalMinutesPerDay * 0.3));
    tasks.push({
      id: `task-${dayIndex}-3`,
      topicId: weakTopic.topicId,
      topicName: weakTopic.topicName,
      unitName: weakTopic.unitName,
      priority: 'high',
      title: `Past Exam Drill: Solve 2 Previous Year Questions`,
      description: `Attempt realistic exam questions under timed conditions to simulate high-stakes assessment pressure.`,
      studyTechnique: 'Past Paper Drill',
      durationMinutes: drillTime,
      completed: false,
      citation: {
        docTitle: 'Past Exam Papers Archive',
        section: `Exam Weightage Focus (${weakTopic.examWeight}%)`,
      },
    });
    allocatedMinutes += drillTime;

    // 4. Targeted Diagnostic Mini-Quiz
    const testTime = Math.max(15, totalMinutesPerDay - allocatedMinutes);
    tasks.push({
      id: `task-${dayIndex}-4`,
      topicId: weakTopic.topicId,
      topicName: weakTopic.topicName,
      unitName: weakTopic.unitName,
      priority: 'medium',
      title: `Targeted Mini-Diagnostic Re-Test`,
      description: `Re-test on this topic in GapFinder AI to confirm mastery score has improved.`,
      studyTechnique: 'Active Recall',
      durationMinutes: testTime,
      completed: false,
      citation: {
        docTitle: 'Diagnostic Quiz Engine',
        section: weakTopic.topicName,
      },
    });
    allocatedMinutes += testTime;

    days.push({
      dayNumber: dayIndex,
      dateStr: `Day ${dayIndex}: Priority Weak Topic (${weakTopic.unitName.split(':')[0]})`,
      focusTheme: `Eliminate Gaps in ${weakTopic.topicName} (Weight: ${weakTopic.examWeight}%)`,
      totalMinutes: totalMinutesPerDay,
      tasks,
    });

    dayIndex++;
  }

  // PHASE 2: Medium Topics Reinforcement (Subsequent Days)
  for (const mediumTopic of prioritizedMedium) {
    if (dayIndex > daysUntilExam) break;

    const tasks: RevisionTask[] = [
      {
        id: `task-${dayIndex}-1`,
        topicId: mediumTopic.topicId,
        topicName: mediumTopic.topicName,
        unitName: mediumTopic.unitName,
        priority: 'medium',
        title: `Boundary & Edge-Case Review: ${mediumTopic.topicName}`,
        description: `Review subtle conditions: ${mediumTopic.reason}`,
        studyTechnique: 'Chunk Review',
        durationMinutes: Math.round(totalMinutesPerDay * 0.35),
        completed: false,
        citation: {
          docTitle: mediumTopic.citations[0]?.docTitle || 'Lecture Notes',
          section: mediumTopic.citations[0]?.section || 'Overview',
        },
      },
      {
        id: `task-${dayIndex}-2`,
        topicId: mediumTopic.topicId,
        topicName: mediumTopic.topicName,
        unitName: mediumTopic.unitName,
        priority: 'medium',
        title: `Worked Problem Drill`,
        description: `Work through 3 complex problem variations to convert Medium mastery into Strong (>75%).`,
        studyTechnique: 'Past Paper Drill',
        durationMinutes: Math.round(totalMinutesPerDay * 0.4),
        completed: false,
        citation: {
          docTitle: 'Past Exam Papers',
          section: mediumTopic.topicName,
        },
      },
      {
        id: `task-${dayIndex}-3`,
        topicId: mediumTopic.topicId,
        topicName: mediumTopic.topicName,
        unitName: mediumTopic.unitName,
        priority: 'low',
        title: `Interleaved Spaced-Retrieval Check`,
        description: `Quick flash recall test combining this topic with earlier revised topics.`,
        studyTechnique: 'Active Recall',
        durationMinutes: Math.round(totalMinutesPerDay * 0.25),
        completed: false,
        citation: {
          docTitle: 'Diagnostic Engine',
          section: 'Mixed Recall',
        },
      },
    ];

    days.push({
      dayNumber: dayIndex,
      dateStr: `Day ${dayIndex}: Medium Topic Polish (${mediumTopic.unitName.split(':')[0]})`,
      focusTheme: `Upgrade ${mediumTopic.topicName} from Medium to Strong`,
      totalMinutes: totalMinutesPerDay,
      tasks,
    });

    dayIndex++;
  }

  // PHASE 3: Comprehensive Final Mock & Spaced Synthesis (Remaining Days)
  while (dayIndex <= daysUntilExam) {
    const isFinalDay = dayIndex === daysUntilExam;
    const tasks: RevisionTask[] = isFinalDay
      ? [
          {
            id: `task-${dayIndex}-final-1`,
            topicId: 'all',
            topicName: 'Comprehensive Mock Exam',
            unitName: 'All Syllabus Units',
            priority: 'high',
            title: 'Full-Length Timed Diagnostic Simulation',
            description: 'Simulate official exam timing to verify all weak topics have achieved >75% retention.',
            studyTechnique: 'Past Paper Drill',
            durationMinutes: Math.round(totalMinutesPerDay * 0.6),
            completed: false,
            citation: {
              docTitle: 'Complete Past Exam Archive',
              section: 'All Units',
            },
          },
          {
            id: `task-${dayIndex}-final-2`,
            topicId: 'all',
            topicName: 'Error Log & Formula Sheet Review',
            unitName: 'Synthesis',
            priority: 'medium',
            title: 'Final High-Yield Formula & Concept Review',
            description: 'Glance through key invariants, time complexities, and error logs before exam day.',
            studyTechnique: 'Error Log Review',
            durationMinutes: Math.round(totalMinutesPerDay * 0.4),
            completed: false,
            citation: {
              docTitle: 'Summary Notes',
              section: 'Formula & Invariant Cheat Sheet',
            },
          },
        ]
      : [
          {
            id: `task-${dayIndex}-mid-1`,
            topicId: 'all',
            topicName: 'Cross-Topic Synthesis & Interleaving',
            unitName: 'Units 1-4',
            priority: 'medium',
            title: 'Interleaved Practice Across Units',
            description: 'Solve questions that combine tree structures with graph representations and dynamic programming.',
            studyTechnique: 'Concept Mapping',
            durationMinutes: Math.round(totalMinutesPerDay * 0.5),
            completed: false,
            citation: {
              docTitle: 'Lecture Transcripts',
              section: 'Cross-Module Synthesis',
            },
          },
          {
            id: `task-${dayIndex}-mid-2`,
            topicId: 'all',
            topicName: 'Spaced Repetition Flashcards',
            unitName: 'Units 1-4',
            priority: 'low',
            title: 'Quick-Fire Definition & Proof Drills',
            description: 'Ensure Strong topics have not decayed.',
            studyTechnique: 'Active Recall',
            durationMinutes: Math.round(totalMinutesPerDay * 0.5),
            completed: false,
            citation: {
              docTitle: 'Course Notes',
              section: 'Definitions',
            },
          },
        ];

    days.push({
      dayNumber: dayIndex,
      dateStr: `Day ${dayIndex}: ${isFinalDay ? 'Final Exam Simulation & Readiness Check' : 'Comprehensive Synthesis'}`,
      focusTheme: isFinalDay ? 'Verify Mastery Across All Diagnosed Gaps' : 'Interleaved Retrieval Across Modules',
      totalMinutes: totalMinutesPerDay,
      tasks,
    });

    dayIndex++;
  }

  const totalHoursPlanned = Number(((days.length * totalMinutesPerDay) / 60).toFixed(1));

  return {
    id: `rev-plan-${Date.now()}`,
    title: `Adaptive High-Impact Revision Plan (${days.length} Days)`,
    targetExamDate: new Date(Date.now() + daysUntilExam * 86400000).toISOString().split('T')[0],
    daysRemaining: daysUntilExam,
    dailyAvailableHours,
    totalHoursPlanned,
    days,
    generatedAt: new Date().toLocaleString(),
    lastUpdated: new Date().toLocaleString(),
  };
}
