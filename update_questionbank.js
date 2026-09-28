const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'questionBank.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// The file exports `questionBank` array. We will parse it and rewrite.
// Since it's a TS file with `export const questionBank = [ ... ];`
// Let's use regex or just require it if we compile it.
// Simpler: regex replace the "a": "..." lines if they are inside these intents?
// It's safer to read the array, modify it, and stringify it back.
