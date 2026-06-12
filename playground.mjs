// Temporary scratch file for manually testing the package.
// Run with: npm run build && node playground.mjs
// Delete this file when you're done.

import { toWords, toNumber } from './dist/index.js';

const numbers = [0, 5, 21, 35, 100, 200, 350, 999, 1000, 1500, 2550, 12345, 100000, 10000000];

for (const n of numbers) {
  const words = toWords(n);
  console.log(`${n} -> ${words} -> ${toNumber(words)}`);
}

console.log(toWords(2550, { currency: true }));
console.log(toWords(3, { ordinal: true }));
console.log(toWords(-42));
