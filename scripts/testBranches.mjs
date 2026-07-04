import { getBranch, BRANCHES } from '../src/data/branches.js';
console.log("Branches array length:", BRANCHES.length);
const b = getBranch('ai-data-science');
console.log("ai-data-science branch exists:", !!b);
