import { normalizeTestScore } from '../server/utils/testScoring.js';

console.log('--- Testing normalizeTestScore ---');

// Case 1: The famous 113% bug (User enters 85 marks on a 75-question JEE Main test where totalMarks was set to 75)
const case1 = normalizeTestScore({
  examType: 'JEE Main',
  score: 85,
  maxMarks: 75, // question count mistakenly used as maxMarks
  correct: 25,
  wrong: 15,
  unanswered: 35
});
console.log('Case 1 (85 score / 75 maxMarks confusion):', {
  score: case1.score,
  maxMarks: case1.maxMarks,
  percent: case1.percent,
  accuracy: case1.accuracy
});
if (case1.percent > 100) {
  console.error('FAIL: Case 1 percentage exceeded 100%!');
  process.exit(1);
}

// Case 2: JEE Advanced paper confusion (204 scored, 180 entered as total instead of 360)
const case2 = normalizeTestScore({
  examType: 'JEE Advanced',
  score: 204,
  maxMarks: 180
});
console.log('Case 2 (JEE Advanced single paper confusion):', {
  score: case2.score,
  maxMarks: case2.maxMarks,
  percent: case2.percent
});
if (case2.percent > 100) {
  console.error('FAIL: Case 2 percentage exceeded 100%!');
  process.exit(1);
}

// Case 3: Zero or missing maxMarks
const case3 = normalizeTestScore({
  examType: 'NEET',
  score: 450,
  maxMarks: 0
});
console.log('Case 3 (Zero maxMarks default for NEET):', {
  score: case3.score,
  maxMarks: case3.maxMarks,
  percent: case3.percent
});
if (case3.maxMarks !== 720 || isNaN(case3.percent)) {
  console.error('FAIL: Case 3 did not default NEET to 720 or returned NaN');
  process.exit(1);
}

// Case 4: Negative score
const case4 = normalizeTestScore({
  score: -4,
  maxMarks: 300,
  correct: 0,
  wrong: 4,
  unanswered: 71
});
console.log('Case 4 (Negative Score):', {
  score: case4.score,
  maxMarks: case4.maxMarks,
  percent: case4.percent
});
if (case4.percent > 0) {
  console.error('FAIL: Case 4 negative score produced positive percent');
  process.exit(1);
}

// Case 5: 100% perfect score
const case5 = normalizeTestScore({
  examType: 'JEE Main',
  score: 300,
  maxMarks: 300,
  correct: 75,
  wrong: 0,
  unanswered: 0
});
console.log('Case 5 (Perfect score):', {
  score: case5.score,
  maxMarks: case5.maxMarks,
  percent: case5.percent
});
if (case5.percent !== 100) {
  console.error('FAIL: Case 5 did not yield 100%');
  process.exit(1);
}

console.log('ALL TEST SCORING UNIT TESTS PASSED SUCCESSFULLY! ✅');
