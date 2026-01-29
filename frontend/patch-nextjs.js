const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules/next/dist/build/generate-build-id.js');
let content = fs.readFileSync(filePath, 'utf8');

// Patch to handle undefined generate function (Node.js 24 compatibility)
const oldCode = 'async function generateBuildId(generate, fallback) {\n    let buildId = await generate();';
const newCode = `async function generateBuildId(generate, fallback) {
    // Patched for Node.js 24 compatibility
    let buildId = typeof generate === 'function' ? await generate() : null;`;

// Check if already patched
if (content.includes('// Patched for Node.js 24 compatibility')) {
  console.log('Already patched, skipping');
} else if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(filePath, content);
  console.log('Patched generate-build-id.js successfully');
} else {
  console.log('Could not find target code to patch (different Next.js version?)');
}
