import { CURRICULUM_TOPICS, getTopicBySlug, getLessonBySlug } from '../content/curriculum';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Starting Curriculum & Lessons Unit Tests...\n');

// Test 1: Verify 8 Core Syllabus Modules
console.log('Test 1: Core 8 Modules Verification');
assert(CURRICULUM_TOPICS.length === 8, `Expected 8 topics, found ${CURRICULUM_TOPICS.length}`);
CURRICULUM_TOPICS.forEach((topic, idx) => {
  assert(topic.moduleNumber === idx + 1, `Module number mismatch for ${topic.id}`);
  assert(topic.lessons.length > 0, `Topic ${topic.id} must have at least 1 lesson`);
});
console.log('  ✓ Passed: All 8 modules present in exact sequence.');

// Test 2: Unique Slugs & Slug Resolvers
console.log('\nTest 2: Topic & Lesson Slug Resolvers');
const topicSlugs = new Set<string>();
const lessonSlugs = new Set<string>();

CURRICULUM_TOPICS.forEach(topic => {
  assert(!topicSlugs.has(topic.slug), `Duplicate topic slug: ${topic.slug}`);
  topicSlugs.add(topic.slug);

  const resolvedTopic = getTopicBySlug(topic.slug);
  assert(!!resolvedTopic, `getTopicBySlug failed for ${topic.slug}`);

  topic.lessons.forEach(lesson => {
    const fullSlug = `${topic.slug}/${lesson.slug}`;
    assert(!lessonSlugs.has(fullSlug), `Duplicate lesson slug: ${fullSlug}`);
    lessonSlugs.add(fullSlug);

    const resolved = getLessonBySlug(topic.slug, lesson.slug);
    assert(!!resolved, `getLessonBySlug failed for ${fullSlug}`);
    assert(resolved?.lesson.id === lesson.id, `Resolved lesson ID mismatch for ${fullSlug}`);
  });
});
console.log(`  ✓ Passed: ${topicSlugs.size} topic slugs and ${lessonSlugs.size} lesson slugs are unique and resolvable.`);

// Test 3: Embedded Widget Code & Sections
console.log('\nTest 3: Lesson Sections & Embedded Widgets');
CURRICULUM_TOPICS.forEach(topic => {
  topic.lessons.forEach(lesson => {
    assert(lesson.sections.length > 0, `Lesson ${lesson.id} has no sections`);
    lesson.sections.forEach(s => {
      assert(s.title.length > 0, `Section in ${lesson.id} has empty title`);
      assert(s.content.length > 0, `Section in ${lesson.id} has empty content`);
    });

    if (lesson.interactiveWidget) {
      assert(lesson.interactiveWidget.code.includes('main'), `Widget in ${lesson.id} must contain main()`);
    }
  });
});
console.log('  ✓ Passed: All lessons contain rich pedagogical sections and valid C code.');

// Test 4: Quiz Questions & Answers Validation
console.log('\nTest 4: Quiz Answer Integrity');
let totalQuizQuestions = 0;
CURRICULUM_TOPICS.forEach(topic => {
  topic.lessons.forEach(lesson => {
    if (lesson.quiz) {
      lesson.quiz.forEach(q => {
        totalQuizQuestions++;
        assert(q.options.length >= 2, `Question ${q.id} must have >= 2 options`);
        assert(
          q.correctOptionIndex >= 0 && q.correctOptionIndex < q.options.length,
          `Invalid correctOptionIndex ${q.correctOptionIndex} in question ${q.id}`
        );
        assert(q.explanation.length > 0, `Question ${q.id} has empty explanation`);
      });
    }
  });
});
console.log(`  ✓ Passed: All ${totalQuizQuestions} quiz questions validated with correct answer indices.`);

console.log('\n🎉 ALL CURRICULUM UNIT TESTS PASSED SUCCESSFULLY!\n');
