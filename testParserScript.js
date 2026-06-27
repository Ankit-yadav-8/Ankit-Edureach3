import { parseQuestions } from './server/utils/testParser.js';

const ocr = `Q1.
Let \\alpha, \\alpha + 2, \\alpha \\in Z be the roots of the quadratic equation
x(x + 2) + (x + 1)(x + 3) + (x + 2)(x + 4) + … + (x + n − 1)(x + n + 1) = 4n for some n \\in N. Then n + \\alpha
is equal to :
(1) 0 (2) 1 (3) 2 (4) 3
MathonGo Answer Key : (3)
Q2.
Let x and y be real numbers such that 50 (
2x
1 + 3i
−
y
1 − 2i
) = 31 + 17i, i = \\sqrt{-1}. Then the value of 10(x − 3y)
is :
(1) 20 (2) 31 (3) 35 (4) 75
MathonGo Answer Key : (4)
Q3.
Let \\beta \\in R be such that the system of linear equations
has no solution. Then is equal to :
(1) -4 (2) 4 (3) 8 (4) -8
MathonGo Answer Key : (2)
02 April (Morning Shift)
Answer Keys
JEE Main 2026
MathonGo
#PaperPhodnaHai
www.mathongo.com
\\alpha, \\alpha + 2, \\alpha \\in Z
x(x + 2) + (x + 1)(x + 3) + (x + 2)(x + 4) + … + (x + n − 1)(x + n + 1) = 4n n \\in N n + \\alpha
0 1 2 3
x y 50 (
2x
1 + 3i
−
y
1 − 2i
) = 31 + 17i i = \\sqrt{-1} 10(x − 3y)
20 31 35 75
`;

const qs = parseQuestions(ocr);
console.log(JSON.stringify(qs, null, 2));
function isLowQuality(questions) {
  if (!questions.length) return true;
  const singles = questions.filter((q) => q.type === 'single');
  if (!singles.length) return false;
  const emptyOpts = singles.filter((q) => !q.options.some((o) => String(o.text).trim())).length;
  return emptyOpts / singles.length > 0.4;
}
console.log('isLowQuality:', isLowQuality(qs));
