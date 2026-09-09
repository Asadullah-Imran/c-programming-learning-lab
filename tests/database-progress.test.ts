// ==============================================================================
// ICS C Programming Learning Lab — Unit Tests: Database & Student Progress
// ==============================================================================

import {
  calculateDashboardStats,
  DEFAULT_DEMO_USER,
  DEFAULT_SEED_PROGRESS,
  DEFAULT_SEED_SUBMISSIONS,
} from '../lib/db/supabase';
import { CURRICULUM_TOPICS } from '../content/curriculum';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

console.log('🧪 Running Suite: Database & Student Progress Calculation\n');

// 1. Dashboard Stats calculation
console.log('--- Test Group 1: Student Dashboard Aggregation ---');
const stats = calculateDashboardStats();

assert(Boolean(stats.user), 'User profile is populated');
assert(stats.user.email === DEFAULT_DEMO_USER.email, 'User email matches demo user');
assert(stats.topicMasteries.length === CURRICULUM_TOPICS.length, `8 topic masteries generated (got ${stats.topicMasteries.length})`);
assert(stats.totalLessonsCount > 0, `Total lessons counted across curriculum: ${stats.totalLessonsCount}`);
assert(stats.completedLessonsCount >= 3, `Initial completed lessons count: ${stats.completedLessonsCount}`);
assert(stats.overallCoursePercentage >= 0 && stats.overallCoursePercentage <= 100, `Overall percentage in valid range: ${stats.overallCoursePercentage}%`);
assert(stats.recentSubmissions.length <= 5, 'Recent submissions list is capped at 5');
assert(stats.nextRecommendedLesson !== null, 'Next recommended lesson is resolved');

// 2. Topic Mastery breakdown
console.log('\n--- Test Group 2: Topic Mastery Breakdown ---');
const introTopic = stats.topicMasteries.find((t) => t.topicId === 'topic-01');
assert(Boolean(introTopic), 'Module 1 (Intro to C) mastery found');
if (introTopic) {
  assert(introTopic.completedLessons === 2, `Module 1 completed lessons count: ${introTopic.completedLessons}/2`);
  assert(introTopic.percentage === 100, `Module 1 is 100% completed`);
}

const varsTopic = stats.topicMasteries.find((t) => t.topicId === 'topic-02');
assert(Boolean(varsTopic), 'Module 2 (Variables & Memory) mastery found');
if (varsTopic) {
  assert(varsTopic.completedLessons === 1, `Module 2 completed lessons count: ${varsTopic.completedLessons}/2`);
  assert(varsTopic.percentage === 50, `Module 2 is 50% completed`);
}

// 3. Accuracy Calculation
console.log('\n--- Test Group 3: Accuracy & Streak ---');
assert(stats.streakDays >= 1, `Streak days is positive (${stats.streakDays})`);
assert(stats.totalXp >= 400, `Total XP is populated (${stats.totalXp})`);
assert(stats.practiceAccuracyRate === 100, `Initial seed accuracy rate is 100%`);

console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
